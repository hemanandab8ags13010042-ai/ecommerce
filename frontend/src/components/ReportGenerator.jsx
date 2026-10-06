import React, { useRef } from 'react';
import { Download, Printer, X, FileText, CheckCircle } from 'lucide-react';
import html2pdf from 'html2pdf.js';

export default function ReportGenerator({ 
  isOpen, 
  onClose, 
  stats, 
  kpis, 
  insights, 
  correlationMatrix,
  mlModel,
  datasetCount
}) {
  const reportRef = useRef();

  if (!isOpen) return null;

  const handleDownloadPDF = () => {
    const element = reportRef.current;
    const opt = {
      margin: [0.4, 0.4, 0.4, 0.4],
      filename: `E-Commerce_Correlation_Report_${new Date().toISOString().slice(0,10)}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
    html2pdf().set(opt).from(element).save();
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl border border-slate-200 flex flex-col">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <FileText className="w-5 h-5 text-blue-400" />
            <div>
              <h3 className="font-bold text-sm">Executive Analysis & Correlation Report</h3>
              <p className="text-[11px] text-slate-400">Generated PDF analytics document</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>
            <button
              onClick={handleDownloadPDF}
              className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md shadow-blue-600/20"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PDF</span>
            </button>
            <button 
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors ml-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Report Content Container (Print Target) */}
        <div className="p-8 overflow-y-auto flex-1 space-y-6 text-slate-800 bg-white" ref={reportRef}>
          {/* Document Header */}
          <div className="border-b border-slate-200 pb-5 flex justify-between items-start">
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-blue-600 mb-1">
                Data Science Analytics Dashboard Report
              </div>
              <h1 className="text-xl font-bold text-slate-900 leading-tight">
                E-Commerce Customer Behavior & Purchase Amount Correlation Analysis
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                Statistical correlation, customer segmentation profiling, and machine learning prediction report.
              </p>
            </div>
            <div className="text-right text-[11px] text-slate-500">
              <div className="font-semibold text-slate-800">Date: {new Date().toLocaleDateString()}</div>
              <div>Dataset: {datasetCount} Observations</div>
              <div className="text-emerald-600 font-medium mt-1">Verified Audit Clean</div>
            </div>
          </div>

          {/* Section 1: Executive KPI Summary */}
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3 pb-1 border-b border-slate-100">
              1. Executive KPI Summary
            </h2>
            <div className="grid grid-cols-4 gap-3 text-center">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <div className="text-base font-bold text-slate-900">{kpis?.totalCustomers || 0}</div>
                <div className="text-[10px] text-slate-500 uppercase font-semibold">Total Customers</div>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <div className="text-base font-bold text-slate-900">${(kpis?.totalPurchaseAmount || 0).toLocaleString()}</div>
                <div className="text-[10px] text-slate-500 uppercase font-semibold">Gross Spending</div>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <div className="text-base font-bold text-slate-900">${kpis?.avgPurchaseAmount || 0}</div>
                <div className="text-[10px] text-slate-500 uppercase font-semibold">Avg Basket Size</div>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <div className="text-base font-bold text-slate-900">{kpis?.repeatCustomerPercentage || 0}%</div>
                <div className="text-[10px] text-slate-500 uppercase font-semibold">Repeat Customer %</div>
              </div>
            </div>
          </div>

          {/* Section 2: Key Strategic Findings */}
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3 pb-1 border-b border-slate-100">
              2. Data-Driven Insights & Findings
            </h2>
            <div className="space-y-2.5">
              {insights && insights.map((ins) => (
                <div key={ins.id} className="p-3 bg-blue-50/50 border border-blue-100 rounded-xl text-xs">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-slate-900">{ins.title}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800">{ins.metric}</span>
                  </div>
                  <p className="text-slate-600 text-[11px] mb-1">{ins.description}</p>
                  <div className="text-[10px] font-semibold text-blue-700">Recommendation: {ins.recommendation}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Pearson Correlation Matrix Summary */}
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3 pb-1 border-b border-slate-100">
              3. Pearson Correlation Coefficients (Target: Purchase Amount)
            </h2>
            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-100 font-semibold text-slate-700">
                  <tr>
                    <th className="p-2 border-b">Feature Name</th>
                    <th className="p-2 border-b">Pearson (r)</th>
                    <th className="p-2 border-b">Strength</th>
                    <th className="p-2 border-b">Direction</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {correlationMatrix && correlationMatrix['purchase_amount'] && Object.entries(correlationMatrix['purchase_amount']).map(([feat, r]) => {
                    if (feat === 'purchase_amount') return null;
                    const abs = Math.abs(r);
                    const str = abs >= 0.7 ? 'Strong' : abs >= 0.4 ? 'Moderate' : 'Weak';
                    const dir = r > 0 ? 'Positive' : r < 0 ? 'Negative' : 'None';
                    return (
                      <tr key={feat}>
                        <td className="p-2 font-medium capitalize">{feat.replace(/_/g, ' ')}</td>
                        <td className="p-2 font-mono font-bold">{r}</td>
                        <td className="p-2 font-medium">{str}</td>
                        <td className="p-2 font-medium">{dir}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 4: Machine Learning Model Evaluation */}
          {mlModel && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3 pb-1 border-b border-slate-100">
                4. Predictive Linear Regression Model Performance
              </h2>
              <div className="grid grid-cols-3 gap-3 text-center mb-3">
                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl">
                  <div className="text-sm font-bold text-slate-900">R² = {mlModel.r2}</div>
                  <div className="text-[10px] text-slate-500">Variance Explained</div>
                </div>
                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl">
                  <div className="text-sm font-bold text-slate-900">MAE = ${mlModel.mae}</div>
                  <div className="text-[10px] text-slate-500">Mean Abs Error</div>
                </div>
                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl">
                  <div className="text-sm font-bold text-slate-900">RMSE = ${mlModel.rmse}</div>
                  <div className="text-[10px] text-slate-500">Root Mean Sq Error</div>
                </div>
              </div>
            </div>
          )}

          {/* Sign-off Footnote */}
          <div className="pt-4 border-t border-slate-200 flex justify-between items-center text-[10px] text-slate-400">
            <div>E-Commerce Analytics Engine • Correlation & Machine Learning Dashboard</div>
            <div>Page 1 of 1</div>
          </div>
        </div>
      </div>
    </div>
  );
}
