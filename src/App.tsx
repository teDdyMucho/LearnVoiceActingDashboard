import React, { useState, useMemo } from 'react';
import { DollarSign, Users, CreditCard, TrendingUp, UserPlus, FileText, BarChart3 } from 'lucide-react';
import { GlobalControls } from './components/GlobalControls';
import { MetricCard } from './components/MetricCard';
import { ProductCard } from './components/ProductCard';
import { SubscriptionBreakdownCard } from './components/SubscriptionBreakdownCard';
import { PaymentPlanBreakdownCard } from './components/PaymentPlanBreakdownCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { ExportButtons } from './components/ExportButtons';
import { 
  globalMetrics, 
  subscriptionBreakdown, 
  paymentPlanBreakdown, 
  products, 
  transactionData,
  dateRanges,
  productFilters
} from './data/mockData';
import { Product, DateRange, ProductFilter, DailyData } from './types/dashboard';

function App() {
  const [selectedDateRange, setSelectedDateRange] = useState<DateRange>(dateRanges[0]);
  const [selectedProductFilter, setSelectedProductFilter] = useState<ProductFilter>(productFilters[0]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
  }, [selectedProductFilter]);

  // Generate mock daily data for product detail modal
  const generateDailyData = (product: Product): DailyData[] => {
    const days = [];
    const startDate = new Date(selectedDateRange.start);
    const endDate = new Date(selectedDateRange.end);
    
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      days.push({
        date: d.toISOString().split('T')[0],
        revenue: Math.floor(Math.random() * (product.mtdRevenue / 10)) + 100,
        count: Math.floor(Math.random() * 5) + 1
      });
    }
    return days.slice(0, 10); // Show last 10 days
  };

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const getProductTransactions = (productName: string) => {
    return transactionData.filter(t => t.productName === productName);
  };

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
              metrics={globalMetrics}
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

        {/* Enhanced Top Level Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-6 mb-8">
          <MetricCard
            title="Month-to-Date Revenue"
            value={formatCurrency(globalMetrics.mtdRevenue)}
            subtitle="Total revenue this period"
            trend="up"
            icon={<DollarSign className="w-6 h-6" />}
          />
          <MetricCard
            title="Active Subscriptions"
            value={globalMetrics.activeSubscriptions}
            subtitle="Ongoing memberships"
            icon={<Users className="w-6 h-6" />}
            tooltip="Ongoing subscriptions until canceled"
          />
          <MetricCard
            title="Active Payment Plans"
            value={globalMetrics.activePaymentPlans}
            subtitle="Open installment plans"
            icon={<CreditCard className="w-6 h-6" />}
            tooltip="Open installment plans with remaining balance"
          />
          <MetricCard
            title="Churn Rate"
            value={`${globalMetrics.churnRate}%`}
            subtitle="Monthly subscription churn"
            trend="down"
            icon={<TrendingUp className="w-6 h-6" />}
          />
          <MetricCard
            title="New Customers"
            value={globalMetrics.newCustomers}
            subtitle="First-ever purchases"
            trend="up"
            icon={<UserPlus className="w-6 h-6" />}
          />
          <MetricCard
            title="New Payment Plans"
            value={`${globalMetrics.newPaymentPlansStarted} • ${formatCurrency(globalMetrics.newPaymentPlansRevenue)}`}
            subtitle="Plans started this period"
            icon={<FileText className="w-6 h-6" />}
          />
          <MetricCard
            title="Subscription Net Change"
            value={`+${globalMetrics.subscriptionNetChange}`}
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product, index) => (
            <ProductCard 
              key={index} 
              product={product} 
              onClick={() => handleProductClick(product)}
            />
          ))}
        </div>

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