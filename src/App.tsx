import React from 'react';
import { DollarSign, Users, CreditCard, TrendingUp } from 'lucide-react';
import { MetricCard } from './components/MetricCard';
import { ProductCard } from './components/ProductCard';
import { CategoryBreakdownCard } from './components/CategoryBreakdownCard';
import { ExportButtons } from './components/ExportButtons';
import { globalMetrics, categoryBreakdown, products, transactionData } from './data/mockData';

function App() {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Learn Voice Acting</h1>
              <p className="text-lg text-gray-600 mt-1">Finance Dashboard</p>
            </div>
            <ExportButtons 
              transactions={transactionData}
              products={products}
              metrics={globalMetrics}
            />
          </div>
        </div>

        {/* Top Level Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard
            title="Month-to-Date Revenue"
            value={formatCurrency(globalMetrics.mtdRevenue)}
            subtitle="Current month performance"
            trend="up"
            icon={<DollarSign className="w-6 h-6" />}
          />
          <MetricCard
            title="Payment Plans Active"
            value={globalMetrics.paymentPlansActive}
            subtitle="Finite recurring plans"
            icon={<CreditCard className="w-6 h-6" />}
          />
          <MetricCard
            title="Memberships Active"
            value={globalMetrics.membershipsActive}
            subtitle="Ongoing subscriptions"
            icon={<Users className="w-6 h-6" />}
          />
          <MetricCard
            title="Churn Rate"
            value={`${globalMetrics.churnRate}%`}
            subtitle="Monthly subscription churn"
            trend="down"
            icon={<TrendingUp className="w-6 h-6" />}
          />
        </div>

        {/* Category Breakdown */}
        <div className="mb-8">
          <CategoryBreakdownCard 
            data={categoryBreakdown} 
            churnRate={globalMetrics.churnRate}
          />
        </div>

        {/* Products Section */}
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Product Performance</h2>
          <p className="text-gray-600">Revenue and transaction breakdown by product line</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product, index) => (
            <ProductCard key={index} product={product} />
          ))}
        </div>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <p className="text-sm text-gray-500">
              Dashboard updated in real-time • Last refresh: {new Date().toLocaleTimeString()}
            </p>
            <div className="flex items-center text-sm text-gray-500">
              <span className="mr-2">Total Products:</span>
              <span className="font-semibold">{products.length}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;