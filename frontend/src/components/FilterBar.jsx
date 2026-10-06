import React from 'react';
import { RotateCcw } from 'lucide-react';

const CATEGORIES = ['All', 'Electronics', 'Clothing', 'Beauty', 'Grocery', 'Home & Kitchen', 'Sports', 'Books'];
const GENDERS = ['All', 'Male', 'Female', 'Other'];
const REGIONS = ['All', 'USA', 'UK', 'Canada', 'Australia', 'Germany', 'Japan', 'France'];

export default function FilterBar({ filters, setFilters, onReset, isOpen }) {
  if (!isOpen) return null;

  const handleChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="bg-slate-900 text-slate-100 border-b border-slate-800 px-4 lg:px-8 py-4 animate-in slide-in-from-top-2 duration-200 shadow-inner">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xs font-bold uppercase tracking-wider text-blue-400 flex items-center gap-2">
          <span>Global Filter Controls</span>
          <span className="text-[10px] text-slate-400 font-normal lowercase">(updates all dashboard charts live)</span>
        </h2>
        <button
          onClick={onReset}
          className="flex items-center gap-1 text-xs text-slate-400 hover:text-white transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset All</span>
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
        {/* Gender */}
        <div>
          <label className="block text-[11px] font-medium text-slate-300 mb-1">Gender</label>
          <select
            value={filters.gender || 'All'}
            onChange={(e) => handleChange('gender', e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg text-xs text-slate-200 p-2 focus:ring-2 focus:ring-blue-500 outline-none"
          >
            {GENDERS.map(g => <option key={g} value={g}>{g}</option>)}
          </select>
        </div>

        {/* Category */}
        <div>
          <label className="block text-[11px] font-medium text-slate-300 mb-1">Category</label>
          <select
            value={filters.category || 'All'}
            onChange={(e) => handleChange('category', e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg text-xs text-slate-200 p-2 focus:ring-2 focus:ring-blue-500 outline-none"
          >
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        {/* Region */}
        <div>
          <label className="block text-[11px] font-medium text-slate-300 mb-1">Region</label>
          <select
            value={filters.region || 'All'}
            onChange={(e) => handleChange('region', e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg text-xs text-slate-200 p-2 focus:ring-2 focus:ring-blue-500 outline-none"
          >
            {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>

        {/* Age Min/Max */}
        <div>
          <label className="block text-[11px] font-medium text-slate-300 mb-1">Age Range</label>
          <div className="flex items-center gap-1">
            <input
              type="number"
              placeholder="18"
              value={filters.minAge || ''}
              onChange={(e) => handleChange('minAge', e.target.value)}
              className="w-1/2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-slate-200 p-2 focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <span className="text-slate-500">-</span>
            <input
              type="number"
              placeholder="70"
              value={filters.maxAge || ''}
              onChange={(e) => handleChange('maxAge', e.target.value)}
              className="w-1/2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-slate-200 p-2 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>

        {/* Min/Max Purchase Amount */}
        <div>
          <label className="block text-[11px] font-medium text-slate-300 mb-1">Purchase Amount ($)</label>
          <div className="flex items-center gap-1">
            <input
              type="number"
              placeholder="0"
              value={filters.minAmount || ''}
              onChange={(e) => handleChange('minAmount', e.target.value)}
              className="w-1/2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-slate-200 p-2 focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <span className="text-slate-500">-</span>
            <input
              type="number"
              placeholder="5000"
              value={filters.maxAmount || ''}
              onChange={(e) => handleChange('maxAmount', e.target.value)}
              className="w-1/2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-slate-200 p-2 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>

        {/* Income Range */}
        <div>
          <label className="block text-[11px] font-medium text-slate-300 mb-1">Min Income ($)</label>
          <input
            type="number"
            placeholder="30000"
            value={filters.minIncome || ''}
            onChange={(e) => handleChange('minIncome', e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg text-xs text-slate-200 p-2 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        {/* Max Income Range */}
        <div>
          <label className="block text-[11px] font-medium text-slate-300 mb-1">Max Income ($)</label>
          <input
            type="number"
            placeholder="150000"
            value={filters.maxIncome || ''}
            onChange={(e) => handleChange('maxIncome', e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg text-xs text-slate-200 p-2 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
      </div>
    </div>
  );
}
