import React from 'react';
import { useStore } from '../StoreContext';
import { Check, X } from 'lucide-react';

const Toast = () => {
  const { toast, hideToast } = useStore();

  if (!toast) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[70] animate-fade-in-up w-[90%] md:w-auto min-w-[300px]">
      <div className="bg-obsidian/95 backdrop-blur text-white px-5 py-4 rounded-lg shadow-2xl border border-stone-800 flex items-center gap-4 justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-emerald-900/50 p-1 rounded-full border border-emerald-700/50">
            <Check className="w-3 h-3 text-emerald-400 stroke-[3]" />
          </div>
          <span className="text-xs font-medium tracking-wide">{toast.message}</span>
        </div>
        
        <div className="flex items-center gap-4">
          {toast.action && (
            <button 
              onClick={() => {
                toast.action?.onClick();
                hideToast();
              }}
              className="text-xs uppercase tracking-widest font-bold text-stone-300 hover:text-white border-b border-stone-600 hover:border-white transition-all pb-0.5"
            >
              {toast.action.label}
            </button>
          )}
          <button onClick={hideToast} className="text-stone-500 hover:text-white transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Toast;