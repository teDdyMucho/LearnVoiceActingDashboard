import React from 'react';
import { Product } from '../types/dashboard';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-200 hover:border-blue-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 truncate">{product.name}</h3>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-blue-50 rounded-lg p-3">
          <p className="text-xs text-blue-600 font-medium mb-1">MTD Revenue</p>
          <p className="text-lg font-bold text-blue-900">{formatCurrency(product.mtdRevenue)}</p>
        </div>
        
        <div className="bg-green-50 rounded-lg p-3">
          <p className="text-xs text-green-600 font-medium mb-1">Transactions</p>
          <p className="text-lg font-bold text-green-900">{product.transactions}</p>
        </div>
        
        <div className="bg-purple-50 rounded-lg p-3">
          <p className="text-xs text-purple-600 font-medium mb-1">New Sales</p>
          <p className="text-lg font-bold text-purple-900">{formatCurrency(product.newSalesRevenue)}</p>
        </div>
        
        <div className="bg-orange-50 rounded-lg p-3">
          <p className="text-xs text-orange-600 font-medium mb-1">Recurring</p>
          <p className="text-lg font-bold text-orange-900">{formatCurrency(product.recurringRevenue)}</p>
        </div>
      </div>
    </div>
  );
};