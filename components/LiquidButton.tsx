import React, { useState, useLayoutEffect } from "react"
import { cva } from "class-variance-authority"
import { cn } from "../lib/utils"

// Removed hover transition effects to meet "static" requirement
// Added touch-action manipulation for better mobile performance
const buttonVariants = cva(
  "relative inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 overflow-hidden cursor-pointer select-none touch-manipulation",
  {
    variants: {
      variant: {
        default: "bg-transparent text-obsidian border border-stone-200", // Standard button
        outline: "border border-stone-200 bg-transparent text-obsidian",
        solid: "bg-obsidian text-stone-100 border border-obsidian",
        ghost: "bg-transparent text-obsidian",
        hero: "border border-white/50 text-white bg-transparent", // Special variant for dark backgrounds
      },
      size: {
        default: "h-11 px-6 py-2", // Slightly taller for better touch target
        sm: "h-9 px-3 text-xs",
        lg: "h-12 px-8 text-base",
        xl: "h-14 px-10 text-lg tracking-widest uppercase",
        icon: "h-10 w-10",
      },
      fullWidth: {
        true: "w-full",
        false: ""
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      fullWidth: false,
    },
  }
)

export interface LiquidButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  variant?: "default" | "outline" | "solid" | "ghost" | "hero" | null | undefined;
  size?: "default" | "sm" | "lg" | "xl" | "icon" | null | undefined;
  fullWidth?: boolean | null | undefined;
}

const LiquidButton = React.forwardRef<HTMLButtonElement, LiquidButtonProps>(
  ({ className, variant, size, fullWidth, asChild = false, children, ...props }, ref) => {
    const [ripples, setRipples] = useState<{ x: number; y: number; id: number }[]>([])

    const createRipple = (event: React.MouseEvent<HTMLButtonElement>) => {
      const button = event.currentTarget
      const rect = button.getBoundingClientRect()
      
      const diameter = Math.max(button.clientWidth, button.clientHeight)
      const radius = diameter / 2
      
      const x = event.clientX - rect.left - radius
      const y = event.clientY - rect.top - radius

      const newRipple = { x, y, id: Date.now() }
      setRipples((prev) => [...prev, newRipple])

      if (props.onClick) {
        props.onClick(event)
      }
    }

    useLayoutEffect(() => {
      if (ripples.length > 0) {
        const timer = setTimeout(() => {
          setRipples((prev) => prev.slice(1))
        }, 600) // Match animation duration
        return () => clearTimeout(timer)
      }
    }, [ripples])

    return (
      <button
        className={cn(buttonVariants({ variant, size, fullWidth: fullWidth as any, className }))}
        ref={ref}
        {...props}
        onClick={createRipple}
      >
        <span className="relative z-10 flex items-center justify-center gap-2 pointer-events-none">
          {children}
        </span>
        {ripples.map((ripple) => (
          <span
            key={ripple.id}
            className="absolute rounded-full bg-current opacity-20 pointer-events-none animate-ripple"
            style={{
              top: ripple.y,
              left: ripple.x,
              width: Math.max((props.style?.width as any) || 100, 100) * 4 + 'px', 
              height: Math.max((props.style?.width as any) || 100, 100) * 4 + 'px',
              minWidth: '200px', // Ensure visibility on small buttons
              minHeight: '200px'
            }}
          />
        ))}
        <style>{`
          .animate-ripple {
            animation: ripple 0.6s linear;
            transform: scale(0);
          }
          @keyframes ripple {
            to {
              transform: scale(2.5);
              opacity: 0;
            }
          }
        `}</style>
      </button>
    )
  }
)
LiquidButton.displayName = "LiquidButton"

export default LiquidButton;