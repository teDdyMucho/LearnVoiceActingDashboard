import { Product, GlobalMetrics, CategoryBreakdown, TransactionData } from '../types/dashboard';

export const globalMetrics: GlobalMetrics = {
  mtdRevenue: 60000,
  paymentPlansActive: 20,
  membershipsActive: 135,
  churnRate: 3.2
};

export const categoryBreakdown: CategoryBreakdown = {
  newSubs: 25,
  recurringSubs: 110,
  newSales: 45000,
  paymentPlanContinuation: 15000
};

export const products: Product[] = [
  {
    name: 'Voice Acting Academy',
    mtdRevenue: 20000,
    transactions: 4,
    newSalesRevenue: 15000,
    recurringRevenue: 5000
  },
  {
    name: 'Masterclass Bundle',
    mtdRevenue: 20000,
    transactions: 20,
    newSalesRevenue: 12000,
    recurringRevenue: 8000
  },
  {
    name: 'Add-On Products',
    mtdRevenue: 8000,
    transactions: 100,
    newSalesRevenue: 3000,
    recurringRevenue: 5000
  },
  {
    name: 'Academy After Hours',
    mtdRevenue: 4500,
    transactions: 15,
    newSalesRevenue: 2500,
    recurringRevenue: 2000
  },
  {
    name: 'LevelUp Lab',
    mtdRevenue: 3200,
    transactions: 12,
    newSalesRevenue: 1800,
    recurringRevenue: 1400
  },
  {
    name: 'Pandora\'s VOX',
    mtdRevenue: 2100,
    transactions: 8,
    newSalesRevenue: 1200,
    recurringRevenue: 900
  },
  {
    name: 'Talent Accelerator',
    mtdRevenue: 1500,
    transactions: 6,
    newSalesRevenue: 800,
    recurringRevenue: 700
  },
  {
    name: 'Creating Charter Voices',
    mtdRevenue: 450,
    transactions: 3,
    newSalesRevenue: 250,
    recurringRevenue: 200
  },
  {
    name: 'Lightning Fast Voice',
    mtdRevenue: 250,
    transactions: 2,
    newSalesRevenue: 150,
    recurringRevenue: 100
  }
];

export const transactionData: TransactionData[] = [
  { id: 'T001', product: 'Voice Acting Academy', type: 'new', amount: 2500, date: '2024-12-01', customer: 'John Smith' },
  { id: 'T002', product: 'Voice Acting Academy', type: 'recurring', amount: 500, date: '2024-12-02', customer: 'Jane Doe' },
  { id: 'T003', product: 'Masterclass Bundle', type: 'new', amount: 1200, date: '2024-12-03', customer: 'Mike Johnson' },
  { id: 'T004', product: 'Masterclass Bundle', type: 'payment_plan', amount: 400, date: '2024-12-04', customer: 'Sarah Wilson' },
  { id: 'T005', product: 'Add-On Products', type: 'new', amount: 150, date: '2024-12-05', customer: 'David Brown' },
  { id: 'T006', product: 'Academy After Hours', type: 'recurring', amount: 300, date: '2024-12-06', customer: 'Lisa Garcia' },
  { id: 'T007', product: 'LevelUp Lab', type: 'new', amount: 800, date: '2024-12-07', customer: 'Tom Anderson' },
  { id: 'T008', product: 'Pandora\'s VOX', type: 'payment_plan', amount: 250, date: '2024-12-08', customer: 'Emily Davis' },
  { id: 'T009', product: 'Talent Accelerator', type: 'new', amount: 600, date: '2024-12-09', customer: 'Chris Martinez' },
  { id: 'T010', product: 'Creating Charter Voices', type: 'recurring', amount: 200, date: '2024-12-10', customer: 'Alex Thompson' }
];