import React from 'react';
import { cn } from '../lib/utils';

interface PriceBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  price: number;
  compareAtPrice?: number;
  className?: string;
}

export const PriceBadge = ({ price, compareAtPrice, className, ...props }: PriceBadgeProps) => {
  const isOnSale = compareAtPrice !== undefined && compareAtPrice > price;
  const discount = isOnSale ? Math.round(((compareAtPrice! - price) / compareAtPrice!) * 100) : 0;

  if (isOnSale) {
    return (
      <div 
        className={cn("flex items-center gap-2 select-none flex-wrap", className)}
        {...props}
      >
        <span className="text-xs text-stone-400 line-through decoration-stone-400/50 font-sans">
           PKR {compareAtPrice?.toLocaleString()}
        </span>
        
        {/* Liquid Badge for New Price */}
        <div className="relative inline-flex items-center justify-center px-3 py-1 rounded-full bg-stone-100/40 shadow-[0_2px_10px_rgba(0,0,0,0.08),inset_2px_2px_1px_-1px_rgba(255,255,255,0.8),inset_-2px_-2px_4px_rgba(0,0,0,0.05),0_0_0_0.5px_rgba(0,0,0,0.05)] backdrop-blur-md">
           <span className="relative z-10 font-serif font-medium text-red-900 text-sm tracking-wide">
             PKR {price.toLocaleString()}
           </span>
        </div>

        <span className="text-[9px] font-bold text-red-800 bg-red-50 border border-red-100 px-1.5 py-0.5 rounded-md uppercase tracking-wider">
            {discount}% OFF
        </span>
      </div>
    );
  }

  return (
    <div 
      className={cn(
        "relative inline-flex items-center justify-center px-4 py-1.5 rounded-full select-none",
        className
      )}
      {...props}
    >
      <div className="absolute top-0 left-0 z-0 h-full w-full rounded-full 
        bg-stone-100/40
        shadow-[0_2px_10px_rgba(0,0,0,0.08),inset_2px_2px_1px_-1px_rgba(255,255,255,0.8),inset_-2px_-2px_4px_rgba(0,0,0,0.05),0_0_0_0.5px_rgba(0,0,0,0.05)]
        backdrop-blur-md" 
      />
      
      <span className="relative z-10 font-serif font-medium text-obsidian text-sm tracking-wide">
        PKR {price.toLocaleString()}
      </span>
    </div>
  );
};