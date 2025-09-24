import React from 'react';
import { Download } from 'lucide-react';
import { exportTransactionsToCSV, exportProductSummaryToCSV, exportDashboardSummaryToCSV } from '../utils/csvExport';
import { TransactionData, Product, GlobalMetrics, DateRange } from '../types/dashboard';

interface ExportButtonsProps {
  transactions: TransactionData[];
  products: Product[];
  metrics: GlobalMetrics;
  dateRange: DateRange;
}

export const ExportButtons: React.FC<ExportButtonsProps> = ({ 
  transactions, 
  products, 
  metrics, 
  dateRange 
}) => {
  return (
    <div className="flex flex-wrap gap-3">
      <button
        onClick={() => exportTransactionsToCSV(transactions, dateRange)}
        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
      >
        <Download className="w-4 h-4 mr-2" />
        Export Transactions
      </button>
      
      <button
        onClick={() => exportProductSummaryToCSV(products, dateRange)}
        className="inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors duration-200"
      >
        <Download className="w-4 h-4 mr-2" />
        Export Products
      </button>
      
      <button
        onClick={() => exportDashboardSummaryToCSV(metrics, products, dateRange)}
        className="inline-flex items-center px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors duration-200"
      >
        <Download className="w-4 h-4 mr-2" />
        Export Summary
      </button>
    </div>
  );
};