import React from 'react';
import { 
  Building2, 
  Calendar, 
  TrendingDown, 
  Clock, 
  Package, 
  AlertTriangle, 
  CheckCircle2, 
  Truck, 
  ArrowUpRight,
  Info
} from 'lucide-react';

export default function FacilityDetailPanel({
  facility,
  medicineName = 'Oxytocin Injection',
  onTriggerRedistribution,
  hasRegionalAlert = false,
}) {
  if (!facility) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center flex flex-col items-center justify-center h-full min-h-[500px] shadow-xs">
        <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 mb-4">
          <Building2 className="w-8 h-8 stroke-[1.5]" />
        </div>
        <h3 className="font-bold text-slate-800 text-base mb-1">Facility Telemetry</h3>
        <p className="text-slate-500 text-xs max-w-[240px] leading-relaxed">
          Select any facility marker on the Udupi Taluk map to view live inventory levels, consumption trends, and replenishment records.
        </p>
        <div className="mt-6 inline-flex items-center space-x-1.5 text-xs text-teal-700 bg-teal-50 border border-teal-200 px-3 py-1.5 rounded-full font-medium">
          <span className="w-2 h-2 rounded-full bg-teal-500 animate-ping"></span>
          <span>Click District Hospital Ajjarkad (Critical) for demo</span>
        </div>
      </div>
    );
  }

  const isCritical = facility.status === 'critical';
  const isEnRoute = facility.status === 'in_transit' || facility.incoming_transfer;
  const isLow = facility.status === 'low';

  // Calculate max trend point for bar height scaling
  const trend = facility.trend || [100, 90, 80, 70, 60, 50, 45];
  const maxTrend = Math.max(...trend, 100);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col h-full shadow-xs overflow-y-auto">
      {/* Header Info */}
      <div className="pb-4 border-b border-slate-100">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">{facility.name}</h2>
            </div>
            <p className="text-xs font-medium text-slate-500 mt-0.5">{facility.type} • {facility.block}</p>
          </div>

          {/* Status Badge */}
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide flex items-center space-x-1 shadow-2xs ${
              isEnRoute
                ? 'bg-blue-50 text-blue-700 border border-blue-200'
                : isCritical
                ? 'bg-red-50 text-red-700 border border-red-200 animate-pulse'
                : isLow
                ? 'bg-amber-50 text-amber-700 border border-amber-200'
                : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
            }`}
          >
            {isEnRoute ? (
              <>
                <Truck className="w-3.5 h-3.5" />
                <span>Transfer En Route</span>
              </>
            ) : isCritical ? (
              <>
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Critical Risk</span>
              </>
            ) : isLow ? (
              <>
                <Clock className="w-3.5 h-3.5" />
                <span>Low Stock</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Healthy</span>
              </>
            )}
          </span>
        </div>

        {/* In-Transit Banner if Transfer Approved */}
        {isEnRoute && (
          <div className="mt-3 bg-blue-50 border border-blue-200 rounded-xl p-3 flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-xs">
                <Truck className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-blue-900 block">Active Stock Redistribution</span>
                <span className="text-[11px] text-blue-700">
                  +150 units from Brahmavar CHC (ETA: 24 mins via NH 66)
                </span>
              </div>
            </div>
            <span className="text-[10px] font-bold uppercase bg-blue-200/70 text-blue-900 px-2 py-0.5 rounded">
              Dispatched
            </span>
          </div>
        )}
      </div>

      {/* Primary Telemetry Metrics */}
      <div className="grid grid-cols-2 gap-3.5 my-4">
        {/* Current Stock */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3.5">
          <div className="flex items-center space-x-1.5 text-slate-500 mb-1">
            <Package className="w-3.5 h-3.5" />
            <span className="text-xs font-semibold uppercase tracking-wider">Current Stock</span>
          </div>
          <div className="flex items-baseline space-x-1.5">
            <span className="text-2xl font-extrabold text-slate-900 tracking-tight">
              {facility.current_stock}
            </span>
            <span className="text-xs font-medium text-slate-500">units</span>
          </div>
          <span className="text-[11px] text-slate-400 mt-0.5 block">{medicineName}</span>
        </div>

        {/* Days of Stock Remaining (Range format for uncertainty communication) */}
        <div className={`rounded-xl p-3.5 border ${
          isCritical
            ? 'bg-red-50/70 border-red-200 text-red-900'
            : isLow
            ? 'bg-amber-50/70 border-amber-200 text-amber-900'
            : 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
        }`}>
          <div className="flex items-center space-x-1.5 mb-1 opacity-80">
            <Clock className="w-3.5 h-3.5" />
            <span className="text-xs font-semibold uppercase tracking-wider">Days Remaining</span>
          </div>
          <div className="flex items-baseline space-x-1.5">
            <span className="text-2xl font-extrabold tracking-tight">
              {facility.days_of_stock}
            </span>
          </div>
          <span className="text-[10px] font-medium opacity-75 mt-0.5 block flex items-center space-x-1">
            <Info className="w-3 h-3" />
            <span>Uncertainty range (±15% variance)</span>
          </span>
        </div>
      </div>

      {/* Consumption Trend Bar Chart (Last 7 intervals) */}
      <div className="my-2 bg-slate-50/80 border border-slate-200 rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-1.5">
            <TrendingDown className={`w-4 h-4 ${isCritical ? 'text-red-500' : 'text-slate-600'}`} />
            <span className="text-xs font-bold text-slate-800">Consumption & Depletion Trend</span>
          </div>
          <span className="text-[11px] font-semibold text-slate-500">Last 7 reporting periods</span>
        </div>

        {/* CSS Bar Chart */}
        <div className="h-28 flex items-end justify-between gap-2 pt-4 px-2">
          {trend.map((val, idx) => {
            const heightPercent = Math.max(12, Math.round((val / maxTrend) * 100));
            const isLast = idx === trend.length - 1;
            return (
              <div key={idx} className="flex-1 flex flex-col items-center group relative">
                {/* Hover Tooltip */}
                <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-7 bg-slate-900 text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow pointer-events-none whitespace-nowrap z-20">
                  {val} units
                </div>
                {/* Bar */}
                <div
                  style={{ height: `${heightPercent}%` }}
                  className={`w-full rounded-t-md transition-all duration-300 ${
                    isLast
                      ? isCritical
                        ? 'bg-red-500 group-hover:bg-red-600'
                        : isLow
                        ? 'bg-amber-400 group-hover:bg-amber-500'
                        : 'bg-emerald-500 group-hover:bg-emerald-600'
                      : 'bg-slate-300 group-hover:bg-slate-400'
                  }`}
                />
                {/* Day label */}
                <span className="text-[10px] font-medium text-slate-400 mt-1.5">
                  D-{7 - idx}
                </span>
              </div>
            );
          })}
        </div>
        <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2 pt-2 border-t border-slate-200/60">
          <span>Avg daily burn: ~{facility.daily_consumption || 24} units/day</span>
          <span className="font-semibold text-slate-700">Telemetry: {facility.data_reliability || 'Verified'}</span>
        </div>
      </div>

      {/* Replenishment History List */}
      <div className="my-2">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center space-x-1.5">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>Replenishment History</span>
          </span>
          <span className="text-[11px] text-slate-400">Upstream Supply Chain</span>
        </div>

        <div className="space-y-1.5">
          {facility.replenishment_history?.map((rep, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-150 text-xs"
            >
              <div className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                <span className="font-semibold text-slate-700">{rep.date}</span>
                <span className="text-slate-500 font-medium">({rep.quantity})</span>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                rep.status.includes('En Route') || rep.status.includes('Dispatched')
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-emerald-100 text-emerald-800'
              }`}>
                {rep.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Suggested Action Trigger (Star call to action for demo) */}
      {(isCritical || hasRegionalAlert) && !isEnRoute && (
        <div className="mt-auto pt-4">
          <button
            onClick={onTriggerRedistribution}
            className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold text-sm py-3 px-4 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center space-x-2 cursor-pointer active:scale-[0.99]"
          >
            <Truck className="w-4 h-4" />
            <span>Review Redistribution Recommendation</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
