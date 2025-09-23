export interface Product {
  name: string;
  mtdRevenue: number;
  transactions: number;
  newSalesRevenue: number;
  recurringRevenue: number;
}

export interface GlobalMetrics {
  mtdRevenue: number;
  paymentPlansActive: number;
  membershipsActive: number;
  churnRate: number;
}

export interface CategoryBreakdown {
  newSubs: number;
  recurringSubs: number;
  newSales: number;
  paymentPlanContinuation: number;
}

export interface TransactionData {
  id: string;
  product: string;
  type: 'new' | 'recurring' | 'payment_plan';
  amount: number;
  date: string;
  customer: string;
}