import { TransactionData, Product, GlobalMetrics, DateRange } from '../types/dashboard';

// Hoisted function declaration so it can be used by helpers below
function downloadCSV(content: string, filename: string) {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

export const exportTransactionsToCSV = (transactions: TransactionData[], dateRange: DateRange) => {
  const headers = [
    'date',
    'order_id', 
    'product_name',
    'product_type',
    'event_type',
    'qty',
    'price_name',
    'unit_price',
    'total_price',
    'amount',
    'customer_id',
    'customer_name',
    'normalized_email',
    'source_platform',
    'funnel_label'
  ];
  
  const csvContent = [
    headers.join(','),
    ...transactions.map(transaction => [
      transaction.date,
      transaction.orderId,
      `"${transaction.productName}"`,
      transaction.productType,
      transaction.eventType,
      transaction.qty ?? '',
      transaction.priceName ? `"${transaction.priceName}"` : '',
      transaction.unitPrice ?? '',
      transaction.totalPrice ?? '',
      transaction.amount ?? '',
      transaction.customerId,
      transaction.customerName ? `"${transaction.customerName}"` : transaction.normalizedEmail,
      transaction.normalizedEmail,
      transaction.sourcePlatform,
      `"${transaction.funnelLabel}"`
    ].join(','))
  ].join('\n');
  
  downloadCSV(csvContent, `transactions-${dateRange.start}-to-${dateRange.end}.csv`);
};

export const exportProductSummaryToCSV = (products: Product[], dateRange: DateRange) => {
  const headers = [
    'product_name',
    'product_type',
    'active_subs',
    'new_subs',
    'cancellations',
    'sub_churn_rate',
    'pp_new_starts',
    'pp_installments',
    'mtd_revenue',
    'date_range_start',
    'date_range_end'
  ];

  const csvContent = [
    headers.join(','),
    ...products.map((product: Product) => [
      `"${product.name}"`,
      product.type,
      product.activeSubs ?? '',
      product.newSubs ?? '',
      product.cancellations ?? '',
      product.churnRate ?? '',
      product.newPlansStarted ?? '',
      product.continuingInstallments ?? '',
      product.mtdRevenue,
      dateRange.start,
      dateRange.end
    ].join(','))
  ].join('\n');

  downloadCSV(csvContent, `product-summary-${dateRange.start}-to-${dateRange.end}.csv`);
};

export const exportDashboardSummaryToCSV = (
  metrics: GlobalMetrics, 
  products: Product[], 
  dateRange: DateRange
) => {
  // Calculate category totals
  const subscriptionProducts = products.filter(p => p.type === 'subscription');
  const paymentPlanProducts = products.filter(p => p.type === 'payment_plan');
  const oneTimeProducts = products.filter(p => p.type === 'one_time');

  const subNewCount = subscriptionProducts.reduce((sum, p) => sum + (p.newSubs || 0), 0);
  const subRecurringCount = subscriptionProducts.reduce((sum, p) => sum + (p.recurringBills || 0), 0);
  const subCancellations = subscriptionProducts.reduce((sum, p) => sum + (p.cancellations || 0), 0);
  const subRevenue = subscriptionProducts.reduce((sum, p) => sum + p.mtdRevenue, 0);

  const ppNewCount = paymentPlanProducts.reduce((sum, p) => sum + (p.newPlansStarted || 0), 0);
  const ppInstallmentCount = paymentPlanProducts.reduce((sum, p) => sum + (p.continuingInstallments || 0), 0);
  const ppRevenueNew = paymentPlanProducts.reduce((sum, p) => sum + (p.newPlansRevenue || 0), 0);
  const ppRevenueInstallments = paymentPlanProducts.reduce((sum, p) => sum + (p.continuingRevenue || 0), 0);
  const ppRevenue = paymentPlanProducts.reduce((sum, p) => sum + p.mtdRevenue, 0);

  const oneTimeCount = oneTimeProducts.reduce((sum, p) => sum + p.transactions, 0);
  const oneTimeRevenue = oneTimeProducts.reduce((sum, p) => sum + p.mtdRevenue, 0);

  const csvContent = [
    'category,new_count,recurring_count,cancellations,churn_rate,revenue_new,revenue_recurring,revenue_total,date_range_start,date_range_end',
    [
      'Subscriptions',
      subNewCount,
      subRecurringCount,
      subCancellations,
      metrics.churnRate,
      subRevenue, // For subs, new and recurring are combined
      '',
      subRevenue,
      dateRange.start,
      dateRange.end
    ].join(','),
    [
      'Payment Plans',
      ppNewCount,
      ppInstallmentCount,
      '',
      '',
      ppRevenueNew,
      ppRevenueInstallments,
      ppRevenue,
      dateRange.start,
      dateRange.end
    ].join(','),
    [
      'One-time',
      oneTimeCount,
      '',
      '',
      '',
      oneTimeRevenue,
      '',
      oneTimeRevenue,
      dateRange.start,
      dateRange.end
    ].join(','),
    [
      'Total',
      subNewCount + ppNewCount + oneTimeCount,
      subRecurringCount + ppInstallmentCount,
      subCancellations,
      metrics.churnRate,
      subRevenue + ppRevenueNew + oneTimeRevenue,
      ppRevenueInstallments,
      metrics.mtdRevenue,
      dateRange.start,
      dateRange.end
    ].join(',')
  ].join('\n');
  
  downloadCSV(csvContent, `dashboard-summary-${dateRange.start}-to-${dateRange.end}.csv`);