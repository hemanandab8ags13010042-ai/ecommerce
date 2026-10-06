import React from 'react';
import { 
  Users, 
  PieChart as PieIcon, 
  MapPin, 
  DollarSign, 
  BarChart2 
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';

const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b', '#6366f1'];

export default function CustomerBehavior({ dataset }) {
  if (!dataset || dataset.length === 0) return null;

  // 1. Customer Age Distribution Groups
  const ageBins = { '18-25': 0, '26-35': 0, '36-45': 0, '46-55': 0, '56-65': 0, '65+': 0 };
  dataset.forEach(row => {
    const age = Number(row.age) || 30;
    if (age <= 25) ageBins['18-25']++;
    else if (age <= 35) ageBins['26-35']++;
    else if (age <= 45) ageBins['36-45']++;
    else if (age <= 55) ageBins['46-55']++;
    else if (age <= 65) ageBins['56-65']++;
    else ageBins['65+']++;
  });
  const ageDistribution = Object.entries(ageBins).map(([group, count]) => ({ group, count }));

  // 2. Purchase Frequency Tiers
  const freqTiers = { 'Low (1-3 orders)': 0, 'Medium (4-8 orders)': 0, 'High (9+ orders)': 0 };
  dataset.forEach(row => {
    const freq = Number(row.purchase_frequency) || 1;
    if (freq <= 3) freqTiers['Low (1-3 orders)']++;
    else if (freq <= 8) freqTiers['Medium (4-8 orders)']++;
    else freqTiers['High (9+ orders)']++;
  });
  const frequencyData = Object.entries(freqTiers).map(([tier, count]) => ({ tier, count }));

  // 3. Customer Spending Bins
  const spendBins = { '$0-100': 0, '$100-250': 0, '$250-500': 0, '$500-1000': 0, '$1000+': 0 };
  dataset.forEach(row => {
    const amount = Number(row.purchase_amount) || 0;
    if (amount <= 100) spendBins['$0-100']++;
    else if (amount <= 250) spendBins['$100-250']++;
    else if (amount <= 500) spendBins['$250-500']++;
    else if (amount <= 1000) spendBins['$500-1000']++;
    else spendBins['$1000+']++;
  });
  const spendingDistribution = Object.entries(spendBins).map(([range, count]) => ({ range, count }));

  // 4. Behavior by Gender Comparison
  const genderMap = {};
  dataset.forEach(row => {
    const g = row.gender || 'Other';
    if (!genderMap[g]) genderMap[g] = { gender: g, count: 0, totalAmount: 0 };
    genderMap[g].count += 1;
    genderMap[g].totalAmount += Number(row.purchase_amount) || 0;
  });
  const genderData = Object.values(genderMap).map(g => ({
    ...g,
    totalAmount: Math.round(g.totalAmount * 100) / 100,
    avgAmount: Math.round((g.totalAmount / g.count) * 100) / 100
  }));

  // 5. Behavior by Location
  const locationMap = {};
  dataset.forEach(row => {
    const loc = row.location || 'Unknown';
    if (!locationMap[loc]) locationMap[loc] = { location: loc, count: 0, totalAmount: 0 };
    locationMap[loc].count += 1;
    locationMap[loc].totalAmount += Number(row.purchase_amount) || 0;
  });
  const locationData = Object.values(locationMap)
    .map(l => ({
      ...l,
      totalAmount: Math.round(l.totalAmount * 100) / 100,
      avgAmount: Math.round((l.totalAmount / l.count) * 100) / 100
    }))
    .sort((a, b) => b.totalAmount - a.totalAmount);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Title */}
      <div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <Users className="w-5 h-5 text-blue-600" />
          <span>Customer Behavior Analytics</span>
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Detailed demographic distribution, spending tiers, gender behavior comparison, and geographic footprint.
        </p>
      </div>

      {/* Grid 1: Age Bins & Frequency Tiers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Customer Age Distribution */}
        <div className="glass-card p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-sm text-slate-900">Customer Age Distribution</h3>
              <p className="text-[11px] text-slate-500">Demographic histogram across age cohorts</p>
            </div>
            <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
              <BarChart2 className="w-4 h-4" />
            </div>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ageDistribution} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="group" tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
                <Tooltip 
                  formatter={(val) => [`${val} Customers`, 'Count']}
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                />
                <Bar dataKey="count" fill="#3b82f6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Purchase Frequency Breakdown */}
        <div className="glass-card p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-sm text-slate-900">Purchase Frequency Tiers</h3>
              <p className="text-[11px] text-slate-500">Low, Medium, and High activity buyers</p>
            </div>
            <div className="p-2 rounded-lg bg-purple-50 text-purple-600">
              <PieIcon className="w-4 h-4" />
            </div>
          </div>
          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={frequencyData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="count"
                  nameKey="tier"
                  label={({ tier, percent }) => `${tier.split(' ')[0]} (${(percent * 100).toFixed(0)}%)`}
                >
                  {frequencyData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
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
      </div>

      {/* Spending Distribution Histogram */}
      <div className="glass-card p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-sm text-slate-900">Customer Spending Distribution</h3>
            <p className="text-[11px] text-slate-500">Basket size frequency distribution ($ USD)</p>
          </div>
          <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
            <DollarSign className="w-4 h-4" />
          </div>
        </div>
        <div className="h-60 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={spendingDistribution} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="range" tick={{ fontSize: 11, fill: '#64748b' }} />
              <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
              <Tooltip 
                formatter={(val) => [`${val} Transactions`, 'Volume']}
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
              />
              <Bar dataKey="count" fill="#10b981" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Grid 2: Behavior by Gender Table & Location Footprint */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Customer Behavior by Gender */}
        <div className="glass-card p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-sm text-slate-900 mb-1">Behavior by Gender</h3>
            <p className="text-[11px] text-slate-500 mb-4">Metric comparison across gender demographics</p>

            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-100 font-semibold text-slate-700">
                  <tr>
                    <th className="p-3">Gender</th>
                    <th className="p-3">Customers</th>
                    <th className="p-3">Avg Spend</th>
                    <th className="p-3">Total Volume</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {genderData.map((g) => (
                    <tr key={g.gender} className="hover:bg-slate-50">
                      <td className="p-3 font-semibold text-slate-900">{g.gender}</td>
                      <td className="p-3 text-slate-700">{g.count}</td>
                      <td className="p-3 text-emerald-600 font-mono font-bold">${g.avgAmount}</td>
                      <td className="p-3 text-blue-600 font-mono font-bold">${g.totalAmount.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Customer Behavior by Location */}
        <div className="glass-card p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="font-bold text-sm text-slate-900">Geographic Footprint</h3>
                <p className="text-[11px] text-slate-500">Customer distribution by location/region</p>
              </div>
              <MapPin className="w-4 h-4 text-blue-600" />
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {locationData.map((loc, idx) => (
                <div key={loc.location} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 text-[10px] font-bold flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <span className="font-semibold text-slate-800">{loc.location}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-mono font-bold text-slate-900">${loc.totalAmount.toLocaleString()}</div>
                    <div className="text-[10px] text-slate-500">{loc.count} transactions • Avg ${loc.avgAmount}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
