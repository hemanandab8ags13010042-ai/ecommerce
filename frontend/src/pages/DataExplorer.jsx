import React, { useState, useMemo } from 'react';
import { 
  Table as TableIcon, 
  Search, 
  Download, 
  Eye, 
  ArrowUpDown, 
  ChevronLeft, 
  ChevronRight,
  Filter
} from 'lucide-react';

const ALL_COLUMNS = [
  { id: 'customer_id', label: 'Customer ID' },
  { id: 'age', label: 'Age' },
  { id: 'gender', label: 'Gender' },
  { id: 'location', label: 'Location' },
  { id: 'income', label: 'Income ($)' },
  { id: 'product_category', label: 'Product Category' },
  { id: 'quantity', label: 'Quantity' },
  { id: 'discount', label: 'Discount (%)' },
  { id: 'previous_purchases', label: 'Previous Purchases' },
  { id: 'review_rating', label: 'Review Rating' },
  { id: 'purchase_frequency', label: 'Purchase Frequency' },
  { id: 'purchase_amount', label: 'Purchase Amount ($)' }
];

export default function DataExplorer({ dataset }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortCol, setSortCol] = useState('customer_id');
  const [sortAsc, setSortAsc] = useState(true);
  const [pageSize, setPageSize] = useState(15);
  const [currentPage, setCurrentPage] = useState(1);
  const [visibleCols, setVisibleCols] = useState(ALL_COLUMNS.map(c => c.id));
  const [showColMenu, setShowColMenu] = useState(false);

  if (!dataset) return null;

  // Filter & Search Logic
  const filteredData = useMemo(() => {
    return dataset.filter(row => {
      if (!searchTerm) return true;
      const term = searchTerm.toLowerCase();
      return (
        String(row.customer_id).toLowerCase().includes(term) ||
        String(row.gender).toLowerCase().includes(term) ||
        String(row.location).toLowerCase().includes(term) ||
        String(row.product_category).toLowerCase().includes(term) ||
        String(row.age).includes(term) ||
        String(row.purchase_amount).includes(term)
      );
    });
  }, [dataset, searchTerm]);

  // Sorting Logic
  const sortedData = useMemo(() => {
    return [...filteredData].sort((a, b) => {
      let valA = a[sortCol];
      let valB = b[sortCol];

      if (typeof valA === 'number' && typeof valB === 'number') {
        return sortAsc ? valA - valB : valB - valA;
      }
      return sortAsc 
        ? String(valA).localeCompare(String(valB))
        : String(valB).localeCompare(String(valA));
    });
  }, [filteredData, sortCol, sortAsc]);

  // Pagination Logic
  const totalPages = Math.ceil(sortedData.length / pageSize) || 1;
  const paginatedData = sortedData.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleSort = (colId) => {
    if (sortCol === colId) {
      setSortAsc(!sortAsc);
    } else {
      setSortCol(colId);
      setSortAsc(true);
    }
  };

  const toggleColumn = (colId) => {
    if (visibleCols.includes(colId)) {
      if (visibleCols.length > 2) {
        setVisibleCols(visibleCols.filter(c => c !== colId));
      }
    } else {
      setVisibleCols([...visibleCols, colId]);
    }
  };

  const exportFilteredCSV = () => {
    const headers = visibleCols.join(',');
    const rows = sortedData.map(r => visibleCols.map(c => `"${r[c] !== undefined ? r[c] : ''}"`).join(',')).join('\n');
    const blob = new Blob([headers + '\n' + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Filtered_Dataset_${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <TableIcon className="w-5 h-5 text-blue-600" />
            <span>Interactive Data Explorer</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Query, filter, sort, paginate, toggle columns, and export customer transaction records.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Column Toggle Button */}
          <div className="relative">
            <button
              onClick={() => setShowColMenu(!showColMenu)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-colors shadow-xs"
            >
              <Eye className="w-3.5 h-3.5 text-indigo-600" />
              <span>Columns ({visibleCols.length})</span>
            </button>

            {showColMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-slate-200 p-3 z-30 space-y-1 text-xs">
                <div className="font-bold text-slate-800 pb-2 border-b border-slate-100 text-[11px] uppercase tracking-wider">
                  Toggle Columns
                </div>
                <div className="max-h-60 overflow-y-auto space-y-1 pt-1">
                  {ALL_COLUMNS.map(col => (
                    <label key={col.id} className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-slate-100 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={visibleCols.includes(col.id)}
                        onChange={() => toggleColumn(col.id)}
                        className="rounded text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-slate-700 font-medium">{col.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Export CSV Button */}
          <button
            onClick={exportFilteredCSV}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-600/20 transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Toolbar Controls (Search & Pagination size) */}
      <div className="glass-card p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search customer, location, category..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-800 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <div className="flex items-center gap-4 text-xs text-slate-600 self-end sm:self-auto">
          <span>Showing <strong>{sortedData.length}</strong> matching records</span>
          <div className="flex items-center gap-1.5">
            <span>Rows:</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="bg-slate-50 border border-slate-200 rounded-lg p-1.5 text-xs text-slate-800 outline-none"
            >
              <option value={10}>10</option>
              <option value={15}>15</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Data Table */}
      <div className="glass-card rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left text-slate-700">
            <thead className="bg-slate-900 text-white font-semibold uppercase text-[10px] tracking-wider">
              <tr>
                {ALL_COLUMNS.filter(c => visibleCols.includes(c.id)).map(col => (
                  <th
                    key={col.id}
                    onClick={() => handleSort(col.id)}
                    className="px-4 py-3 cursor-pointer hover:bg-slate-800 transition-colors whitespace-nowrap"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>{col.label}</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {paginatedData.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50 transition-colors">
                  {ALL_COLUMNS.filter(c => visibleCols.includes(c.id)).map(col => {
                    const val = row[col.id];
                    let formatted = val;
                    if (col.id === 'purchase_amount' || col.id === 'income') {
                      formatted = `$${Number(val).toLocaleString()}`;
                    } else if (col.id === 'discount') {
                      formatted = `${val}%`;
                    }
                    return (
                      <td key={col.id} className="px-4 py-3 whitespace-nowrap font-mono text-[11px]">
                        {col.id === 'customer_id' ? (
                          <span className="font-bold text-blue-600">#{formatted}</span>
                        ) : (
                          formatted
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600">
          <div>
            Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
          </div>
          <div className="flex items-center gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              className="p-1.5 rounded-lg border border-slate-300 hover:bg-slate-100 disabled:opacity-40 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              className="p-1.5 rounded-lg border border-slate-300 hover:bg-slate-100 disabled:opacity-40 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
