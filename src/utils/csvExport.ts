import { TransactionData, Product, GlobalMetrics } from '../types/dashboard';

export const exportTransactionsToCSV = (transactions: TransactionData[]) => {
  const headers = ['ID', 'Product', 'Type', 'Amount', 'Date', 'Customer'];
  
  const csvContent = [
    headers.join(','),
    ...transactions.map(transaction => [
      transaction.id,
      `"${transaction.product}"`,
      transaction.type,
      transaction.amount,
      transaction.date,
      `"${transaction.customer}"`
    ].join(','))
  ].join('\n');
  
  downloadCSV(csvContent, 'transactions.csv');
};

export const exportProductSummaryToCSV = (products: Product[]) => {
  const headers = ['Product Name', 'MTD Revenue', 'Transactions', 'New Sales Revenue', 'Recurring Revenue'];
  
  const csvContent = [
    headers.join(','),
    ...products.map(product => [
      `"${product.name}"`,
      product.mtdRevenue,
      product.transactions,
      product.newSalesRevenue,
      product.recurringRevenue
    ].join(','))
  ].join('\n');
  
  downloadCSV(csvContent, 'product-summary.csv');
};

export const exportDashboardSummaryToCSV = (metrics: GlobalMetrics, products: Product[]) => {
  const totalTransactions = products.reduce((sum, product) => sum + product.transactions, 0);
  const totalNewSales = products.reduce((sum, product) => sum + product.newSalesRevenue, 0);
  const totalRecurring = products.reduce((sum, product) => sum + product.recurringRevenue, 0);
  
  const csvContent = [
    'Metric,Value',
    `MTD Revenue,$${metrics.mtdRevenue}`,
    `Payment Plans Active,${metrics.paymentPlansActive}`,
    `Memberships Active,${metrics.membershipsActive}`,
    `Churn Rate,${metrics.churnRate}%`,
    `Total Transactions,${totalTransactions}`,
    `Total New Sales Revenue,$${totalNewSales}`,
    `Total Recurring Revenue,$${totalRecurring}`,
    '',
    'Product Breakdown:',
    'Product Name,MTD Revenue,Transactions,New Sales,Recurring',
    ...products.map(product => [
      `"${product.name}"`,
      `$${product.mtdRevenue}`,
      product.transactions,
      `$${product.newSalesRevenue}`,
      `$${product.recurringRevenue}`
    ].join(','))
  ].join('\n');
  
  downloadCSV(csvContent, 'dashboard-summary.csv');
};

const downloadCSV = (content: string, filename: string) => {
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
};