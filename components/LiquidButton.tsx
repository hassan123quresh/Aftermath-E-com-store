import React from "react"
import { cva } from "class-variance-authority"
import { cn } from "../lib/utils"

// Static, high-contrast button styling
// Removed "Liquid" effects to meet user requirement for "static" buttons
const buttonVariants = cva(
  "relative inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-serif font-medium focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 overflow-hidden cursor-pointer select-none transition-all duration-200",
  {
    variants: {
      variant: {
        default: "bg-white text-obsidian border border-stone-300 hover:bg-stone-50",
        outline: "border border-obsidian text-obsidian bg-transparent hover:bg-obsidian hover:text-white",
        solid: "bg-obsidian text-white border border-obsidian hover:bg-stone-800",
        ghost: "bg-transparent text-obsidian hover:bg-stone-100",
        hero: "border border-white text-white bg-transparent hover:bg-white hover:text-obsidian", 
      },
      size: {
        default: "h-11 px-6 py-2",
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
    
    return (
      <button
        className={cn(buttonVariants({ variant, size, fullWidth: fullWidth as any, className }))}
        ref={ref}
        {...props}
      >
        <span className="relative z-10 flex items-center justify-center gap-2 pointer-events-none">
          {children}
        </span>
      </button>
    )
  }
)
LiquidButton.displayName = "LiquidButton"

export default LiquidButton;