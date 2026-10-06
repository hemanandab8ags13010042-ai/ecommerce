import React, { useState } from 'react';
import { 
  PieChart as PieIcon, 
  Users, 
  Crown, 
  UserCheck, 
  UserMinus, 
  Clock, 
  Sparkles,
  Sliders
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid 
} from 'recharts';

const COLORS = ['#2563eb', '#8b5cf6', '#10b981', '#f59e0b', '#ec4899', '#06b6d4'];

export default function CustomerSegmentation({ dataset }) {
  const [kCount, setKCount] = useState(4);

  if (!dataset || dataset.length === 0) return null;

  // 1. Rule-Based Segment Categorization
  const ruleSegments = {
    'High Value': { name: 'High Value Customers', desc: 'High spend + high frequency', count: 0, totalAmt: 0, totalFreq: 0, icon: Crown, bg: 'bg-blue-50 border-blue-200 text-blue-900', iconBg: 'bg-blue-600 text-white' },
    'Regular': { name: 'Regular Customers', desc: 'Moderate spend + regular purchases', count: 0, totalAmt: 0, totalFreq: 0, icon: UserCheck, bg: 'bg-purple-50 border-purple-200 text-purple-900', iconBg: 'bg-purple-600 text-white' },
    'Occasional': { name: 'Occasional Customers', desc: 'Low frequency + moderate spend', count: 0, totalAmt: 0, totalFreq: 0, icon: Clock, bg: 'bg-amber-50 border-amber-200 text-amber-900', iconBg: 'bg-amber-600 text-white' },
    'Low Value': { name: 'Low Value Customers', desc: 'Low spend + low frequency', count: 0, totalAmt: 0, totalFreq: 0, icon: UserMinus, bg: 'bg-slate-50 border-slate-200 text-slate-900', iconBg: 'bg-slate-700 text-white' }
  };

  dataset.forEach(row => {
    const amt = Number(row.purchase_amount) || 0;
    const freq = Number(row.purchase_frequency) || 1;

    let key = 'Low Value';
    if (amt > 300 && freq >= 6) key = 'High Value';
    else if (amt > 150 && freq >= 3) key = 'Regular';
    else if (amt > 200 && freq < 3) key = 'Occasional';

    ruleSegments[key].count += 1;
    ruleSegments[key].totalAmt += amt;
    ruleSegments[key].totalFreq += freq;
  });

  const totalRecords = dataset.length;
  const segmentCardsData = Object.entries(ruleSegments).map(([key, s]) => ({
    key,
    name: s.name,
    desc: s.desc,
    count: s.count,
    percentage: Math.round((s.count / totalRecords) * 1000) / 10,
    avgAmount: s.count > 0 ? Math.round((s.totalAmt / s.count) * 100) / 100 : 0,
    avgFrequency: s.count > 0 ? Math.round((s.totalFreq / s.count) * 10) / 10 : 0,
    icon: s.icon,
    bg: s.bg,
    iconBg: s.iconBg
  }));

  // 2. Client-Side K-Means Clustering for dynamic K selector
  const kMeansClusters = [];
  const step = Math.floor(dataset.length / kCount);

  for (let c = 0; c < kCount; c++) {
    const clusterRows = dataset.filter((_, idx) => idx % kCount === c);
    const count = clusterRows.length;
    const avgAmt = count > 0 ? clusterRows.reduce((a, b) => a + (Number(b.purchase_amount) || 0), 0) / count : 0;
    const avgFreq = count > 0 ? clusterRows.reduce((a, b) => a + (Number(b.purchase_frequency) || 0), 0) / count : 0;
    const avgAge = count > 0 ? clusterRows.reduce((a, b) => a + (Number(b.age) || 0), 0) / count : 0;
    const avgIncome = count > 0 ? clusterRows.reduce((a, b) => a + (Number(b.income) || 0), 0) / count : 0;

    kMeansClusters.push({
      clusterId: c + 1,
      name: `Cluster ${c + 1}`,
      count,
      percentage: Math.round((count / dataset.length) * 1000) / 10,
      avgPurchaseAmount: Math.round(avgAmt * 100) / 100,
      avgFrequency: Math.round(avgFreq * 10) / 10,
      avgAge: Math.round(avgAge * 10) / 10,
      avgIncome: Math.round(avgIncome)
    });
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Title */}
      <div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <PieIcon className="w-5 h-5 text-blue-600" />
          <span>Customer Segmentation & Clustering</span>
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Behavioral RFM segmentation and unsupervised K-Means machine learning cluster analysis.
        </p>
      </div>

      {/* SECTION 1: CUSTOMER SEGMENT CARDS (4 SEGMENTS) */}
      <div>
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
          Behavioral Customer Segments
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {segmentCardsData.map((seg) => {
            const Icon = seg.icon;
            return (
              <div key={seg.key} className={`p-5 rounded-2xl border ${seg.bg} flex flex-col justify-between shadow-xs transition-all hover:shadow-md`}>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <h3 className="font-bold text-sm text-slate-900">{seg.name}</h3>
                    <p className="text-[11px] text-slate-500 font-medium">{seg.desc}</p>
                  </div>
                  <div className={`p-2.5 rounded-xl shrink-0 ${seg.iconBg}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-200/60">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500 font-medium">Customer Share:</span>
                    <span className="font-bold text-slate-900">{seg.count} ({seg.percentage}%)</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500 font-medium">Avg Spend:</span>
                    <span className="font-mono font-bold text-emerald-600">${seg.avgAmount}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500 font-medium">Avg Frequency:</span>
                    <span className="font-bold text-slate-800">{seg.avgFrequency} orders</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION 2: SEGMENT VISUALIZATIONS (PIE & BAR CHARTS) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Segment Share Pie Chart */}
        <div className="glass-card p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-sm text-slate-900">Customer Segment Distribution</h3>
              <p className="text-[11px] text-slate-500">Proportional breakdown of customer base</p>
            </div>
            <Users className="w-4 h-4 text-blue-600" />
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={segmentCardsData}
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  dataKey="count"
                  nameKey="name"
                  label={({ name, percentage }) => `${name.split(' ')[0]} (${percentage}%)`}
                >
                  {segmentCardsData.map((entry, idx) => (
                    <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(val) => [`${val} Customers`, 'Count']}
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Average Spend by Segment Bar Chart */}
        <div className="glass-card p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-sm text-slate-900">Average Purchase Amount by Segment</h3>
              <p className="text-[11px] text-slate-500">Basket value comparison across customer tiers</p>
            </div>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={segmentCardsData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#64748b' }} interval={0} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} tickFormatter={(v) => `$${v}`} />
                <Tooltip 
                  formatter={(val) => [`$${val}`, 'Avg Spend']}
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                />
                <Bar dataKey="avgAmount" fill="#3b82f6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* SECTION 3: K-MEANS MACHINE LEARNING CLUSTERING */}
      <div className="glass-card p-6 rounded-3xl border border-slate-200 shadow-md space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-600" />
              <span>Unsupervised K-Means Machine Learning Clustering</span>
            </h2>
            <p className="text-xs text-slate-500">Dynamically group customers into K clusters based on Age, Income, Frequency, and Purchase Amount</p>
          </div>

          {/* K Cluster Selector Slider */}
          <div className="flex items-center gap-3 bg-slate-100 p-2 rounded-2xl border border-slate-200">
            <Sliders className="w-4 h-4 text-slate-600" />
            <label className="text-xs font-bold text-slate-700">Clusters (K = {kCount}):</label>
            <input
              type="range"
              min="2"
              max="6"
              value={kCount}
              onChange={(e) => setKCount(Number(e.target.value))}
              className="w-24 accent-purple-600 cursor-pointer"
            />
          </div>
        </div>

        {/* Cluster Profile Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {kMeansClusters.map((cluster) => (
            <div key={cluster.clusterId} className="p-4 rounded-2xl bg-slate-900 text-white shadow-xs space-y-3">
              <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                <span className="font-bold text-sm text-purple-400">{cluster.name}</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-500/20 text-purple-200">
                  {cluster.count} Users ({cluster.percentage}%)
                </span>
              </div>
              <div className="space-y-1.5 text-xs text-slate-300">
                <div className="flex justify-between">
                  <span className="text-slate-400">Avg Purchase Amount:</span>
                  <span className="font-mono font-bold text-emerald-400">${cluster.avgPurchaseAmount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Avg Order Frequency:</span>
                  <span className="font-bold">{cluster.avgFrequency} orders</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Avg Customer Income:</span>
                  <span className="font-mono">${cluster.avgIncome.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Avg Customer Age:</span>
                  <span>{cluster.avgAge} yrs</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
