import React from 'react';
import { Product } from '../types/dashboard';

interface ProductCardProps {
  product: Product;
  onClick: () => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onClick }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'subscription': return 'bg-blue-100 text-blue-800';
      case 'payment_plan': return 'bg-green-100 text-green-800';
      case 'one_time': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const renderSubscriptionTiles = () => (
    <div className="grid grid-cols-2 gap-3">
      <div className="bg-blue-50 rounded-lg p-3">
        <p className="text-xs text-blue-600 font-medium mb-1">MTD Revenue</p>
        <p className="text-lg font-bold text-blue-900">{formatCurrency(product.mtdRevenue)}</p>
      </div>
      <div className="bg-green-50 rounded-lg p-3">
        <p className="text-xs text-green-600 font-medium mb-1">Active Subs</p>
        <p className="text-lg font-bold text-green-900">{product.activeSubs}</p>
      </div>
      <div className="bg-emerald-50 rounded-lg p-3">
        <p className="text-xs text-emerald-600 font-medium mb-1">New Subs</p>
        <p className="text-lg font-bold text-emerald-900">{product.newSubs}</p>
      </div>
      <div className="bg-orange-50 rounded-lg p-3">
        <p className="text-xs text-orange-600 font-medium mb-1">Churn Rate</p>
        <p className="text-lg font-bold text-orange-900">{product.churnRate}%</p>
      </div>
    </div>
  );

  const renderPaymentPlanTiles = () => (
    <div className="grid grid-cols-2 gap-3">
      <div className="bg-blue-50 rounded-lg p-3">
        <p className="text-xs text-blue-600 font-medium mb-1">MTD Revenue</p>
        <p className="text-lg font-bold text-blue-900">{formatCurrency(product.mtdRevenue)}</p>
      </div>
      <div className="bg-green-50 rounded-lg p-3">
        <p className="text-xs text-green-600 font-medium mb-1">Transactions</p>
        <p className="text-lg font-bold text-green-900">{product.transactions}</p>
      </div>
      <div className="bg-purple-50 rounded-lg p-3">
        <p className="text-xs text-purple-600 font-medium mb-1">New Customers</p>
        <p className="text-lg font-bold text-purple-900">{product.newCustomers}</p>
      </div>
      <div className="bg-emerald-50 rounded-lg p-3">
        <p className="text-xs text-emerald-600 font-medium mb-1">New Plans</p>
        <p className="text-sm font-bold text-emerald-900">{product.newPlansStarted}</p>
        <p className="text-xs text-emerald-700">{formatCurrency(product.newPlansRevenue || 0)}</p>
      </div>
    </div>
  );

  const renderPaymentPlanTilesSecondRow = () => (
    <div className="grid grid-cols-1 gap-3 mt-3">
      <div className="bg-amber-50 rounded-lg p-3">
        <p className="text-xs text-amber-600 font-medium mb-1">Installments</p>
        <p className="text-sm font-bold text-amber-900">{product.continuingInstallments}</p>
        <p className="text-xs text-amber-700">{formatCurrency(product.continuingRevenue || 0)}</p>
      </div>
    </div>
  );

  const renderOneTimeTiles = () => (
    <div className="grid grid-cols-2 gap-3">
      <div className="bg-blue-50 rounded-lg p-3">
        <p className="text-xs text-blue-600 font-medium mb-1">MTD Revenue</p>
        <p className="text-lg font-bold text-blue-900">{formatCurrency(product.mtdRevenue)}</p>
      </div>
      <div className="bg-green-50 rounded-lg p-3">
        <p className="text-xs text-green-600 font-medium mb-1">Transactions</p>
        <p className="text-lg font-bold text-green-900">{product.transactions}</p>
      </div>
      <div className="bg-purple-50 rounded-lg p-3">
        <p className="text-xs text-purple-600 font-medium mb-1">New Customers</p>
        <p className="text-lg font-bold text-purple-900">{product.newCustomers}</p>
      </div>
      <div className="bg-orange-50 rounded-lg p-3">
        <p className="text-xs text-orange-600 font-medium mb-1">AOV</p>
        <p className="text-lg font-bold text-orange-900">{formatCurrency(product.aov || 0)}</p>
      </div>
    </div>
  );

  return (
    <div 
      className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-200 hover:border-blue-200 cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 truncate pr-2">{product.name}</h3>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(product.type)}`}>
          {product.type.replace('_', ' ')}
        </span>
      </div>
      
      {product.type === 'subscription' && renderSubscriptionTiles()}
      {product.type === 'payment_plan' && (
        <>
          {renderPaymentPlanTiles()}
          {renderPaymentPlanTilesSecondRow()}
        </>
      )}
      {product.type === 'one_time' && renderOneTimeTiles()}
    </div>
  );
};