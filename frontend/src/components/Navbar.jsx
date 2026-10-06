import React from 'react';
import { Menu, Filter, Upload, FileText, Database, RotateCcw } from 'lucide-react';

export default function Navbar({ 
  setSidebarOpen, 
  filterOpen, 
  setFilterOpen, 
  onOpenUpload, 
  onGenerateReport,
  datasetCount,
  activeFilterCount,
  onResetFilters
}) {
  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 lg:px-8 py-3.5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
      <div className="flex items-center gap-3">
        <button
          onClick={() => setSidebarOpen(true)}
          className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h1 className="text-base lg:text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            E-Commerce Customer Behavior & Purchase Amount Correlation Analysis
          </h1>
          <p className="text-xs text-slate-500 hidden sm:block">
            Analyzing customer behavior, purchasing patterns, and relationships between customer characteristics and purchase amounts.
          </p>
        </div>
      </div>

      {/* Action Buttons & Badges */}
      <div className="flex items-center gap-2.5 shrink-0 self-end md:self-auto">
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-xs text-slate-600 font-medium">
          <Database className="w-3.5 h-3.5 text-blue-600" />
          <span>{datasetCount} Records</span>
        </div>

        {activeFilterCount > 0 && (
          <button
            onClick={onResetFilters}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 hover:bg-amber-100 text-xs font-semibold transition-colors"
            title="Reset active filters"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset ({activeFilterCount})</span>
          </button>
        )}

        <button
          onClick={() => setFilterOpen(!filterOpen)}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-medium border transition-all ${
            filterOpen 
              ? 'bg-indigo-50 border-indigo-200 text-indigo-700 shadow-xs' 
              : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
          }`}
        >
          <Filter className="w-3.5 h-3.5" />
          <span>Filters</span>
          {activeFilterCount > 0 && (
            <span className="w-4 h-4 rounded-full bg-indigo-600 text-white text-[10px] flex items-center justify-center font-bold">
              {activeFilterCount}
            </span>
          )}
        </button>

        <button
          onClick={onOpenUpload}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white border border-slate-300 hover:border-slate-400 text-slate-700 hover:bg-slate-50 text-xs font-medium transition-all shadow-xs"
        >
          <Upload className="w-3.5 h-3.5 text-blue-600" />
          <span className="hidden sm:inline">Upload Dataset</span>
          <span className="sm:hidden">Upload</span>
        </button>

        <button
          onClick={onGenerateReport}
          className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-semibold shadow-md shadow-blue-500/20 transition-all hover:shadow-lg hover:shadow-blue-500/30"
        >
          <FileText className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Generate Report</span>
          <span className="sm:hidden">Report</span>
        </button>
      </div>
    </header>
  );
}
