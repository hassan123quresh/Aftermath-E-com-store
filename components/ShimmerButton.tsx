import React from 'react';
import { cn } from '../lib/utils';

interface ShimmerButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

const ShimmerButton = React.forwardRef<HTMLButtonElement, ShimmerButtonProps>(
  ({ children, className, ...props }, ref) => {
    // CSS to enable the seamless rotation animation
    const customCss = `
      @property --angle {
        syntax: '<angle>';
        initial-value: 0deg;
        inherits: false;
      }
      @keyframes shimmer-spin {
        to {
          --angle: 360deg;
        }
      }
    `;

    return (
      <button
        ref={ref}
        className={cn(
          "relative inline-flex items-center justify-center p-[1.5px] overflow-hidden group rounded-md",
          className
        )}
        {...props}
      >
        <style>{customCss}</style>
        
        {/* Shimmer Gradient Layer */}
        <div 
          className="absolute inset-0 z-0 opacity-100"
          style={{
            // Using white for the shimmer to contrast against the dark background of the app
            background: 'conic-gradient(from var(--angle), transparent 25%, #ffffff, transparent 50%)', 
            animation: 'shimmer-spin 3s linear infinite',
          }}
        />

        {/* Inner Content Layer */}
        <span className="relative z-10 inline-flex items-center justify-center w-full h-full bg-obsidian text-stone-100 group-hover:bg-stone-900 transition-colors duration-300 rounded-[calc(0.375rem-1.5px)]">
           {children}
        </span>
      </button>
    );
  }
);

ShimmerButton.displayName = "ShimmerButton";
export default ShimmerButton;