import React from 'react';
import { 
  Info, 
  Database, 
  Code2, 
  Cpu, 
  BookOpen, 
  Layers, 
  Server, 
  CheckCircle2, 
  FileCode 
} from 'lucide-react';

export default function AboutProject() {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Title Header */}
      <div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <Info className="w-5 h-5 text-blue-600" />
          <span>About Project & Architectural Overview</span>
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Technical specifications, mathematical methodology, MySQL database schema, and full-stack architecture documentation.
        </p>
      </div>

      {/* SECTION 1: SYSTEM ARCHITECTURE & TECH STACK */}
      <div className="glass-card p-6 rounded-3xl border border-slate-200 shadow-md space-y-4">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Cpu className="w-5 h-5 text-indigo-600" />
          <span>Technology Stack & Architecture</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 space-y-2 text-xs">
            <div className="font-bold text-blue-900 flex items-center gap-2">
              <Code2 className="w-4 h-4 text-blue-600" />
              <span>Frontend Architecture</span>
            </div>
            <ul className="space-y-1 text-slate-700 text-[11px] list-disc list-inside">
              <li>React.js (Vite Build Engine)</li>
              <li>Tailwind CSS (Glassmorphism BI UI)</li>
              <li>Recharts (Interactive Analytics)</li>
              <li>Lucide React (Modern Icons)</li>
              <li>PapaParse (CSV Dynamic Parsing)</li>
            </ul>
          </div>

          <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-200 space-y-2 text-xs">
            <div className="font-bold text-indigo-900 flex items-center gap-2">
              <Server className="w-4 h-4 text-indigo-600" />
              <span>Backend API Server</span>
            </div>
            <ul className="space-y-1 text-slate-700 text-[11px] list-disc list-inside">
              <li>Node.js + Express.js REST Framework</li>
              <li>Pearson Correlation Calculation Engine</li>
              <li>Descriptive Statistical Analytics Engine</li>
              <li>K-Means Unsupervised Clustering</li>
              <li>Multiple Linear Regression Estimator</li>
            </ul>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-2 text-xs">
            <div className="font-bold text-emerald-900 flex items-center gap-2">
              <Database className="w-4 h-4 text-emerald-600" />
              <span>Database Layer</span>
            </div>
            <ul className="space-y-1 text-slate-700 text-[11px] list-disc list-inside">
              <li>MySQL (<code className="font-bold">ecommerce_analytics</code>)</li>
              <li><code className="font-bold">customers</code> relational table</li>
              <li><code className="font-bold">purchases</code> relational table</li>
              <li>Foreign Key Integrity Constraints</li>
              <li>Auto fallback data sync engine</li>
            </ul>
          </div>
        </div>
      </div>

      {/* SECTION 2: MYSQL DATABASE SCHEMA DOCUMENTATION */}
      <div className="glass-card p-6 rounded-3xl border border-slate-200 shadow-md space-y-4">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Database className="w-5 h-5 text-emerald-600" />
          <span>MySQL Database Schema & Relational Model</span>
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 text-xs font-mono">
          {/* Customers Schema */}
          <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-2 border border-slate-800">
            <div className="flex justify-between items-center text-blue-400 font-bold border-b border-slate-800 pb-2">
              <span>Table: customers</span>
              <span className="text-[10px] text-slate-400">Primary Entity</span>
            </div>
            <pre className="text-[11px] text-slate-300 overflow-x-auto leading-relaxed">
{`CREATE TABLE customers (
    customer_id INT PRIMARY KEY,
    age INT NOT NULL,
    gender VARCHAR(20) NOT NULL,
    location VARCHAR(100) NOT NULL,
    income DECIMAL(10, 2) NOT NULL,
    registration_date DATE NOT NULL
);`}
            </pre>
          </div>

          {/* Purchases Schema */}
          <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-2 border border-slate-800">
            <div className="flex justify-between items-center text-indigo-400 font-bold border-b border-slate-800 pb-2">
              <span>Table: purchases</span>
              <span className="text-[10px] text-slate-400">Foreign Key Customer ID</span>
            </div>
            <pre className="text-[11px] text-slate-300 overflow-x-auto leading-relaxed">
{`CREATE TABLE purchases (
    purchase_id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT NOT NULL,
    product_category VARCHAR(50) NOT NULL,
    quantity INT NOT NULL,
    discount DECIMAL(5, 2) NOT NULL,
    purchase_amount DECIMAL(10, 2) NOT NULL,
    purchase_date DATE NOT NULL,
    review_rating DECIMAL(3, 1) NOT NULL,
    purchase_frequency INT NOT NULL,
    previous_purchases INT NOT NULL,
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
);`}
            </pre>
          </div>
        </div>
      </div>

      {/* SECTION 3: MATHEMATICAL METHODOLOGY & FORMULAS */}
      <div className="glass-card p-6 rounded-3xl border border-slate-200 shadow-md space-y-4">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-purple-600" />
          <span>Mathematical Formulation & Methodology</span>
        </h2>

        <div className="space-y-3 text-xs text-slate-700">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="font-bold text-slate-900 text-sm">1. Pearson Correlation Coefficient (r)</div>
            <p className="text-slate-600 text-xs">
              Measures linear relationship strength between continuous variables X and Y:
            </p>
            <div className="p-3 bg-white border border-slate-300 rounded-xl text-center font-mono font-bold text-indigo-900">
              r = Σ[(x - x̄)(y - ȳ)] / √[Σ(x - x̄)² * Σ(y - ȳ)²]
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="font-bold text-slate-900 text-sm">2. Multiple Linear Regression OLS Formulation</div>
            <p className="text-slate-600 text-xs">
              Estimates Purchase Amount target using normalized feature parameters:
            </p>
            <div className="p-3 bg-white border border-slate-300 rounded-xl text-center font-mono font-bold text-blue-900">
              Y_hat = β0 + β1(Age) + β2(Income) + β3(Quantity) + β4(Discount) + β5(Frequency) + β6(Rating)
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
