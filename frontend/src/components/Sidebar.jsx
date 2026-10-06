import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  ShoppingBag, 
  GitCommit, 
  PieChart, 
  Table, 
  Lightbulb, 
  BrainCircuit, 
  Info,
  X
} from 'lucide-react';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'behavior', label: 'Customer Behavior', icon: Users },
  { id: 'purchase', label: 'Purchase Analysis', icon: ShoppingBag },
  { id: 'correlation', label: 'Correlation Analysis', icon: GitCommit },
  { id: 'segmentation', label: 'Customer Segmentation', icon: PieChart },
  { id: 'explorer', label: 'Data Explorer', icon: Table },
  { id: 'insights', label: 'Insights & Stats', icon: Lightbulb },
  { id: 'predictor', label: 'ML Predictor', icon: BrainCircuit },
  { id: 'about', label: 'About Project', icon: Info },
];

export default function Sidebar({ activeTab, setActiveTab, isOpen, setIsOpen }) {
  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Drawer */}
      <aside className={`
        fixed top-0 bottom-0 left-0 z-50 w-72 bg-slate-900 text-slate-100 flex flex-col border-r border-slate-800
        transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Brand Header */}
        <div className="h-16 px-6 flex items-center justify-between border-b border-slate-800 bg-slate-950/40">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
              <GitCommit className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h1 className="font-bold text-sm text-white tracking-wide leading-tight">InsightAnalytics</h1>
              <p className="text-[10px] text-slate-400 font-medium">Correlation & ML Intelligence</p>
            </div>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="lg:hidden text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 py-6 px-4 space-y-1.5 overflow-y-auto">
          <div className="px-3 pb-2 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
            Analytics Views
          </div>
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsOpen(false);
                }}
                className={`
                  w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all duration-200
                  ${isActive 
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 font-semibold' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }
                `}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
                {isActive && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                )}
              </button>
            );
          })}
        </nav>

        {/* System Status Footnote */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-950/30">
          <div className="p-3 rounded-xl bg-slate-850 border border-slate-800 flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
            <div className="text-[11px]">
              <div className="font-semibold text-slate-200">System Connected</div>
              <div className="text-slate-400 text-[10px]">Node Express & MySQL API</div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
