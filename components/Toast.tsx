import React from 'react';
import { useStore } from '../StoreContext';
import { Check, X } from 'lucide-react';

const Toast = () => {
  const { toast, hideToast } = useStore();

  if (!toast) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:bottom-6 md:left-1/2 md:right-auto md:-translate-x-1/2 z-[70] animate-fade-in-up max-w-[420px] mx-auto">
      <div className="bg-obsidian/95 backdrop-blur text-white px-3 py-3 md:px-5 md:py-4 rounded-lg shadow-2xl border border-stone-800 flex items-center justify-between gap-3 md:gap-4">
        <div className="flex items-center gap-2 md:gap-3 flex-shrink-0 overflow-hidden">
          <div className="bg-emerald-900/50 p-1 rounded-full border border-emerald-700/50 flex-shrink-0">
            <Check className="w-3 h-3 text-emerald-400 stroke-[3]" />
          </div>
          <span className="text-xs font-medium tracking-wide truncate">{toast.message}</span>
        </div>
        
        <div className="flex items-center gap-3 md:gap-4 flex-shrink-0">
          {toast.actions && toast.actions.length > 0 && (
            <div className="flex items-center gap-3">
               {toast.actions.map((action, idx) => (
                  <button 
                    key={idx}
                    onClick={() => {
                      action.onClick();
                      hideToast();
                    }}
                    className={`text-[10px] uppercase tracking-widest font-bold transition-all pb-0.5 border-b whitespace-nowrap ${
                        action.primary 
                        ? 'text-white border-white hover:opacity-80' 
                        : 'text-stone-400 border-transparent hover:text-stone-200 hover:border-stone-400'
                    }`}
                  >
                    {action.label}
                  </button>
               ))}
            </div>
          )}
          <button onClick={hideToast} className="text-stone-500 hover:text-white transition-colors p-1 flex-shrink-0">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Toast;