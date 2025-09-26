export interface DataConfig {
  transactionTables: string[];
  paymentTables: string[];
  transactionIdColumns: string[]; // columns that identify a transaction id across tables
  dateColumns: string[]; // preferred date columns, in order
  productNameColumns: string[];
  productTypeColumns: string[];
  amountColumns: string[];
  customerIdColumns: string[];
  emailColumns: string[];
  sourceColumns: string[];
  funnelColumns: string[];
}

// You can customize this file to match your Supabase schema without touching the loader logic.
export const dataConfig: DataConfig = {
  transactionTables: ['transaction', 'transactions'],
  paymentTables: ['payment', 'payments', 'payment_detail', 'payment_details'],
  transactionIdColumns: ['TransactionID', 'Transaction ID', 'transaction_id', 'transactionId', 'tx_id', 'txId', 'id'],
  dateColumns: ['date', 'created_at', 'timestamp', 'order_date', 'orderDate'],
  productNameColumns: ['product_name', 'productName', 'name'],
  productTypeColumns: ['product_type', 'productType', 'type'],
  amountColumns: ['amount', 'price', 'product_price', 'totalamount', 'total_amount', 'amount_total'],
  customerIdColumns: ['customer_id', 'customerId'],
  emailColumns: ['normalized_email', 'email', 'Email', 'customer_name', 'buyer_name', 'full_name', 'fullname', 'Full Name'],
  sourceColumns: ['source_platform', 'platform', 'source'],
  funnelColumns: ['funnel_label', 'funnel'],
};
