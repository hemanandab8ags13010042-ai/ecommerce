import React, { useState } from 'react';
import { 
  GitCommit, 
  Download, 
  HelpCircle, 
  AlertTriangle, 
  CheckCircle2, 
  Info,
  Sliders
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  ScatterChart, 
  Scatter, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  ZAxis 
} from 'recharts';
import { 
  calculatePearsonCorrelation, 
  computeCorrelationMatrix, 
  NUMERIC_VARIABLES 
} from '../utils/dataProcessing';

export default function CorrelationAnalysis({ dataset }) {
  const [selectedX, setSelectedX] = useState('income');

  if (!dataset || dataset.length === 0) return null;

  // 1. Compute Full Correlation Matrix
  const correlationMatrix = computeCorrelationMatrix(dataset);

  // 2. Prepare Scatter Plot Data for Selected X Variable vs Purchase Amount
  const scatterData = dataset.map((row) => ({
    xVal: Number(row[selectedX]) || 0,
    yVal: Number(row.purchase_amount) || 0,
    category: row.product_category,
    id: row.customer_id
  }));

  const xArr = scatterData.map(d => d.xVal);
  const yArr = scatterData.map(d => d.yVal);
  const rScore = calculatePearsonCorrelation(xArr, yArr);

  const absR = Math.abs(rScore);
  let strength = 'Weak';
  if (absR >= 0.7) strength = 'Strong';
  else if (absR >= 0.4) strength = 'Moderate';

  const direction = rScore > 0 ? 'Positive' : rScore < 0 ? 'Negative' : 'No Linear Correlation';
  const selectedObj = NUMERIC_VARIABLES.find(v => v.id === selectedX) || { label: selectedX };

  // Heatmap color generator
  const getCellColor = (val) => {
    if (val === 1) return 'bg-slate-200 text-slate-800 font-bold border-slate-300';
    if (val >= 0.7) return 'bg-blue-600 text-white font-extrabold shadow-xs';
    if (val >= 0.4) return 'bg-blue-400 text-white font-bold';
    if (val >= 0.15) return 'bg-blue-100 text-blue-900 font-semibold';
    if (val > -0.15) return 'bg-slate-100 text-slate-700 font-normal';
    if (val > -0.4) return 'bg-rose-100 text-rose-900 font-semibold';
    if (val > -0.7) return 'bg-rose-400 text-white font-bold';
    return 'bg-rose-600 text-white font-extrabold';
  };

  // Download Correlation Matrix CSV
  const handleDownloadCSV = () => {
    const keys = NUMERIC_VARIABLES.map(v => v.id);
    let csv = 'Variable,' + keys.join(',') + '\n';
    keys.forEach(k1 => {
      csv += k1 + ',' + keys.map(k2 => correlationMatrix[k1][k2]).join(',') + '\n';
    });
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Correlation_Matrix_${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <GitCommit className="w-5 h-5 text-blue-600" />
              <span>Purchase Amount Correlation Analysis</span>
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Identify the mathematical strength, direction, and magnitude of relationships between customer attributes and spending.
            </p>
          </div>
          <button
            onClick={handleDownloadCSV}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-slate-300 hover:border-slate-400 text-slate-700 text-xs font-semibold shadow-xs transition-all self-start sm:self-auto"
          >
            <Download className="w-4 h-4 text-blue-600" />
            <span>Download Matrix CSV</span>
          </button>
        </div>

        {/* Explanatory Banner */}
        <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200/80 text-blue-900 text-xs flex items-start gap-3 shadow-xs">
          <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <div className="font-bold text-blue-950">Understanding Pearson Correlation Coefficient (r)</div>
            <p className="text-blue-800 leading-relaxed">
              Pearson correlation measures linear association on a standardized scale from <strong>-1.0 to +1.0</strong>:
              <span className="ml-1 text-emerald-700 font-semibold">+1.0 = Strong Positive</span>, 
              <span className="ml-1 text-slate-700 font-semibold">0.0 = No Linear Relationship</span>, and 
              <span className="ml-1 text-rose-700 font-semibold">-1.0 = Strong Negative</span>.
            </p>
          </div>
        </div>
      </div>

      {/* SECTION 1: MAIN CORRELATION SCATTER VISUALIZATION */}
      <div className="glass-card p-6 rounded-3xl border border-slate-200 shadow-md space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-blue-600" />
              <span>Main Correlation Visualization</span>
            </h2>
            <p className="text-xs text-slate-500">Select any X-axis attribute to analyze its correlation with Purchase Amount</p>
          </div>

          {/* Dropdown Selector */}
          <div className="flex items-center gap-2">
            <label className="text-xs font-bold text-slate-700 shrink-0">Select X-Axis Variable:</label>
            <select
              value={selectedX}
              onChange={(e) => setSelectedX(e.target.value)}
              className="bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 px-3.5 py-2 focus:ring-2 focus:ring-blue-500 outline-none shadow-xs"
            >
              {NUMERIC_VARIABLES.filter(v => v.id !== 'purchase_amount').map((v) => (
                <option key={v.id} value={v.id}>{v.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Correlation Statistics Display Header */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-slate-900 text-white shadow-inner">
          <div className="p-3 bg-slate-800 rounded-xl text-center">
            <div className="text-[10px] text-slate-400 font-semibold uppercase">Pearson Coefficient</div>
            <div className="text-2xl font-extrabold text-blue-400 font-mono mt-0.5">r = {rScore}</div>
          </div>
          <div className="p-3 bg-slate-800 rounded-xl text-center">
            <div className="text-[10px] text-slate-400 font-semibold uppercase">Correlation Strength</div>
            <div className="text-lg font-bold text-emerald-400 mt-1">{strength}</div>
          </div>
          <div className="p-3 bg-slate-800 rounded-xl text-center">
            <div className="text-[10px] text-slate-400 font-semibold uppercase">Direction</div>
            <div className="text-lg font-bold text-indigo-300 mt-1">{direction}</div>
          </div>
          <div className="p-3 bg-slate-800 rounded-xl text-center">
            <div className="text-[10px] text-slate-400 font-semibold uppercase">Observations</div>
            <div className="text-lg font-bold text-slate-200 mt-1">{scatterData.length} Points</div>
          </div>
        </div>

        {/* Scatter Chart */}
        <div className="h-80 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 10, right: 10, left: -10, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis 
                type="number" 
                dataKey="xVal" 
                name={selectedObj.label} 
                tick={{ fontSize: 11, fill: '#64748b' }} 
              />
              <YAxis 
                type="number" 
                dataKey="yVal" 
                name="Purchase Amount" 
                unit="$" 
                tick={{ fontSize: 11, fill: '#64748b' }} 
              />
              <ZAxis type="number" range={[45, 45]} />
              <Tooltip 
                cursor={{ strokeDasharray: '3 3' }}
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                formatter={(val, name) => [name === 'Purchase Amount' ? `$${val}` : val, name]}
              />
              <Scatter data={scatterData} fill="#2563eb" fillOpacity={0.65} />
            </ScatterChart>
          </ResponsiveContainer>
        </div>

        {/* Statistical Causation Disclaimer */}
        <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center gap-2.5">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>
            <strong>Scientific Methodology Disclaimer:</strong> Correlation measures mathematical association between variables; correlation does <em>not</em> prove direct physical or causal relationships.
          </span>
        </div>
      </div>

      {/* SECTION 2: PROFESSIONAL INTERACTIVE HEATMAP */}
      <div className="glass-card p-6 rounded-3xl border border-slate-200 shadow-md space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-200">
          <div>
            <h2 className="text-base font-bold text-slate-900">Pearson Correlation Matrix Heatmap</h2>
            <p className="text-xs text-slate-500">Pairwise correlation grid across all numeric features in dataset</p>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-1.5 text-[10px] font-semibold flex-wrap">
            <span className="px-2 py-1 rounded bg-rose-600 text-white">Strong -</span>
            <span className="px-2 py-1 rounded bg-rose-100 text-rose-900">Mod -</span>
            <span className="px-2 py-1 rounded bg-slate-100 text-slate-700">Weak</span>
            <span className="px-2 py-1 rounded bg-blue-100 text-blue-900">Mod +</span>
            <span className="px-2 py-1 rounded bg-blue-600 text-white">Strong +</span>
          </div>
        </div>

        {/* Heatmap Grid */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr>
                <th className="p-2 border border-slate-200 bg-slate-100 text-slate-700 font-bold text-left">Variable</th>
                {NUMERIC_VARIABLES.map(v => (
                  <th key={v.id} className="p-2 border border-slate-200 bg-slate-100 text-slate-800 font-bold text-center capitalize max-w-[90px] truncate" title={v.label}>
                    {v.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {NUMERIC_VARIABLES.map(v1 => (
                <tr key={v1.id}>
                  <td className="p-2 border border-slate-200 bg-slate-50 text-slate-900 font-bold capitalize whitespace-nowrap">
                    {v1.label}
                  </td>
                  {NUMERIC_VARIABLES.map(v2 => {
                    const val = correlationMatrix[v1.id]?.[v2.id] || 0;
                    return (
                      <td
                        key={v2.id}
                        className={`p-3 border border-slate-200 text-center font-mono text-xs transition-all hover:scale-105 hover:z-10 cursor-pointer ${getCellColor(val)}`}
                        title={`${v1.label} ↔ ${v2.label}\nCorrelation (r): ${val}`}
                      >
                        {val}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
