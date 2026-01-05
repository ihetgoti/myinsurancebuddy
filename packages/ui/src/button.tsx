import * as React from "react"
import { cn } from "./lib/utils"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
    size?: 'sm' | 'md' | 'lg' | 'icon';
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
        return (
            <button
                className={cn(
                    "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
                    // Variants
                    variant === 'primary' && "bg-blue-600 text-white hover:bg-blue-700",
                    variant === 'secondary' && "bg-slate-100 text-slate-900 hover:bg-slate-200",
                    variant === 'outline' && "border border-slate-200 bg-white hover:bg-slate-100 text-slate-900",
                    variant === 'ghost' && "hover:bg-slate-100 hover:text-slate-900",
                    variant === 'destructive' && "bg-red-500 text-white hover:bg-red-600",
                    // Sizes
                    size === 'sm' && "h-9 rounded-md px-3",
                    size === 'md' && "h-10 px-4 py-2",
                    size === 'lg' && "h-11 rounded-md px-8",
                    size === 'icon' && "h-10 w-10",
                    className
                )}
                ref={ref}
                {...props}
            />
        )
    }
)
Button.displayName = "Button"

export { Button }
