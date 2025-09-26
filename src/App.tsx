import { useState, useMemo, useEffect } from 'react';
import { DollarSign, Users, CreditCard, TrendingUp, UserPlus, FileText, BarChart3 } from 'lucide-react';
import { GlobalControls } from './components/GlobalControls';
import { MetricCard } from './components/MetricCard';
import { ProductCard } from './components/ProductCard';
import { SubscriptionBreakdownCard } from './components/SubscriptionBreakdownCard';
import { PaymentPlanBreakdownCard } from './components/PaymentPlanBreakdownCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { ExportButtons } from './components/ExportButtons';
import { Product, DateRange, ProductFilter, DailyData, GlobalMetrics, SubscriptionBreakdown, PaymentPlanBreakdown, TransactionData } from './types/dashboard';
import { getSupabase } from './lib/supabaseClient';
import { dataConfig } from './lib/dataConfig';

function App() {
  // Basic UI constants (non-mock). These are just filter options, not data.
  const dateRanges: DateRange[] = [
    { start: '2025-01-01', end: '2025-12-31', label: 'This Year' },
    { start: '2025-09-01', end: '2025-09-30', label: 'This Month' },
  ];
  const productFilters: ProductFilter[] = [
    { value: 'all', label: 'All Products' },
    { value: 'subscription', label: 'Subscriptions' },
    { value: 'payment_plan', label: 'Payment Plans' },
    { value: 'one_time', label: 'One-time' },
  ];

  const [selectedDateRange, setSelectedDateRange] = useState<DateRange>(dateRanges[1] ?? dateRanges[0]);
  const [selectedProductFilter, setSelectedProductFilter] = useState<ProductFilter>(productFilters[0]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Empty baseline data (no mock values). Replace with Supabase-backed data fetching later.
  const [products, setProducts] = useState<Product[]>([]);
  const [transactionData, setTransactionData] = useState<TransactionData[]>([]);
  const [metrics, setMetrics] = useState<GlobalMetrics>({
    mtdRevenue: 0,
    activeSubscriptions: 0,
    activePaymentPlans: 0,
    churnRate: 0,
    newCustomers: 0,
    newPaymentPlansStarted: 0,
    newPaymentPlansRevenue: 0,
    subscriptionNetChange: 0,
  });
  const [subscriptionBreakdown, setSubscriptionBreakdown] = useState<SubscriptionBreakdown>({
    newSubs: 0,
    recurringBills: 0,
    cancellations: 0,
    churnRate: 0,
    subscriptionRevenue: 0,
  });
  const [paymentPlanBreakdown, setPaymentPlanBreakdown] = useState<PaymentPlanBreakdown>({
    newPlansStarted: 0,
    newPlansRevenue: 0,
    continuingInstallments: 0,
    continuingRevenue: 0,
    paymentPlanRevenue: 0,
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Filter products based on selected filter
  const filteredProducts = useMemo(() => {
    if (selectedProductFilter.value === 'all') {
      return products;
    }
    return products.filter(product => product.type === selectedProductFilter.value);
  }, [selectedProductFilter, products]);

  // Build daily data from transactionData for the selected product
  const generateDailyData = (product: Product): DailyData[] => {
    const totals = new Map<string, { revenue: number; count: number }>();
    for (const t of transactionData) {
      if (t.productName !== product.name) continue;
      const day = new Date(t.date).toISOString().split('T')[0];
      const prev = totals.get(day) || { revenue: 0, count: 0 };
      const amt = typeof t.totalPrice === 'number' && t.totalPrice > 0 ? t.totalPrice : (t.amount || 0);
      totals.set(day, { revenue: prev.revenue + amt, count: prev.count + 1 });
    }
    // Sort by date ascending and map to array
    return Array.from(totals.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([date, v]) => ({ date, revenue: v.revenue, count: v.count }));
  };

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const getProductTransactions = (productName: string) => {
    return transactionData.filter(t => t.productName === productName);
  };

  // Load transactions from Supabase when date range changes
  useEffect(() => {
    const load = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const { start, end } = selectedDateRange;
        const sb = getSupabase() as any;
        const tableCandidates = dataConfig.transactionTables;
        let data: any[] | null = null;
        let lastErr: any = null;
        for (const t of tableCandidates) {
          const { data: d, error: e } = await sb.from(t).select('*');
          if (!e) { data = d as any[]; break; }
          lastErr = e;
        }
        if (!data) throw lastErr || new Error('No transaction table found');

        // Detect a usable date field and filter client-side to avoid column name mismatches
        const dateFieldCandidates = dataConfig.dateColumns;
        const chooseDateField = (row: any): string | null => {
          for (const key of dateFieldCandidates) if (key in row) return key;
          return null;
        };
        const detectedDateField = (data && data.length > 0) ? chooseDateField(data[0]) : 'date';

        const inRange = (row: any) => {
          if (!detectedDateField) return true;
          const v = row[detectedDateField];
          if (!v) return false;
          const d = new Date(typeof v === 'string' ? v : String(v));
          return d >= new Date(start) && d <= new Date(end);
        };

        const filtered = (data ?? []).filter(inRange);

        // Optionally enrich with payment details by matching transaction id
        const txIdCandidates = dataConfig.transactionIdColumns;
        const getTxId = (row: any): string | null => {
          for (const k of txIdCandidates) if (k in row && row[k]) return String(row[k]);
          return null;
        };
        const txIds = Array.from(new Set(filtered.map(getTxId).filter(Boolean))) as string[];

        let payments: any[] = [];
        if (txIds.length > 0) {
          const paymentTables = dataConfig.paymentTables;
          const paymentIdCandidates = dataConfig.transactionIdColumns;
          let fetched: any[] | null = null;

          // Try to use an efficient IN query by guessing payment table id column
          for (const pt of paymentTables) {
            for (const idCol of paymentIdCandidates) {
              const { data: pd, error: pe } = await (sb.from(pt).select('*') as any).in(idCol, txIds);
              if (!pe && pd) { fetched = pd as any[]; break; }
            }
            if (fetched) break;
          }

          // Fallback: fetch full table and filter client-side
          if (!fetched) {
            for (const pt of paymentTables) {
              const { data: pd, error: pe } = await sb.from(pt).select('*');
              if (!pe && pd) { fetched = pd as any[]; break; }
            }
          }

          payments = fetched ?? [];

          // Build a lookup map from payment rows by detected id
          const paymentKeyFor = (row: any): string | null => {
            for (const k of paymentIdCandidates) if (k in row && row[k]) return String(row[k]);
            return null;
          };
          const payMap = new Map<string, any>();
          for (const p of payments) {
            const key = paymentKeyFor(p);
            if (key) payMap.set(key, p);
          }

          // Merge payment details into filtered rows when fields are missing
          for (const r of filtered) {
            const txId = getTxId(r);
            if (!txId) continue;
            const p = payMap.get(txId);
            if (!p) continue;
            r.product_name = r.product_name ?? p.product_name ?? p.name ?? r.productName;
            r.productName = r.productName ?? p.productName ?? p.name ?? r.product_name;
            r.product_type = r.product_type ?? p.product_type ?? p.type ?? r.productType;
            r.productType = r.productType ?? p.productType ?? p.type ?? r.product_type;
            // amount candidates
            r.amount = r.amount ?? p.amount ?? p.price ?? p.product_price ?? p.total ?? p.total_amount ?? p.amount_total ?? p.gross ?? p.net ?? p.unit_amount ?? p.subtotal;
            r.price = r.price ?? p.price ?? p.amount ?? p.product_price;
            r.customer_id = r.customer_id ?? p.customer_id ?? p.customerId;
            r.customerId = r.customerId ?? p.customerId ?? p.customer_id;
            // customer/email/name candidates
            r.normalized_email = r.normalized_email ?? p.normalized_email ?? p.email ?? p.Email ?? p.customer_email ?? p.buyer_email ?? p.customer_name ?? p.buyer_name;
            r.email = r.email ?? p.email ?? p.Email ?? p.normalized_email ?? p.customer_email ?? p.buyer_email;
            // set explicit full-name fields so mapping can pick them up
            r.customer_name = r.customer_name ?? p.customer_name ?? p.full_name ?? p.fullname ?? p["Full Name"]; 
            // also copy Full Name into a property with space to match mapping branch
            if (!r["Full Name"]) { r["Full Name"] = p["Full Name"] ?? p.full_name ?? p.fullname ?? p.customer_name; }
            r.source_platform = r.source_platform ?? p.source_platform ?? p.platform;
            r.funnel_label = r.funnel_label ?? p.funnel_label ?? p.funnel;
            r.date = r.date ?? p.date ?? p.created_at ?? r.date;
            r.created_at = r.created_at ?? p.created_at ?? r.created_at;
          }
        }

        // Helper to parse numeric strings like "199" or "$199"
        const num = (v: any): number => {
          if (v == null) return 0;
          if (typeof v === 'number') return v;
          if (typeof v === 'string') {
            const n = parseFloat(v.replace(/[^0-9.-]/g, ''));
            return isNaN(n) ? 0 : n;
          }
          return 0;
        };

        // Map raw rows to TransactionData shape with fallbacks for column naming
        const rows: TransactionData[] = filtered.map((r: any): TransactionData => ({
          date: (detectedDateField ? (r[detectedDateField] ?? '') : (r.date ?? r.created_at ?? '')),
          orderId: r.order_id ?? r.orderId ?? (r['Transaction ID'] ?? ''),
          productName: (r.product_name ?? r.productName ?? r['productName'] ?? r['product Name'] ?? 'Unknown Product')?.toString().trim(),
          productType: (r.product_type ?? r.productType ?? 'one_time') as TransactionData['productType'],
          eventType: (r.event_type ?? r.eventType ?? 'one_time') as TransactionData['eventType'],
          amount: num(r.amount ?? r.price ?? r.product_price),
          customerId: r.customer_id ?? r.customerId ?? '',
          normalizedEmail: r.normalized_email ?? r.email ?? r['Email'] ?? '',
          customerName: r.customer_name ?? r.full_name ?? r.fullname ?? r['Full Name'] ?? r.buyer_name ?? r.customer ?? undefined,
          qty: Number(r.QTY ?? r.qty ?? 0),
          priceName: r.priceName ?? r['priceName'] ?? r['price name'] ?? undefined,
          unitPrice: num(r.untiPrice ?? r.unitPrice ?? r.price ?? 0),
          totalPrice: num(r.totalPrice ?? 0),
          sourcePlatform: (r.source_platform ?? r.sourcePlatform ?? 'GHL') as TransactionData['sourcePlatform'],
          funnelLabel: r.funnel_label ?? r.funnelLabel ?? '',
        }));

        setTransactionData(rows);

        // Compute aggregates from rows
        const sum = (arr: number[]) => arr.reduce((a, b) => a + b, 0);
        const pref = (r: TransactionData) => (typeof r.totalPrice === 'number' && r.totalPrice > 0 ? r.totalPrice : r.amount || 0);
        const byType = (type: TransactionData['productType']) => rows.filter((r: TransactionData) => r.productType === type);
        const subs = byType('subscription');
        const pps = byType('payment_plan');

        // Subscription breakdown
        const subNew = subs.filter((r: TransactionData) => r.eventType === 'sub_new');
        const subRecurring = subs.filter((r: TransactionData) => r.eventType === 'sub_recurring');
        const subCancel = subs.filter((r: TransactionData) => r.eventType === 'sub_cancel');
        const subRevenue = sum(subs.map((r) => pref(r)));
        const churnRate = subNew.length + subRecurring.length > 0
          ? Number(((subCancel.length / (subNew.length + subRecurring.length)) * 100).toFixed(1))
          : 0;

        const subBreakdown: SubscriptionBreakdown = {
          newSubs: subNew.length,
          recurringBills: subRecurring.length,
          cancellations: subCancel.length,
          churnRate,
          subscriptionRevenue: subRevenue,
        };
        setSubscriptionBreakdown(subBreakdown);

        // Payment plan breakdown
        const ppNew = pps.filter((r: TransactionData) => r.eventType === 'pp_new');
        const ppInst = pps.filter((r: TransactionData) => r.eventType === 'pp_installment');
        const ppNewRevenue = sum(ppNew.map((r) => pref(r)));
        const ppInstRevenue = sum(ppInst.map((r) => pref(r)));
        const ppRevenue = sum(pps.map((r) => pref(r)));
        const ppBreakdown: PaymentPlanBreakdown = {
          newPlansStarted: ppNew.length,
          newPlansRevenue: ppNewRevenue,
          continuingInstallments: ppInst.length,
          continuingRevenue: ppInstRevenue,
          paymentPlanRevenue: ppRevenue,
        };
        setPaymentPlanBreakdown(ppBreakdown);

        // Global metrics
        const mtdRevenue = sum(rows.map((r) => pref(r)));
        const newCustomers = new Set(rows.map(r => r.customerId || r.normalizedEmail)).size;
        const global: GlobalMetrics = {
          mtdRevenue,
          activeSubscriptions: subRecurring.length, // proxy in absence of explicit active flag
          activePaymentPlans: ppInst.length, // proxy
          churnRate: subBreakdown.churnRate,
          newCustomers,
          newPaymentPlansStarted: ppBreakdown.newPlansStarted,
          newPaymentPlansRevenue: ppBreakdown.newPlansRevenue,
          subscriptionNetChange: subBreakdown.newSubs - subBreakdown.cancellations,
        };
        setMetrics(global);

        // Products aggregation
        const groups = new Map<string, { name: string; type: Product['type']; items: TransactionData[] }>();
        for (const row of rows) {
          const key = `${row.productName}|${row.productType}`;
          if (!groups.has(key)) {
            groups.set(key, { name: row.productName, type: row.productType, items: [] });
          }
          groups.get(key)!.items.push(row);
        }

        const productSummaries: Product[] = Array.from(groups.values()).map(g => {
          const revenue = sum(g.items.map((i) => pref(i)));
          const txCount = g.items.length;

          if (g.type === 'subscription') {
            const newSubsP = g.items.filter((i: TransactionData) => i.eventType === 'sub_new').length;
            const recurringP = g.items.filter((i: TransactionData) => i.eventType === 'sub_recurring').length;
            const cancelsP = g.items.filter((i: TransactionData) => i.eventType === 'sub_cancel').length;
            const churnP = newSubsP + recurringP > 0 ? Number(((cancelsP / (newSubsP + recurringP)) * 100).toFixed(1)) : 0;
            return {
              name: g.name,
              type: g.type,
              mtdRevenue: revenue,
              transactions: txCount,
              activeSubs: recurringP,
              newSubs: newSubsP,
              recurringBills: recurringP,
              cancellations: cancelsP,
              churnRate: churnP,
            };
          }

          if (g.type === 'payment_plan') {
            const newStarts = g.items.filter((i: TransactionData) => i.eventType === 'pp_new');
            const installments = g.items.filter((i: TransactionData) => i.eventType === 'pp_installment');
            return {
              name: g.name,
              type: g.type,
              mtdRevenue: revenue,
              transactions: txCount,
              newPlansStarted: newStarts.length,
              newPlansRevenue: sum(newStarts.map((i) => pref(i))),
              continuingInstallments: installments.length,
              continuingRevenue: sum(installments.map((i) => pref(i))),
            };
          }

          // one_time
          const customers = new Set(g.items.map(i => i.customerId || i.normalizedEmail)).size;
          const aov = txCount > 0 ? Number((revenue / txCount).toFixed(0)) : 0;
          return {
            name: g.name,
            type: g.type,
            mtdRevenue: revenue,
            transactions: txCount,
            newCustomers: customers,
            aov,
          };
        });

        setProducts(productSummaries);
      } catch (err) {
        console.error('Failed to load data from Supabase:', err);
        setError(err instanceof Error ? err.message : 'Failed to load data');
        setTransactionData([]);
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, [selectedDateRange]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Learn Voice Acting</h1>
              <p className="text-lg text-gray-600 mt-1">Finance Dashboard</p>
            </div>
            <ExportButtons 
              transactions={transactionData}
              products={filteredProducts}
              metrics={metrics}
              dateRange={selectedDateRange}
            />
          </div>
        </div>

        {/* Global Controls */}
        <GlobalControls
          selectedDateRange={selectedDateRange}
          selectedProductFilter={selectedProductFilter}
          dateRanges={dateRanges}
          productFilters={productFilters}
          onDateRangeChange={setSelectedDateRange}
          onProductFilterChange={setSelectedProductFilter}
        />

        {/* Loading / Error States */}
        {isLoading && (
          <div className="mb-6 p-4 rounded-lg bg-blue-50 text-blue-700 border border-blue-100">
            Loading latest transactions and metrics...
          </div>
        )}
        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-50 text-red-700 border border-red-100">
            {error}
          </div>
        )}

        {/* Enhanced Top Level Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-6 mb-8">
          <MetricCard
            title="Month-to-Date Revenue"
            value={formatCurrency(metrics.mtdRevenue)}
            subtitle="Total revenue this period"
            trend="up"
            icon={<DollarSign className="w-6 h-6" />}
          />
          <MetricCard
            title="Active Subscriptions"
            value={metrics.activeSubscriptions}
            subtitle="Ongoing memberships"
            icon={<Users className="w-6 h-6" />}
            tooltip="Ongoing subscriptions until canceled"
          />
          <MetricCard
            title="Active Payment Plans"
            value={metrics.activePaymentPlans}
            subtitle="Open installment plans"
            icon={<CreditCard className="w-6 h-6" />}
            tooltip="Open installment plans with remaining balance"
          />
          <MetricCard
            title="Churn Rate"
            value={`${metrics.churnRate}%`}
            subtitle="Monthly subscription churn"
            trend="down"
            icon={<TrendingUp className="w-6 h-6" />}
          />
          <MetricCard
            title="New Customers"
            value={metrics.newCustomers}
            subtitle="First-ever purchases"
            trend="up"
            icon={<UserPlus className="w-6 h-6" />}
          />
          <MetricCard
            title="New Payment Plans"
            value={`${metrics.newPaymentPlansStarted} • ${formatCurrency(metrics.newPaymentPlansRevenue)}`}
            subtitle="Plans started this period"
            icon={<FileText className="w-6 h-6" />}
          />
          <MetricCard
            title="Subscription Net Change"
            value={`+${metrics.subscriptionNetChange}`}
            subtitle="New subs minus cancellations"
            trend="up"
            icon={<BarChart3 className="w-6 h-6" />}
          />
        </div>

        {/* Category Breakdown - Split into two sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <SubscriptionBreakdownCard data={subscriptionBreakdown} />
          <PaymentPlanBreakdownCard data={paymentPlanBreakdown} />
        </div>

        {/* Products Section */}
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Product Performance</h2>
          <p className="text-gray-600">
            {selectedProductFilter.value === 'all' 
              ? 'All products with type-specific metrics' 
              : `${selectedProductFilter.label} products only`}
          </p>
        </div>

        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product, index) => (
              <ProductCard 
                key={index} 
                product={product} 
                onClick={() => handleProductClick(product)}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-gray-300 bg-white p-12 text-center text-gray-500">
            {isLoading ? 'Loading products...' : 'No products found for this period.'}
          </div>
        )}

        {/* Product Detail Modal */}
        {selectedProduct && (
          <ProductDetailModal
            product={selectedProduct}
            transactions={getProductTransactions(selectedProduct.name)}
            dailyData={generateDailyData(selectedProduct)}
            isOpen={isModalOpen}
            onClose={() => {
              setIsModalOpen(false);
              setSelectedProduct(null);
            }}
          />
        )}

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <p className="text-sm text-gray-500">
              Dashboard updated in real-time • Period: {selectedDateRange.label} • Last refresh: {new Date().toLocaleTimeString()}
            </p>
            <div className="flex items-center text-sm text-gray-500">
              <span className="mr-2">Showing Products:</span>
              <span className="font-semibold">{filteredProducts.length} of {products.length}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;