import React from 'react';
import { Calendar, Filter } from 'lucide-react';
import { DateRange, ProductFilter } from '../types/dashboard';

interface GlobalControlsProps {
  selectedDateRange: DateRange;
  selectedProductFilter: ProductFilter;
  dateRanges: DateRange[];
  productFilters: ProductFilter[];
  onDateRangeChange: (dateRange: DateRange) => void;
  onProductFilterChange: (filter: ProductFilter) => void;
}

export const GlobalControls: React.FC<GlobalControlsProps> = ({
  selectedDateRange,
  selectedProductFilter,
  dateRanges,
  productFilters,
  onDateRangeChange,
  onProductFilterChange
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-1">Dashboard Controls</h2>
          <p className="text-sm text-gray-600">Filter data by date range and product type</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Date Range Picker */}
          <div className="relative">
            <label className="block text-xs font-medium text-gray-700 mb-2">Date Range</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <select
                value={selectedDateRange.label}
                onChange={(e) => {
                  const range = dateRanges.find(r => r.label === e.target.value);
                  if (range) onDateRangeChange(range);
                }}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-white text-sm font-medium text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-w-[160px]"
              >
                {dateRanges.map((range) => (
                  <option key={range.label} value={range.label}>
                    {range.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Product Type Filter */}
          <div className="relative">
            <label className="block text-xs font-medium text-gray-700 mb-2">Product Type</label>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <select
                value={selectedProductFilter.value}
                onChange={(e) => {
                  const filter = productFilters.find(f => f.value === e.target.value);
                  if (filter) onProductFilterChange(filter);
                }}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-white text-sm font-medium text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-w-[160px]"
              >
                {productFilters.map((filter) => (
                  <option key={filter.value} value={filter.value}>
                    {filter.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};