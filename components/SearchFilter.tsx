'use client';

import { useState } from 'react';
import { Filter, X, Search, Car, Calendar, DollarSign } from 'lucide-react';

interface SearchFilterProps {
  onFilter: (filters: {
    type?: string;
    year?: string;
    priceMin?: string;
    priceMax?: string;
    search?: string;
  }) => void;
}

export default function SearchFilter({ onFilter }: SearchFilterProps) {
  const [filters, setFilters] = useState({
    type: '',
    year: '',
    priceMin: '',
    priceMax: '',
    search: '',
  });

  const [isExpanded, setIsExpanded] = useState(true);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);
    onFilter(newFilters);
  };

  const clearFilters = () => {
    const clearedFilters = { type: '', year: '', priceMin: '', priceMax: '', search: '' };
    setFilters(clearedFilters);
    onFilter(clearedFilters);
  };

  const hasActiveFilters = Object.values(filters).some(value => value !== '');

  return (
    <div className="bg-white dark:bg-[#1F1F2E] rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-800">
      {/* Header */}
      <div
        className="flex items-center justify-between p-6 cursor-pointer hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 dark:hover:from-[#2B2B3D] dark:hover:to-[#3B3B4D] transition-all duration-300"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
            <Filter className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">
              Search & Filter
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Find your perfect car</p>
          </div>
          {hasActiveFilters && (
            <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs px-3 py-1 rounded-full font-medium animate-pulse">
              Active Filters
            </span>
          )}
        </div>
        <button className="p-2 text-gray-500 hover:text-purple-600 dark:text-gray-400 dark:hover:text-purple-400 transition-colors duration-300 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/20">
          <svg
            className={`h-5 w-5 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {/* Content */}
      {isExpanded && (
        <div className="px-6 pb-6 border-t border-gray-100 dark:border-gray-800">
          <div className="space-y-6 pt-6">
            {/* Search by Name */}
            <div className="group">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                <Search className="h-4 w-4 text-purple-500" />
                Search by Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="search"
                  value={filters.search}
                  onChange={handleChange}
                  placeholder="Enter car name or brand..."
                  className="w-full pl-4 pr-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100 dark:focus:ring-purple-900/20 dark:bg-[#2B2B3D] dark:text-[#EDE9FE] transition-all duration-300 text-sm"
                />
                <Search className="absolute right-3 top-3.5 h-4 w-4 text-gray-400" />
              </div>
            </div>

            {/* Type Filter */}
            <div className="group">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                <Car className="h-4 w-4 text-purple-500" />
                Type
              </label>
              <select
                name="type"
                value={filters.type}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100 dark:focus:ring-purple-900/20 dark:bg-[#2B2B3D] dark:text-[#EDE9FE] transition-all duration-300 text-sm appearance-none bg-white dark:bg-[#2B2B3D]"
              >
                <option value="">All Types</option>
                <option value="SUV">SUV</option>
                <option value="Sedan">Sedan</option>
                <option value="Hatchback">Hatchback</option>
                <option value="Truck">Truck</option>
                <option value="Convertible">Convertible</option>
                <option value="Coupe">Coupe</option>
                <option value="Sports">Sports</option>
                <option value="Luxury">Luxury</option>
                <option value="Electric">Electric</option>
              </select>
            </div>

            {/* Year Filter */}
            <div className="group">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                <Calendar className="h-4 w-4 text-purple-500" />
                Year
              </label>
              <input
                type="number"
                name="year"
                value={filters.year}
                onChange={handleChange}
                placeholder="e.g. 2023"
                min="1900"
                max="2030"
                className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100 dark:focus:ring-purple-900/20 dark:bg-[#2B2B3D] dark:text-[#EDE9FE] transition-all duration-300 text-sm"
              />
            </div>

            {/* Price Range */}
            <div className="group">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                <DollarSign className="h-4 w-4 text-purple-500" />
                Price Range
              </label>
              <div className="grid grid-cols-2 gap-3">
                <div className="relative">
                  <input
                    type="number"
                    name="priceMin"
                    value={filters.priceMin}
                    onChange={handleChange}
                    placeholder="Min"
                    min="0"
                    className="w-full pl-4 pr-8 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100 dark:focus:ring-purple-900/20 dark:bg-[#2B2B3D] dark:text-[#EDE9FE] transition-all duration-300 text-sm"
                  />
                  <span className="absolute right-3 top-3 text-gray-400 text-sm">$</span>
                </div>
                <div className="relative">
                  <input
                    type="number"
                    name="priceMax"
                    value={filters.priceMax}
                    onChange={handleChange}
                    placeholder="Max"
                    min="0"
                    className="w-full pl-4 pr-8 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100 dark:focus:ring-purple-900/20 dark:bg-[#2B2B3D] dark:text-[#EDE9FE] transition-all duration-300 text-sm"
                  />
                  <span className="absolute right-3 top-3 text-gray-400 text-sm">$</span>
                </div>
              </div>
            </div>

            {/* Clear Filters Button */}
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl hover:from-red-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl font-medium"
              >
                <X className="h-4 w-4" />
                Clear All Filters
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
