import React from 'react';
import { AlertTriangle, ArrowRight, Truck, CheckCircle2 } from 'lucide-react';

export default function RegionalAlertBanner({
  alert,
  onOpenRecommendation,
  isMitigated = false,
}) {
  if (!alert) return null;

  return (
    <aside aria-label="Regional shortage notification" className={`w-full transition-all duration-300 border-b ${
      isMitigated
        ? 'bg-emerald-600 border-emerald-700 text-white'
        : 'bg-gradient-to-r from-amber-500 via-amber-600 to-orange-600 border-amber-600 text-white shadow-md'
    }`}>
      <div className="max-w-7xl mx-auto px-6 py-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-3.5">
          <div className={`p-2 rounded-lg ${
            isMitigated ? 'bg-white/20' : 'bg-white/20 backdrop-blur-xs animate-pulse'
          }`}>
            {isMitigated ? (
              <Truck className="w-5 h-5 text-white" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-white" />
            )}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-sm sm:text-base tracking-wide uppercase">
                {isMitigated ? 'Mitigation In Progress' : 'Regional Shortage Signal Detected'}
              </span>
              <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full ${
                isMitigated ? 'bg-white text-emerald-800' : 'bg-white text-amber-900 shadow-xs'
              }`}>
                {isMitigated ? 'Dispatched' : 'Upstream Cluster Pattern'}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-white/95 font-medium mt-0.5">
              {isMitigated
                ? 'Stock rebalancing active: 150 units Oxytocin dispatched from Brahmavar CHC to District Hospital Ajjarkad.'
                : alert.headline || '⚠ Regional Shortage Signal: Oxytocin Injection - 4 of 6 facilities in Udupi Taluk trending toward stockout.'}
            </p>
            {!isMitigated && (
              <p className="text-xs text-amber-100 font-normal hidden md:block">
                {alert.subtext || '4 of 6 facilities in Udupi Taluk show declining stock with no matching replenishment'}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {isMitigated ? (
            <div className="flex items-center space-x-2 bg-white/20 px-3 py-1.5 rounded-lg text-xs font-semibold">
              <CheckCircle2 className="w-4 h-4 text-emerald-200" />
              <span>Transfer En Route (ETA 25 min)</span>
            </div>
          ) : (
            <button
              onClick={onOpenRecommendation}
              className="group flex items-center space-x-2 bg-white text-amber-900 hover:bg-amber-50 active:scale-95 font-bold text-xs sm:text-sm px-4 py-2 rounded-lg shadow-sm hover:shadow-md transition-all cursor-pointer"
            >
              <span>View Recommendation</span>
              <ArrowRight className="w-4 h-4 text-amber-800 group-hover:translate-x-1 transition-transform" />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}
