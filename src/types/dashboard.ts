export interface Product {
  name: string;
  type: 'subscription' | 'payment_plan' | 'one_time';
  mtdRevenue: number;
  transactions: number;
  // Subscription-specific
  activeSubs?: number;
  newSubs?: number;
  recurringBills?: number;
  cancellations?: number;
  churnRate?: number;
  // Payment Plan-specific
  newPlansStarted?: number;
  newPlansRevenue?: number;
  continuingInstallments?: number;
  continuingRevenue?: number;
  plans?: PaymentPlan[];
  // One-time specific
  newCustomers?: number;
  aov?: number;
}

export interface PaymentPlan {
  name: string;
  newStarts: number;
  installments: number;
  revenueNew: number;
  revenueInstallments: number;
}

export interface GlobalMetrics {
  mtdRevenue: number;
  activeSubscriptions: number;
  activePaymentPlans: number;
  churnRate: number;
  newCustomers: number;
  newPaymentPlansStarted: number;
  newPaymentPlansRevenue: number;
  subscriptionNetChange: number;
}

export interface SubscriptionBreakdown {
  newSubs: number;
  recurringBills: number;
  cancellations: number;
  churnRate: number;
  subscriptionRevenue: number;
}

export interface PaymentPlanBreakdown {
  newPlansStarted: number;
  newPlansRevenue: number;
  continuingInstallments: number;
  continuingRevenue: number;
  paymentPlanRevenue: number;
}

export interface TransactionData {
  date: string;
  orderId: string;
  productName: string;
  productType: 'subscription' | 'payment_plan' | 'one_time';
  eventType: 'sub_new' | 'sub_recurring' | 'sub_cancel' | 'pp_new' | 'pp_installment' | 'one_time';
  amount: number;
  customerId: string;
  normalizedEmail: string;
  customerName?: string;
  qty?: number;
  priceName?: string;
  unitPrice?: number;
  totalPrice?: number;
  sourcePlatform: 'GHL' | 'Hyros' | 'OCR';
  funnelLabel: string;
}

export interface DateRange {
  start: string;
  end: string;
  label: string;
}

export interface ProductFilter {
  value: 'all' | 'subscription' | 'payment_plan' | 'one_time';
  label: string;
}

export interface ProductDetail {
  product: Product;
  dailyData: DailyData[];
  transactions: TransactionData[];
}

export interface DailyData {
  date: string;
  revenue: number;
  count: number;
}