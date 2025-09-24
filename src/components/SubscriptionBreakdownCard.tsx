import React from 'react';
import { SubscriptionBreakdown } from '../types/dashboard';

interface SubscriptionBreakdownCardProps {
  data: SubscriptionBreakdown;
}

export const SubscriptionBreakdownCard: React.FC<SubscriptionBreakdownCardProps> = ({ data }) => {
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
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Subscriptions (Recurring)</h3>
      
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
        <div className="text-center">
          <p className="text-xs text-gray-500 mb-1">New Subs</p>
          <p className="text-xl font-bold text-green-600">{data.newSubs}</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-500 mb-1">Recurring Bills</p>
          <p className="text-xl font-bold text-blue-600">{data.recurringBills}</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-500 mb-1">Cancellations</p>
          <p className="text-xl font-bold text-red-600">{data.cancellations}</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-500 mb-1">Churn Rate</p>
          <p className="text-xl font-bold text-orange-600">{data.churnRate}%</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-500 mb-1">Sub Revenue</p>
          <p className="text-xl font-bold text-purple-600">{formatCurrency(data.subscriptionRevenue)}</p>
        </div>
      </div>
    </div>
  );
};