import React from 'react';
import { 
  Truck, 
  ArrowRight, 
  CheckCircle2, 
  X, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  AlertTriangle,
  Zap
} from 'lucide-react';

export default function RedistributionModal({
  isOpen,
  onClose,
  suggestion,
  onApprove,
  isApproving = false,
}) {
  if (!isOpen || !suggestion) return null;

  const { from_facility, to_facility, distance_text, quantity, medicine_name, rationale } = suggestion;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden transform transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-slate-900 px-6 py-4 flex items-center justify-between text-white">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-500/20 border border-teal-400/30 flex items-center justify-center text-teal-400">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-bold text-base tracking-tight">Suggested Redistribution</h3>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-teal-500/20 text-teal-300 px-2 py-0.5 rounded">
                  Algorithmic Match
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Optimized regional transfer for {medicine_name}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white rounded-lg p-1.5 hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          {/* Main Transfer Visual Cards */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3 items-center">
            {/* FROM Card (Facility A) */}
            <div className="md:col-span-2 bg-emerald-50/60 border border-emerald-200 rounded-xl p-4 relative">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-800 bg-emerald-200/60 px-2 py-0.5 rounded">
                  SOURCE (FROM)
                </span>
                <span className="text-xs font-bold text-emerald-700">Surplus</span>
              </div>
              <h4 className="font-bold text-slate-900 text-sm">{from_facility.name}</h4>
              <p className="text-[11px] text-slate-500">{from_facility.type}</p>
              
              <div className="mt-3 pt-2.5 border-t border-emerald-200/60 space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-600">Stock remaining:</span>
                  <span className="font-bold text-emerald-800">{from_facility.stock_remaining}</span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-500">Buffer after transfer:</span>
                  <span className="font-semibold text-emerald-700">&gt;12 days (Safe)</span>
                </div>
              </div>
            </div>

            {/* Transfer Vector / Arrow in center */}
            <div className="md:col-span-1 flex flex-col items-center justify-center py-2 text-center">
              <div className="w-10 h-10 rounded-full bg-teal-600 text-white flex items-center justify-center shadow-md mb-1 animate-pulse">
                <Truck className="w-5 h-5" />
              </div>
              <span className="text-xs font-extrabold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200 whitespace-nowrap">
                {quantity} units
              </span>
              <span className="text-[10px] text-slate-400 mt-1 font-medium">Direct dispatch</span>
            </div>

            {/* TO Card (Facility D) */}
            <div className="md:col-span-2 bg-red-50/60 border border-red-200 rounded-xl p-4 relative">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-red-800 bg-red-200/60 px-2 py-0.5 rounded">
                  TARGET (TO)
                </span>
                <span className="text-xs font-bold text-red-700">Critical Deficit</span>
              </div>
              <h4 className="font-bold text-slate-900 text-sm">{to_facility.name}</h4>
              <p className="text-[11px] text-slate-500">{to_facility.type}</p>

              <div className="mt-3 pt-2.5 border-t border-red-200/60 space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-600">Stock remaining:</span>
                  <span className="font-bold text-red-800">{to_facility.stock_remaining}</span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-500">Post-transfer runway:</span>
                  <span className="font-semibold text-emerald-700">Extended to 7-9 days</span>
                </div>
              </div>
            </div>
          </div>

          {/* Logistics Line */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 flex items-center justify-between text-xs">
            <div className="flex items-center space-x-2 text-slate-700 font-semibold">
              <MapPin className="w-4 h-4 text-teal-600" />
              <span>Logistics & Distance:</span>
              <span className="text-slate-900 font-bold">{distance_text}</span>
            </div>
            <div className="flex items-center space-x-1 text-teal-700 bg-teal-50 border border-teal-200 px-2.5 py-1 rounded-md font-medium">
              <Clock className="w-3.5 h-3.5" />
              <span>Immediate Vehicle Available</span>
            </div>
          </div>

          {/* Transfer Rationale */}
          <div className="text-xs text-slate-600 bg-slate-50/50 p-3 rounded-xl border border-slate-100 flex items-start space-x-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
            <p className="leading-relaxed">
              <span className="font-semibold text-slate-800">Recommendation Rationale: </span>
              {rationale || 'Balances urgent deficit at high-volume delivery CHC using buffer stock from nearby PHC without compromising PHC 14-day threshold.'}
            </p>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex items-center justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-200/70 rounded-xl transition cursor-pointer"
          >
            Dismiss
          </button>
          <button
            type="button"
            onClick={() => onApprove(suggestion.id)}
            disabled={isApproving}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-sm rounded-xl shadow-md hover:shadow-lg transition-all flex items-center space-x-2 cursor-pointer disabled:opacity-50"
          >
            <Truck className="w-4 h-4" />
            <span>{isApproving ? 'Dispatching...' : 'Approve Transfer'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
