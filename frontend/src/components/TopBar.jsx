import React from 'react';
import { Pill, ShieldAlert, RefreshCw, Layers } from 'lucide-react';

export default function TopBar({
  medicines = [],
  selectedMedicineId,
  onSelectMedicine,
  onResetDemo,
  isResetting,
}) {
  return (
    <header className="bg-white border-b border-slate-200 px-6 py-3.5 flex flex-wrap items-center justify-between shadow-xs z-20 relative">
      {/* Brand and Context */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2.5">
          <div className="w-9 h-9 rounded-lg bg-teal-600 flex items-center justify-center text-white shadow-xs">
            <Pill className="w-5 h-5 rotate-45" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-lg text-slate-900 tracking-tight">SupplySense</span>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200">
                Early Warning Engine
              </span>
            </div>
            <div className="text-xs text-slate-500 flex items-center space-x-1.5">
              <Layers className="w-3 h-3 text-slate-400" />
              <span className="font-medium text-slate-600">Udupi Taluk, District Health View</span>
            </div>
          </div>
        </div>
      </div>

      {/* Medicine Selector and Actions */}
      <div className="flex items-center space-x-4 mt-2 sm:mt-0">
        <div className="flex items-center space-x-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 focus-within:ring-2 focus-within:ring-teal-500 focus-within:border-teal-500 transition">
          <label htmlFor="medicine-select" className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Medicine:
          </label>
          <select
            id="medicine-select"
            value={selectedMedicineId}
            onChange={(e) => onSelectMedicine(e.target.value)}
            className="bg-transparent text-sm font-semibold text-slate-800 focus:outline-none cursor-pointer pr-2"
          >
            {medicines.map((med) => (
              <option key={med.id} value={med.id}>
                {med.name} {med.has_regional_signal ? '• (Signal Active)' : ''}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={onResetDemo}
          disabled={isResetting}
          title="Reset scenario data to initial state"
          className="flex items-center space-x-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg px-2.5 py-1.5 transition cursor-pointer disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isResetting ? 'animate-spin' : ''}`} />
          <span>Reset Demo</span>
        </button>
      </div>
    </header>
  );
}
