import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "btn focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "btn-primary",
        secondary: "btn-secondary", 
        ghost: "btn-ghost",
        outline: "border border-[var(--border-visible)] bg-transparent hover:bg-[var(--accent)] hover:border-[var(--primary)]",
        destructive: "bg-[var(--error)] text-white hover:bg-[var(--error)]/90",
        link: "bg-transparent text-[var(--primary)] hover:text-[var(--primary)]/80 underline-offset-4 hover:underline p-0 h-auto",
      },
      size: {
        default: "px-4 py-2 text-sm",
        sm: "px-3 py-1.5 text-xs",
        lg: "px-6 py-3 text-base",
        xl: "px-8 py-4 text-lg",
        icon: "p-2 w-10 h-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  loading?: boolean
  icon?: React.ReactNode
  rightIcon?: React.ReactNode
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, loading, icon, rightIcon, children, disabled, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    
    const buttonContent = (
      <>
        {loading && (
          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        )}
        
        {icon && !loading && (
          <span className="mr-2">
            {icon}
          </span>
        )}
        
        {children}
        
        {rightIcon && !loading && (
          <span className="ml-2">
            {rightIcon}
          </span>
        )}
      </>
    )
    
    if (asChild) {
      return (
        <Slot 
          className={cn(buttonVariants({ variant, size, className }))}
          ref={ref}
          {...props}
        >
          {children}
        </Slot>
      )
    }
    
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {buttonContent}
      </button>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }