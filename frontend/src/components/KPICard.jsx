import React from 'react';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

export default function KPICard({ title, value, icon: Icon, description, trend, trendValue, iconBg = "bg-blue-50 text-blue-600" }) {
  const isUp = trend === 'up';
  const isDown = trend === 'down';

  return (
    <div className="glass-card p-5 rounded-2xl border border-slate-200/90 hover:border-blue-300 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300 flex flex-col justify-between group">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <span className="text-xs font-semibold text-slate-500 tracking-wide uppercase">{title}</span>
          <h3 className="text-xl lg:text-2xl font-bold text-slate-900 mt-1 tracking-tight group-hover:text-blue-600 transition-colors">
            {value}
          </h3>
        </div>
        <div className={`p-3 rounded-xl shrink-0 ${iconBg} shadow-xs`}>
          <Icon className="w-5 h-5 stroke-[2]" />
        </div>
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-slate-100/80">
        <p className="text-[11px] text-slate-500 font-medium truncate">{description}</p>
        
        {trendValue && (
          <div className={`flex items-center gap-0.5 text-[11px] font-bold px-2 py-0.5 rounded-full ${
            isUp ? 'bg-emerald-50 text-emerald-700' : isDown ? 'bg-rose-50 text-rose-700' : 'bg-slate-100 text-slate-600'
          }`}>
            {isUp && <ArrowUpRight className="w-3 h-3" />}
            {isDown && <ArrowDownRight className="w-3 h-3" />}
            {!isUp && !isDown && <Minus className="w-3 h-3" />}
            <span>{trendValue}</span>
          </div>
        )}
      </div>
    </div>
  );
}
