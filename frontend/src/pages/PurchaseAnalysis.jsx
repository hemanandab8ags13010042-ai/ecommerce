import React from 'react';
import { 
  ShoppingBag, 
  Tag, 
  Map, 
  TrendingUp, 
  Layers 
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  ScatterChart, 
  Scatter, 
  LineChart, 
  Line, 
  ZAxis 
} from 'recharts';

export default function PurchaseAnalysis({ dataset, categories, regions, monthlyTrend }) {
  if (!dataset || dataset.length === 0) return null;

  // Prepare Quantity vs Purchase Amount scatter data
  const qtyScatter = dataset.map((r, i) => ({
    id: r.customer_id,
    quantity: Number(r.quantity) || 1,
    purchaseAmount: Number(r.purchase_amount) || 0,
    category: r.product_category
  }));

  // Prepare Discount vs Purchase Amount scatter data with detailed tooltips
  const discountScatter = dataset.map((r, i) => ({
    customerId: r.customer_id,
    category: r.product_category,
    quantity: Number(r.quantity) || 1,
    discount: Number(r.discount) || 0,
    purchaseAmount: Number(r.purchase_amount) || 0
  }));

  // Custom tooltip for Discount vs Purchase Amount scatter plot
  const CustomDiscountTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-900 text-white p-3 rounded-xl border border-slate-700 shadow-xl text-xs space-y-1">
          <div className="font-bold text-blue-400">Customer ID: #{data.customerId}</div>
          <div><span className="text-slate-400">Category:</span> {data.category}</div>
          <div><span className="text-slate-400">Quantity:</span> {data.quantity} units</div>
          <div><span className="text-slate-400">Discount:</span> {data.discount}%</div>
          <div className="font-mono text-emerald-400 font-bold pt-1 border-t border-slate-800">
            Purchase Amount: ${data.purchaseAmount}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Page Header */}
      <div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <ShoppingBag className="w-5 h-5 text-indigo-600" />
          <span>Purchase Analysis Dashboard</span>
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Category spend, quantity elasticity, discount relationship scatter plots, regional performance, and temporal trends.
        </p>
      </div>

      {/* Grid 1: Category Breakdown & Monthly Line Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Purchase Amount by Category */}
        <div className="glass-card p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-sm text-slate-900">Purchase Amount by Category</h3>
              <p className="text-[11px] text-slate-500">Total and average spending by product category</p>
            </div>
            <Layers className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categories} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="category" tick={{ fontSize: 10, fill: '#64748b' }} interval={0} angle={-15} textAnchor="end" height={45} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} tickFormatter={(v) => `$${v}`} />
                <Tooltip 
                  formatter={(val, name) => [`$${Number(val).toLocaleString()}`, name === 'totalAmount' ? 'Total Volume' : 'Avg Spend']}
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                />
                <Bar dataKey="totalAmount" fill="#4f46e5" radius={[6, 6, 0, 0]} name="totalAmount" />
                <Bar dataKey="avgAmount" fill="#818cf8" radius={[6, 6, 0, 0]} name="avgAmount" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Monthly Purchase Trend Line Chart */}
        <div className="glass-card p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-sm text-slate-900">Monthly Purchase Trend</h3>
              <p className="text-[11px] text-slate-500">Order transaction trajectory over time</p>
            </div>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyTrend} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} tickFormatter={(v) => `$${v}`} />
                <Tooltip 
                  formatter={(val) => [`$${Number(val).toLocaleString()}`, 'Total Revenue']}
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                />
                <Line type="monotone" dataKey="totalAmount" stroke="#059669" strokeWidth={3} dot={{ r: 4, fill: '#059669' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Grid 2: Scatter Plots (Quantity vs Purchase Amount & Discount vs Purchase Amount) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quantity vs Purchase Amount Scatter Plot */}
        <div className="glass-card p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="font-bold text-sm text-slate-900">Quantity vs Purchase Amount</h3>
              <p className="text-[11px] text-slate-500">Relationship between items purchased and basket value</p>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700">Positive Trend</span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis type="number" dataKey="quantity" name="Quantity" unit=" units" tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis type="number" dataKey="purchaseAmount" name="Purchase Amount" unit="$" tick={{ fontSize: 11, fill: '#64748b' }} />
                <ZAxis type="number" range={[40, 40]} />
                <Tooltip 
                  cursor={{ strokeDasharray: '3 3' }}
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                  formatter={(val, name) => [name === 'Purchase Amount' ? `$${val}` : `${val} units`, name]}
                />
                <Scatter data={qtyScatter} fill="#2563eb" fillOpacity={0.6} />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Discount vs Purchase Amount Scatter Plot with Rich Tooltips */}
        <div className="glass-card p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="font-bold text-sm text-slate-900">Discount Percentage vs Purchase Amount</h3>
              <p className="text-[11px] text-slate-500">Promotional discount elasticity scatter plot</p>
            </div>
            <Tag className="w-4 h-4 text-purple-600" />
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis type="number" dataKey="discount" name="Discount" unit="%" tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis type="number" dataKey="purchaseAmount" name="Purchase Amount" unit="$" tick={{ fontSize: 11, fill: '#64748b' }} />
                <ZAxis type="number" range={[40, 40]} />
                <Tooltip content={<CustomDiscountTooltip />} />
                <Scatter data={discountScatter} fill="#8b5cf6" fillOpacity={0.6} />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Regional Comparison Bar Chart */}
      <div className="glass-card p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-sm text-slate-900">Purchase Amount by Region</h3>
            <p className="text-[11px] text-slate-500">Comparative regional purchasing performance</p>
          </div>
          <Map className="w-4 h-4 text-blue-600" />
        </div>
        <div className="h-60 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={regions} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="location" tick={{ fontSize: 10, fill: '#64748b' }} />
              <YAxis tick={{ fontSize: 11, fill: '#64748b' }} tickFormatter={(v) => `$${v}`} />
              <Tooltip 
                formatter={(val) => [`$${Number(val).toLocaleString()}`, 'Total Spend']}
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
              />
              <Bar dataKey="totalAmount" fill="#0284c7" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
