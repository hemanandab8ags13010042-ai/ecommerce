import React from 'react';
import { 
  Users, 
  ShoppingBag, 
  DollarSign, 
  TrendingUp, 
  Calendar, 
  Repeat, 
  Award, 
  Zap,
  ArrowRight,
  GitCommit
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  BarChart, 
  Bar, 
  CartesianGrid 
} from 'recharts';
import KPICard from '../components/KPICard';

export default function DashboardHome({ 
  kpis, 
  monthlyTrend, 
  categories, 
  insights,
  setActiveTab 
}) {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Banner / Title Header */}
      <div className="glass-card p-6 rounded-3xl border border-blue-100 bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-64 h-64 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-semibold mb-3">
            <Zap className="w-3.5 h-3.5" />
            <span>Executive Analytics & Intelligence Dashboard</span>
          </div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-white leading-tight">
            E-Commerce Customer Behavior & Purchase Amount Correlation Analysis
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-2 font-normal leading-relaxed">
            Analyzing customer behavior, purchasing patterns, and relationships between customer characteristics and purchase amounts using descriptive statistics, Pearson correlation, and predictive machine learning.
          </p>
          <div className="flex flex-wrap items-center gap-3 mt-4">
            <button
              onClick={() => setActiveTab('correlation')}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-md shadow-blue-600/30"
            >
              <GitCommit className="w-4 h-4" />
              <span>Explore Correlation Heatmap</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setActiveTab('insights')}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 text-xs font-semibold border border-white/10 transition-colors"
            >
              <span>View Data Findings</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid (8 KPI Cards) */}
      <div>
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
          Key Metric Indicators
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <KPICard
            title="Total Customers"
            value={(kpis?.totalCustomers || 0).toLocaleString()}
            icon={Users}
            description="Unique customer entities"
            trend="up"
            trendValue="+12.4%"
            iconBg="bg-blue-50 text-blue-600"
          />
          <KPICard
            title="Total Transactions"
            value={(kpis?.totalTransactions || 0).toLocaleString()}
            icon={ShoppingBag}
            description="Completed customer orders"
            trend="up"
            trendValue="+8.1%"
            iconBg="bg-indigo-50 text-indigo-600"
          />
          <KPICard
            title="Total Purchase Amount"
            value={`$${(kpis?.totalPurchaseAmount || 0).toLocaleString()}`}
            icon={DollarSign}
            description="Gross revenue volume"
            trend="up"
            trendValue="+15.3%"
            iconBg="bg-emerald-50 text-emerald-600"
          />
          <KPICard
            title="Average Purchase Amount"
            value={`$${kpis?.avgPurchaseAmount || 0}`}
            icon={TrendingUp}
            description="Mean order basket size"
            trend="up"
            trendValue="+$14.2"
            iconBg="bg-purple-50 text-purple-600"
          />
          <KPICard
            title="Average Customer Age"
            value={`${kpis?.avgCustomerAge || 0} yrs`}
            icon={Calendar}
            description="Demographic mean age"
            trend="neutral"
            trendValue="Median 39"
            iconBg="bg-sky-50 text-sky-600"
          />
          <KPICard
            title="Average Purchase Frequency"
            value={`${kpis?.avgPurchaseFrequency || 0} orders`}
            icon={Repeat}
            description="Mean repeat orders per user"
            trend="up"
            trendValue="Frequent"
            iconBg="bg-amber-50 text-amber-600"
          />
          <KPICard
            title="Highest Purchase Amount"
            value={`$${(kpis?.highestPurchaseAmount || 0).toLocaleString()}`}
            icon={Award}
            description="Peak individual basket"
            trend="up"
            trendValue="Max Order"
            iconBg="bg-teal-50 text-teal-600"
          />
          <KPICard
            title="Repeat Customer Rate"
            value={`${kpis?.repeatCustomerPercentage || 0}%`}
            icon={Repeat}
            description="Customers with >1 purchase"
            trend="up"
            trendValue="High Retention"
            iconBg="bg-rose-50 text-rose-600"
          />
        </div>
      </div>

      {/* Main Charts Overview Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Trend Area Chart */}
        <div className="lg:col-span-2 glass-card p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-sm text-slate-900">Monthly Revenue & Purchase Trend</h3>
              <p className="text-[11px] text-slate-500">Gross purchase amount over time</p>
            </div>
            <div className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 font-bold text-[11px]">
              2024 Performance
            </div>
          </div>
          <div className="h-64 min-h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%" minHeight={250}>
              <AreaChart data={monthlyTrend} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="month" tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} tickFormatter={(v) => `$${v}`} />
                <Tooltip 
                  formatter={(val) => [`$${Number(val).toLocaleString()}`, 'Total Revenue']}
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="totalAmount" stroke="#2563eb" strokeWidth={2.5} fillOpacity={1} fill="url(#colorAmount)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Product Category Revenue Share */}
        <div className="glass-card p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-sm text-slate-900">Revenue by Category</h3>
              <p className="text-[11px] text-slate-500">Total gross spend per category</p>
            </div>
          </div>
          <div className="h-64 min-h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%" minHeight={250}>
              <BarChart data={categories} layout="vertical" margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" tick={{ fontSize: 10, fill: '#64748b' }} tickFormatter={(v) => `$${v}`} />
                <YAxis type="category" dataKey="category" width={90} tick={{ fontSize: 11, fill: '#475569' }} />
                <Tooltip 
                  formatter={(val) => [`$${Number(val).toLocaleString()}`, 'Purchase Volume']}
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                />
                <Bar dataKey="totalAmount" fill="#6366f1" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Dynamic Key Findings Summary Box */}
      {insights && insights.length > 0 && (
        <div className="glass-card p-6 rounded-2xl border border-slate-200 bg-slate-900 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                <Zap className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-white">Top Dynamic Data Findings</h3>
                <p className="text-[11px] text-slate-400">Automated empirical observations from dataset calculations</p>
              </div>
            </div>
            <button
              onClick={() => setActiveTab('insights')}
              className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors"
            >
              <span>View All ({insights.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {insights.slice(0, 2).map((ins) => (
              <div key={ins.id} className="p-4 rounded-xl bg-slate-800/80 border border-slate-700/80 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-blue-300">{ins.title}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-500/20 border border-blue-400/30 text-blue-200">
                    {ins.metric}
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">{ins.description}</p>
                <div className="text-[11px] text-slate-400 italic">Recommendation: {ins.recommendation}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
