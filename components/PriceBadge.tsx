import React from 'react';
import { cn } from '../lib/utils';

interface PriceBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  price: number;
  className?: string;
}

export const PriceBadge = ({ price, className, ...props }: PriceBadgeProps) => {
  return (
    <div 
      className={cn(
        "relative inline-flex items-center justify-center px-4 py-1.5 rounded-full select-none",
        className
      )}
      {...props}
    >
      {/* 
        Liquid Badge Layer 
        Styled with complex shadows and highlights to mimic the liquid glass effect
        while ensuring visibility on light backgrounds.
      */}
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