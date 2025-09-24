import React from 'react';
import { PaymentPlanBreakdown } from '../types/dashboard';

interface PaymentPlanBreakdownCardProps {
  data: PaymentPlanBreakdown;
}

export const PaymentPlanBreakdownCard: React.FC<PaymentPlanBreakdownCardProps> = ({ data }) => {
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
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Payment Plans (Finite)</h3>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-emerald-50 rounded-lg p-4 text-center">
          <p className="text-xs text-emerald-600 font-medium mb-2">New Plans Started</p>
          <p className="text-lg font-bold text-emerald-900 mb-1">{data.newPlansStarted}</p>
          <p className="text-sm font-semibold text-emerald-700">{formatCurrency(data.newPlansRevenue)}</p>
        </div>
        
        <div className="bg-amber-50 rounded-lg p-4 text-center">
          <p className="text-xs text-amber-600 font-medium mb-2">Continuing Installments</p>
          <p className="text-lg font-bold text-amber-900 mb-1">{data.continuingInstallments}</p>
          <p className="text-sm font-semibold text-amber-700">{formatCurrency(data.continuingRevenue)}</p>
        </div>
        
        <div className="bg-indigo-50 rounded-lg p-4 text-center">
          <p className="text-xs text-indigo-600 font-medium mb-2">Total PP Revenue</p>
          <p className="text-2xl font-bold text-indigo-900">{formatCurrency(data.paymentPlanRevenue)}</p>
        </div>
      </div>
    </div>
  );
};