import React from 'react';
import { X, Calendar, DollarSign } from 'lucide-react';
import { Product, TransactionData, DailyData } from '../types/dashboard';

interface ProductDetailModalProps {
  product: Product;
  transactions: TransactionData[];
  dailyData: DailyData[];
  isOpen: boolean;
  onClose: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  transactions,
  dailyData,
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const getEventTypeLabel = (eventType: string) => {
    const labels: { [key: string]: string } = {
      'sub_new': 'New Subscription',
      'sub_recurring': 'Recurring Bill',
      'sub_cancel': 'Cancellation',
      'pp_new': 'New Plan',
      'pp_installment': 'Installment',
      'one_time': 'One-time Purchase'
    };
    return labels[eventType] || eventType;
  };

  const renderPaymentPlanBreakdown = () => {
    if (product.type !== 'payment_plan') return null;

    return (
      <div className="mb-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Payment Plan Summary</h4>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-blue-50 rounded-lg p-4 text-center">
            <p className="text-xs text-blue-600 font-medium mb-2">New Plans Started</p>
            <p className="text-lg font-bold text-blue-900">{product.newPlansStarted}</p>
            <p className="text-sm text-blue-700">{formatCurrency(product.newPlansRevenue || 0)}</p>
          </div>
          <div className="bg-amber-50 rounded-lg p-4 text-center">
            <p className="text-xs text-amber-600 font-medium mb-2">Continuing Installments</p>
            <p className="text-lg font-bold text-amber-900">{product.continuingInstallments}</p>
            <p className="text-sm text-amber-700">{formatCurrency(product.continuingRevenue || 0)}</p>
          </div>
          <div className="bg-green-50 rounded-lg p-4 text-center">
            <p className="text-xs text-green-600 font-medium mb-2">Total Transactions</p>
            <p className="text-lg font-bold text-green-900">{product.transactions}</p>
          </div>
          <div className="bg-purple-50 rounded-lg p-4 text-center">
            <p className="text-xs text-purple-600 font-medium mb-2">New Customers</p>
            <p className="text-lg font-bold text-purple-900">{product.newCustomers}</p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{product.name}</h2>
            <p className="text-sm text-gray-600 capitalize">{product.type.replace('_', ' ')} Product</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        <div className="p-6">
          {/* Daily Revenue Chart */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              Daily Performance
            </h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-end space-x-2 h-32">
                {dailyData.map((day, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <div 
                      className="bg-blue-500 rounded-t w-full min-h-[4px]"
                      style={{ 
                        height: `${Math.max(4, (day.revenue / Math.max(...dailyData.map(d => d.revenue))) * 100)}px` 
                      }}
                    />
                    <div className="text-xs text-gray-600 mt-2 text-center">
                      <div>{formatDate(day.date)}</div>
                      <div className="font-semibold">{formatCurrency(day.revenue)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Payment Plan Breakdown */}
          {renderPaymentPlanBreakdown()}

          {/* Transaction History */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <DollarSign className="w-5 h-5 mr-2" />
              Transaction History
            </h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Event
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {transactions.map((transaction, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDate(transaction.date)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {transaction.normalizedEmail}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {getEventTypeLabel(transaction.eventType)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {transaction.amount > 0 ? formatCurrency(transaction.amount) : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};