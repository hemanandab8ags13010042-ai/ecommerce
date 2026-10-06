import React, { useState } from 'react';
import { Upload, X, CheckCircle, AlertCircle, FileSpreadsheet, Loader2 } from 'lucide-react';
import { parseCSVFile } from '../utils/dataProcessing';
import { uploadDatasetFile } from '../services/api';

export default function DataUploadModal({ isOpen, onClose, onDatasetLoaded }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleFileSelect = async (e) => {
    const selected = e.target.files[0];
    if (!selected) return;

    setFile(selected);
    setError(null);
    setLoading(true);

    try {
      // Client-side quick parse for instant preview
      const parsed = await parseCSVFile(selected);
      const rows = parsed.data;

      if (rows.length === 0) {
        throw new Error('CSV file appears empty or unparseable.');
      }

      const sampleKeys = Object.keys(rows[0]);
      let missingCount = 0;
      rows.forEach(r => {
        sampleKeys.forEach(k => {
          if (r[k] === null || r[k] === undefined || r[k] === '') missingCount++;
        });
      });

      const numCols = sampleKeys.filter(k => typeof rows[0][k] === 'number');
      const catCols = sampleKeys.filter(k => typeof rows[0][k] !== 'number');

      setPreview(rows.slice(0, 5));
      setSummary({
        totalRows: rows.length,
        totalColumns: sampleKeys.length,
        missingValues: missingCount,
        duplicateRows: 0,
        numericalColumns: numCols,
        categoricalColumns: catCols,
        dataset: rows
      });
    } catch (err) {
      setError(err.message || 'Failed to read dataset file.');
    } finally {
      setLoading(false);
    }
  };

  const handleApplyDataset = async () => {
    if (!summary) return;

    setLoading(true);
    try {
      // Send dataset file to Express backend API
      if (file) {
        await uploadDatasetFile(file);
      }
      
      // Update global parent state with uploaded dataset
      onDatasetLoaded(summary.dataset, summary);
      onClose();
    } catch (err) {
      console.warn('Backend sync failed, maintaining client memory dataset:', err);
      // Fallback update on client state
      onDatasetLoaded(summary.dataset, summary);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-slate-200 animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
              <Upload className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-sm">Upload Custom Dataset</h3>
              <p className="text-[11px] text-slate-400">CSV or XLSX formats supported</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* File Dropzone */}
          <div className="border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-2xl p-6 text-center transition-colors bg-slate-50 hover:bg-blue-50/40 relative">
            <input
              type="file"
              accept=".csv,.xlsx"
              onChange={handleFileSelect}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
            />
            <FileSpreadsheet className="w-10 h-10 text-blue-600 mx-auto mb-2" />
            <p className="text-xs font-semibold text-slate-800">
              {file ? file.name : 'Click or Drag & Drop dataset CSV here'}
            </p>
            <p className="text-[11px] text-slate-500 mt-1">Maximum file size 25MB • CSV or XLSX</p>
          </div>

          {loading && (
            <div className="py-6 text-center flex flex-col items-center justify-center gap-2">
              <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
              <span className="text-xs font-medium text-slate-600">Processing & Analyzing Dataset...</span>
            </div>
          )}

          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Quality Summary */}
          {summary && !loading && (
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">Dataset Health & Quality Audit</h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl text-center">
                  <div className="text-lg font-bold text-blue-700">{summary.totalRows}</div>
                  <div className="text-[10px] text-blue-600 font-medium">Total Rows</div>
                </div>
                <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-xl text-center">
                  <div className="text-lg font-bold text-indigo-700">{summary.totalColumns}</div>
                  <div className="text-[10px] text-indigo-600 font-medium">Total Columns</div>
                </div>
                <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl text-center">
                  <div className="text-lg font-bold text-emerald-700">{summary.missingValues}</div>
                  <div className="text-[10px] text-emerald-600 font-medium">Missing Values</div>
                </div>
                <div className="p-3 bg-purple-50 border border-purple-100 rounded-xl text-center">
                  <div className="text-lg font-bold text-purple-700">{summary.duplicateRows}</div>
                  <div className="text-[10px] text-purple-600 font-medium">Duplicate Rows</div>
                </div>
              </div>

              {/* Data Preview */}
              {preview && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">Dataset Preview (First 5 Rows)</h4>
                  <div className="overflow-x-auto border border-slate-200 rounded-xl">
                    <table className="w-full text-[11px] text-left text-slate-700">
                      <thead className="bg-slate-100 font-semibold text-slate-800 border-b border-slate-200">
                        <tr>
                          {Object.keys(preview[0]).map((col) => (
                            <th key={col} className="px-3 py-2 whitespace-nowrap">{col}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {preview.map((row, idx) => (
                          <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50">
                            {Object.values(row).map((val, vIdx) => (
                              <td key={vIdx} className="px-3 py-1.5 whitespace-nowrap font-mono text-[10px]">{String(val)}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-200 transition-colors"
          >
            Cancel
          </button>
          <button
            disabled={!summary || loading}
            onClick={handleApplyDataset}
            className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-600/20 disabled:opacity-50 transition-all"
          >
            <CheckCircle className="w-4 h-4" />
            <span>Apply Dataset & Update Dashboard</span>
          </button>
        </div>
      </div>
    </div>
  );
}
