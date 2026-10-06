import React, { useState } from 'react';
import { 
  BrainCircuit, 
  Sparkles, 
  Target, 
  BarChart3, 
  HelpCircle, 
  AlertCircle,
  Calculator,
  CheckCircle
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  ScatterChart, 
  Scatter, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from 'recharts';
import { predictMLPurchase } from '../services/api';

export default function MLPredictor({ mlModel, dataset }) {
  const [inputs, setInputs] = useState({
    age: 35,
    income: 65000,
    quantity: 3,
    discount: 10,
    previous_purchases: 8,
    review_rating: 4.5,
    purchase_frequency: 5
  });

  const [predictionResult, setPredictionResult] = useState(null);
  const [loading, setLoading] = useState(false);

  if (!dataset || dataset.length === 0) return null;

  const handleInputChange = (field, val) => {
    setInputs(prev => ({ ...prev, [field]: Number(val) || 0 }));
  };

  const handleCalculatePrediction = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mlModel && mlModel.coefficients) {
        let pred = mlModel.coefficients.intercept || 0;
        Object.entries(inputs).forEach(([k, v]) => {
          pred += (mlModel.coefficients[k] || 0) * v;
        });
        setPredictionResult(Math.max(0, Math.round(pred * 100) / 100));
      } else {
        const res = await predictMLPurchase(inputs);
        setPredictionResult(res.predictedPurchaseAmount);
      }
    } catch (err) {
      console.error('Prediction error:', err);
    } finally {
      setLoading(false);
    }
  };

  const coeffs = mlModel?.coefficients || {};

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Page Title */}
      <div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <BrainCircuit className="w-5 h-5 text-indigo-600" />
          <span>Machine Learning Linear Regression & Predictor</span>
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Supervised Ordinary Least Squares (OLS) regression model for estimating expected purchase amount based on customer features.
        </p>
      </div>

      {/* SECTION 1: MODEL EVALUATION METRICS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-card p-5 rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-900 to-slate-900 text-white shadow-lg">
          <div className="text-xs font-bold uppercase tracking-wider text-indigo-300">Coefficient of Determination</div>
          <div className="text-3xl font-extrabold font-mono mt-1 text-white">R² = {mlModel?.r2 || 0}</div>
          <p className="text-[11px] text-indigo-200 mt-2">Percentage of purchase amount variance explained by model features.</p>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500">Mean Absolute Error (MAE)</div>
          <div className="text-3xl font-extrabold font-mono mt-1 text-slate-900">${mlModel?.mae || 0}</div>
          <p className="text-[11px] text-slate-500 mt-2">Average absolute difference between actual & predicted purchase amounts.</p>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500">Root Mean Squared Error (RMSE)</div>
          <div className="text-3xl font-extrabold font-mono mt-1 text-slate-900">${mlModel?.rmse || 0}</div>
          <p className="text-[11px] text-slate-500 mt-2">Standard deviation of residual prediction errors ($ USD).</p>
        </div>
      </div>

      {/* Causal Disclaimer */}
      <div className="p-3.5 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-900 text-xs flex items-center gap-2.5">
        <AlertCircle className="w-4 h-4 text-indigo-600 shrink-0" />
        <span>
          <strong>Predictive Model Notice:</strong> This Multiple Linear Regression is designed strictly as a <em>statistical predictive model</em> for estimation and forecasting; it does <em>not</em> represent a causal mechanism.
        </span>
      </div>

      {/* SECTION 2: INTERACTIVE "WHAT-IF" PURCHASE AMOUNT CALCULATOR */}
      <div className="glass-card p-6 rounded-3xl border border-slate-200 shadow-md space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Calculator className="w-4 h-4 text-blue-600" />
              <span>Interactive Purchase Amount Predictor</span>
            </h2>
            <p className="text-xs text-slate-500">Enter hypothetical customer parameters to calculate predicted purchase value</p>
          </div>
          <span className="text-xs font-bold text-blue-700 px-3 py-1 rounded-xl bg-blue-50">
            Live OLS Estimator
          </span>
        </div>

        <form onSubmit={handleCalculatePrediction} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Age (Years)</label>
            <input
              type="number"
              value={inputs.age}
              onChange={(e) => handleInputChange('age', e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs font-mono outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Annual Income ($)</label>
            <input
              type="number"
              value={inputs.income}
              onChange={(e) => handleInputChange('income', e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs font-mono outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Item Quantity</label>
            <input
              type="number"
              value={inputs.quantity}
              onChange={(e) => handleInputChange('quantity', e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs font-mono outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Discount (%)</label>
            <input
              type="number"
              value={inputs.discount}
              onChange={(e) => handleInputChange('discount', e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs font-mono outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Previous Purchases</label>
            <input
              type="number"
              value={inputs.previous_purchases}
              onChange={(e) => handleInputChange('previous_purchases', e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs font-mono outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Review Rating (1-5)</label>
            <input
              type="number"
              step="0.1"
              value={inputs.review_rating}
              onChange={(e) => handleInputChange('review_rating', e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs font-mono outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Purchase Frequency</label>
            <input
              type="number"
              value={inputs.purchase_frequency}
              onChange={(e) => handleInputChange('purchase_frequency', e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs font-mono outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-600/20 transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Predict Purchase Value</span>
            </button>
          </div>
        </form>

        {/* Prediction Display Result Card */}
        {predictionResult !== null && (
          <div className="p-5 rounded-2xl bg-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-4 animate-in fade-in duration-200">
            <div>
              <div className="text-xs font-bold text-blue-400 uppercase tracking-wider">Model Prediction Output</div>
              <p className="text-xs text-slate-300">Estimated basket value based on input characteristics</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-extrabold text-emerald-400 font-mono">${predictionResult}</div>
              <div className="text-[10px] text-slate-400 font-semibold">Predicted Purchase Amount</div>
            </div>
          </div>
        )}
      </div>

      {/* SECTION 3: ACTUAL VS PREDICTED SCATTER PLOT */}
      <div className="glass-card p-6 rounded-3xl border border-slate-200 shadow-md">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">Actual vs Predicted Purchase Amount</h2>
            <p className="text-xs text-slate-500">Goodness-of-fit evaluation scatter plot (ideal predictions fall on 45° line)</p>
          </div>
          <Target className="w-5 h-5 text-indigo-600" />
        </div>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis type="number" dataKey="actual" name="Actual ($)" unit="$" tick={{ fontSize: 11, fill: '#64748b' }} />
              <YAxis type="number" dataKey="predicted" name="Predicted ($)" unit="$" tick={{ fontSize: 11, fill: '#64748b' }} />
              <Tooltip 
                cursor={{ strokeDasharray: '3 3' }}
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                formatter={(val, name) => [`$${val}`, name]}
              />
              <Scatter data={mlModel?.samplePredictions || []} fill="#6366f1" fillOpacity={0.6} />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
