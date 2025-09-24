import { 
  Product, 
  GlobalMetrics, 
  SubscriptionBreakdown, 
  PaymentPlanBreakdown, 
  TransactionData,
  DateRange,
  ProductFilter,
  PaymentPlan
} from '../types/dashboard';

export const dateRanges: DateRange[] = [
  { start: '2024-12-01', end: '2024-12-31', label: 'This Month' },
  { start: '2024-11-01', end: '2024-11-30', label: 'Last Month' },
  { start: '2024-10-01', end: '2024-12-31', label: 'Last 3 Months' },
  { start: '2024-01-01', end: '2024-12-31', label: 'This Year' }
];

export const productFilters: ProductFilter[] = [
  { value: 'all', label: 'All Products' },
  { value: 'subscription', label: 'Subscriptions' },
  { value: 'payment_plan', label: 'Payment Plans' },
  { value: 'one_time', label: 'One-time' }
];

export const globalMetrics: GlobalMetrics = {
  mtdRevenue: 60000,
  activeSubscriptions: 77,
  activePaymentPlans: 62,
  churnRate: 3.2,
  newCustomers: 89,
  newPaymentPlansStarted: 30,
  newPaymentPlansRevenue: 23800,
  subscriptionNetChange: 9
};

export const subscriptionBreakdown: SubscriptionBreakdown = {
  newSubs: 14,
  recurringBills: 63,
  cancellations: 5,
  churnRate: 3.2,
  subscriptionRevenue: 14700
};

export const paymentPlanBreakdown: PaymentPlanBreakdown = {
  newPlansStarted: 30,
  newPlansRevenue: 23800,
  continuingInstallments: 44,
  continuingRevenue: 17100,
  paymentPlanRevenue: 40900
};

export const products: Product[] = [
  {
    name: 'Voice Acting Academy',
    type: 'payment_plan',
    mtdRevenue: 25500,
    transactions: 24,
    newCustomers: 6,
    newPlansStarted: 6,
    newPlansRevenue: 15000,
    continuingInstallments: 18,
    continuingRevenue: 10500
  },
  {
    name: 'LevelUp Lab',
    type: 'subscription',
    mtdRevenue: 8200,
    transactions: 45,
    activeSubs: 42,
    newSubs: 8,
    recurringBills: 34,
    cancellations: 3,
    churnRate: 2.1
  },
  {
    name: 'Academy After Hours',
    type: 'subscription',
    mtdRevenue: 6500,
    transactions: 38,
    activeSubs: 35,
    newSubs: 6,
    recurringBills: 29,
    cancellations: 2,
    churnRate: 1.8
  },
  {
    name: 'Masterclass Bundle',
    type: 'payment_plan',
    mtdRevenue: 12000,
    transactions: 20,
    newCustomers: 18,
    newPlansStarted: 18,
    newPlansRevenue: 7200,
    continuingInstallments: 2,
    continuingRevenue: 4800
  },
  {
    name: 'Add-On Products',
    type: 'one_time',
    mtdRevenue: 4500,
    transactions: 75,
    newCustomers: 65,
    aov: 60
  },
  {
    name: 'Pandora\'s VOX',
    type: 'payment_plan',
    mtdRevenue: 2100,
    transactions: 18,
    newCustomers: 4,
    newPlansStarted: 4,
    newPlansRevenue: 800,
    continuingInstallments: 14,
    continuingRevenue: 1300
  },
  {
    name: 'Talent Accelerator',
    type: 'payment_plan',
    mtdRevenue: 1500,
    transactions: 8,
    newCustomers: 2,
    newPlansStarted: 2,
    newPlansRevenue: 800,
    continuingInstallments: 6,
    continuingRevenue: 700
  },
  {
    name: 'Creating Charter Voices',
    type: 'one_time',
    mtdRevenue: 450,
    transactions: 9,
    newCustomers: 9,
    aov: 50
  },
  {
    name: 'Lightning Fast Voice',
    type: 'one_time',
    mtdRevenue: 250,
    transactions: 5,
    newCustomers: 5,
    aov: 50
  }
];

export const transactionData: TransactionData[] = [
  {
    date: '2024-12-01',
    orderId: 'ORD-001',
    productName: 'Voice Acting Academy',
    productType: 'payment_plan',
    eventType: 'pp_new',
    amount: 2500,
    customerId: 'CUST-001',
    normalizedEmail: 'john.smith@email.com',
    sourcePlatform: 'GHL',
    funnelLabel: 'Main Academy Funnel'
  },
  {
    date: '2024-12-02',
    orderId: 'ORD-002',
    productName: 'LevelUp Lab',
    productType: 'subscription',
    eventType: 'sub_new',
    amount: 197,
    customerId: 'CUST-002',
    normalizedEmail: 'jane.doe@email.com',
    sourcePlatform: 'Hyros',
    funnelLabel: 'LevelUp Lab Subscription'
  },
  {
    date: '2024-12-03',
    orderId: 'ORD-003',
    productName: 'Masterclass Bundle',
    productType: 'payment_plan',
    eventType: 'pp_new',
    amount: 597,
    customerId: 'CUST-003',
    normalizedEmail: 'mike.johnson@email.com',
    sourcePlatform: 'OCR',
    funnelLabel: 'Masterclass Promotion'
  },
  {
    date: '2024-12-04',
    orderId: 'ORD-004',
    productName: 'Voice Acting Academy',
    productType: 'payment_plan',
    eventType: 'pp_installment',
    amount: 833,
    customerId: 'CUST-004',
    normalizedEmail: 'sarah.wilson@email.com',
    sourcePlatform: 'GHL',
    funnelLabel: 'Main Academy Funnel'
  },
  {
    date: '2024-12-05',
    orderId: 'ORD-005',
    productName: 'Academy After Hours',
    productType: 'subscription',
    eventType: 'sub_recurring',
    amount: 197,
    customerId: 'CUST-005',
    normalizedEmail: 'david.brown@email.com',
    sourcePlatform: 'GHL',
    funnelLabel: 'After Hours Unlimited'
  },
  {
    date: '2024-12-06',
    orderId: 'ORD-006',
    productName: 'LevelUp Lab',
    productType: 'subscription',
    eventType: 'sub_cancel',
    amount: 0,
    customerId: 'CUST-006',
    normalizedEmail: 'lisa.garcia@email.com',
    sourcePlatform: 'Hyros',
    funnelLabel: 'LevelUp Lab Subscription'
  },
  {
    date: '2024-12-07',
    orderId: 'ORD-007',
    productName: 'Add-On Products',
    productType: 'one_time',
    eventType: 'one_time',
    amount: 47,
    customerId: 'CUST-007',
    normalizedEmail: 'tom.anderson@email.com',
    sourcePlatform: 'OCR',
    funnelLabel: 'Upsell Sequence'
  },
  {
    date: '2024-12-08',
    orderId: 'ORD-008',
    productName: 'Pandora\'s VOX',
    productType: 'payment_plan',
    eventType: 'pp_new',
    amount: 97,
    customerId: 'CUST-008',
    normalizedEmail: 'emily.davis@email.com',
    sourcePlatform: 'GHL',
    funnelLabel: 'Pandora VOX Launch'
  },
  {
    date: '2024-12-09',
    orderId: 'ORD-009',
    productName: 'Talent Accelerator',
    productType: 'payment_plan',
    eventType: 'pp_new',
    amount: 400,
    customerId: 'CUST-009',
    normalizedEmail: 'chris.martinez@email.com',
    sourcePlatform: 'Hyros',
    funnelLabel: 'Talent Accelerator Program'
  },
  {
    date: '2024-12-10',
    orderId: 'ORD-010',
    productName: 'Creating Charter Voices',
    productType: 'one_time',
    eventType: 'one_time',
    amount: 50,
    customerId: 'CUST-010',
    normalizedEmail: 'alex.thompson@email.com',
    sourcePlatform: 'OCR',
    funnelLabel: 'Charter Voices Workshop'
  }
];