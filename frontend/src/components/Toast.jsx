import React, { useEffect } from 'react';
import { CheckCircle2, Truck, X } from 'lucide-react';

export default function Toast({
  message,
  subtext,
  isOpen,
  onClose,
  duration = 5000,
}) {
  useEffect(() => {
    if (!isOpen) return;
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [isOpen, duration, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 duration-300">
      <div className="bg-slate-900 text-white px-5 py-4 rounded-2xl shadow-2xl border border-slate-700 flex items-start space-x-3.5 max-w-md">
        <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0 mt-0.5">
          <Truck className="w-5 h-5 animate-pulse" />
        </div>
        <div className="flex-1 pr-2">
          <div className="flex items-center space-x-1.5">
            <h4 className="font-bold text-sm tracking-tight text-white">{message}</h4>
          </div>
          {subtext && <p className="text-xs text-slate-300 mt-0.5 leading-normal">{subtext}</p>}
        </div>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-white transition p-1 -mr-1 cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
