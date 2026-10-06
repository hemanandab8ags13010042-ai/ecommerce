import React from 'react';
import { 
  Lightbulb, 
  Calculator, 
  Sparkles, 
  CheckCircle2, 
  TrendingUp, 
  BarChart3 
} from 'lucide-react';
import { computeDescriptiveStats, NUMERIC_VARIABLES } from '../utils/dataProcessing';

export default function Insights({ insights, dataset }) {
  if (!dataset || dataset.length === 0) return null;

  // Compute Full Descriptive Statistics for numerical attributes
  const stats = computeDescriptiveStats(dataset);
  const targetStats = stats['purchase_amount'] || {};

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Title */}
      <div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-amber-500" />
          <span>Automated Insights & Statistical Analysis</span>
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Empirically computed key findings and comprehensive descriptive statistical metrics.
        </p>
      </div>

      {/* SECTION 1: AUTOMATED DATA-DRIVEN INSIGHT CARDS */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-blue-600" />
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Dynamically Generated Findings (From Dataset Calculation)
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {insights && insights.map((ins, idx) => (
            <div 
              key={ins.id || idx}
              className="glass-card p-5 rounded-2xl border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <span className="font-bold text-sm text-slate-900">{ins.title}</span>
                </div>
                <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                  {ins.metric}
                </span>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed pl-8">
                {ins.description}
              </p>

              <div className="pl-8 pt-2 border-t border-slate-100 flex items-start gap-2 text-xs font-semibold text-blue-900">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Actionable Strategy: {ins.recommendation}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 2: STATISTICAL ANALYSIS FOR PURCHASE AMOUNT */}
      <div className="glass-card p-6 rounded-3xl border border-slate-200 shadow-md space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Calculator className="w-4 h-4 text-emerald-600" />
              <span>Purchase Amount Descriptive Statistics</span>
            </h2>
            <p className="text-xs text-slate-500">Central tendency, dispersion, and quartiles ($ USD)</p>
          </div>
          <span className="text-xs font-bold text-emerald-700 px-3 py-1 rounded-xl bg-emerald-50 border border-emerald-200">
            N = {targetStats.count || dataset.length} Samples
          </span>
        </div>

        {/* Highlighted Stat Pills Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3 text-center">
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
            <div className="text-[10px] text-slate-500 font-bold uppercase">Mean</div>
            <div className="text-lg font-bold text-slate-900 font-mono mt-0.5">${targetStats.mean || 0}</div>
          </div>
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
            <div className="text-[10px] text-slate-500 font-bold uppercase">Median</div>
            <div className="text-lg font-bold text-slate-900 font-mono mt-0.5">${targetStats.median || 0}</div>
          </div>
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
            <div className="text-[10px] text-slate-500 font-bold uppercase">Std Dev (σ)</div>
            <div className="text-lg font-bold text-slate-900 font-mono mt-0.5">${targetStats.stdDev || 0}</div>
          </div>
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
            <div className="text-[10px] text-slate-500 font-bold uppercase">Minimum</div>
            <div className="text-lg font-bold text-slate-900 font-mono mt-0.5">${targetStats.min || 0}</div>
          </div>
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
            <div className="text-[10px] text-slate-500 font-bold uppercase">Maximum</div>
            <div className="text-lg font-bold text-slate-900 font-mono mt-0.5">${targetStats.max || 0}</div>
          </div>
        </div>

        {/* Box Plot / Quantile Visualization Diagram */}
        <div className="p-5 rounded-2xl bg-slate-900 text-white space-y-3">
          <div className="flex justify-between items-center text-xs font-bold border-b border-slate-800 pb-2">
            <span>Box Plot & Interquartile Range (IQR) Representation</span>
            <span className="text-blue-400">IQR = ${targetStats.iqr || 0}</span>
          </div>

          <div className="relative pt-6 pb-4 px-4">
            {/* Box plot axis line */}
            <div className="h-2 bg-slate-800 rounded-full relative w-full flex items-center">
              {/* Box (Q1 to Q3) */}
              <div 
                className="absolute h-8 bg-blue-600/80 border-2 border-blue-400 rounded-lg flex items-center justify-center text-[10px] font-bold text-white shadow-lg"
                style={{ left: '25%', right: '25%' }}
              >
                50% Middle Volume (Q1 to Q3)
              </div>
            </div>

            <div className="flex justify-between text-[11px] font-mono text-slate-400 mt-6">
              <div>Min: ${targetStats.min}</div>
              <div className="text-blue-300 font-bold">Q1: ${targetStats.q1}</div>
              <div className="text-emerald-400 font-extrabold">Median: ${targetStats.median}</div>
              <div className="text-blue-300 font-bold">Q3: ${targetStats.q3}</div>
              <div>Max: ${targetStats.max}</div>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 3: FULL STATISTICAL METRICS FOR ALL NUMERIC FEATURES */}
      <div className="glass-card p-6 rounded-3xl border border-slate-200 shadow-md">
        <h2 className="text-base font-bold text-slate-900 mb-3">Comprehensive Statistical Matrix</h2>
        <div className="overflow-x-auto border border-slate-200 rounded-2xl">
          <table className="w-full text-xs text-left text-slate-800">
            <thead className="bg-slate-100 font-semibold text-slate-700 border-b border-slate-200">
              <tr>
                <th className="p-3">Variable</th>
                <th className="p-3">Mean</th>
                <th className="p-3">Median</th>
                <th className="p-3">Std Dev</th>
                <th className="p-3">Min</th>
                <th className="p-3">Max</th>
                <th className="p-3">Q1 (25%)</th>
                <th className="p-3">Q3 (75%)</th>
                <th className="p-3">IQR</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {NUMERIC_VARIABLES.map(v => {
                const s = stats[v.id] || {};
                return (
                  <tr key={v.id} className="hover:bg-slate-50">
                    <td className="p-3 font-semibold text-slate-900 capitalize">{v.label}</td>
                    <td className="p-3 font-mono">{s.mean}</td>
                    <td className="p-3 font-mono">{s.median}</td>
                    <td className="p-3 font-mono">{s.stdDev}</td>
                    <td className="p-3 font-mono text-rose-600">{s.min}</td>
                    <td className="p-3 font-mono text-emerald-600">{s.max}</td>
                    <td className="p-3 font-mono">{s.q1}</td>
                    <td className="p-3 font-mono">{s.q3}</td>
                    <td className="p-3 font-mono text-blue-600 font-bold">{s.iqr}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
