import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Button = forwardRef(({ 
  children, 
  variant = "primary", 
  size = "md", 
  className = "", 
  disabled = false,
  ...props 
}, ref) => {
const baseStyles = "inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-300 ease-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm backdrop-blur-sm";
  
  const variants = {
    primary: "bg-gradient-to-r from-primary-500 via-primary-600 to-secondary-500 text-white hover:from-primary-600 hover:via-primary-700 hover:to-secondary-600 focus:ring-primary-500 shadow-lg hover:shadow-2xl transform hover:-translate-y-0.5 active:translate-y-0 hover:scale-[1.02] active:scale-[0.98]",
    secondary: "bg-gradient-to-r from-gray-50 to-white dark:from-gray-700 dark:to-gray-600 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-600 hover:from-gray-100 hover:to-gray-50 dark:hover:from-gray-600 dark:hover:to-gray-500 hover:border-gray-300 dark:hover:border-gray-500 focus:ring-primary-500 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 active:translate-y-0 hover:scale-[1.02] active:scale-[0.98]",
    ghost: "bg-transparent text-gray-600 dark:text-gray-400 hover:bg-gradient-to-r hover:from-gray-100 hover:to-gray-50 dark:hover:from-gray-700 dark:hover:to-gray-600 hover:text-gray-800 dark:hover:text-gray-200 focus:ring-gray-500 transform hover:scale-[1.02] active:scale-[0.98]",
    danger: "bg-gradient-to-r from-red-500 to-accent-500 text-white hover:from-red-600 hover:to-accent-600 focus:ring-red-500 shadow-lg hover:shadow-2xl transform hover:-translate-y-0.5 active:translate-y-0 hover:scale-[1.02] active:scale-[0.98]"
  };
  
  const sizes = {
    sm: "px-4 py-2 text-sm min-h-[36px]",
    md: "px-6 py-2.5 text-sm min-h-[40px]",
    lg: "px-8 py-3 text-base min-h-[44px]"
  };

  return (
    <button
      ref={ref}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = "Button";

export default Button;