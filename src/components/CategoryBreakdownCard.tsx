import React from 'react';
import { CategoryBreakdown } from '../types/dashboard';

interface CategoryBreakdownCardProps {
  data: CategoryBreakdown;
  churnRate: number;
}

export const CategoryBreakdownCard: React.FC<CategoryBreakdownCardProps> = ({ data, churnRate }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Category Breakdown</h3>
      
      <div className="space-y-6">
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3">Subscriptions (Recurring)</h4>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-xs text-gray-500 mb-1">New Subs</p>
              <p className="text-xl font-bold text-green-600">{data.newSubs}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-500 mb-1">Recurring</p>
              <p className="text-xl font-bold text-blue-600">{data.recurringSubs}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-500 mb-1">Churn Rate</p>
              <p className="text-xl font-bold text-red-600">{churnRate}%</p>
            </div>
          </div>
        </div>
        
        <div className="border-t pt-4">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Sales Revenue</h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-emerald-50 rounded-lg p-3 text-center">
              <p className="text-xs text-emerald-600 font-medium mb-1">New Sales</p>
              <p className="text-lg font-bold text-emerald-900">{formatCurrency(data.newSales)}</p>
            </div>
            <div className="bg-amber-50 rounded-lg p-3 text-center">
              <p className="text-xs text-amber-600 font-medium mb-1">Payment Plans</p>
              <p className="text-lg font-bold text-amber-900">{formatCurrency(data.paymentPlanContinuation)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};