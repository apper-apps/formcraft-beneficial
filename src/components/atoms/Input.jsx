import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Input = forwardRef(({ 
  className = "", 
  type = "text",
  error = false,
  ...props 
}, ref) => {
const baseClasses = "flex h-11 w-full rounded-xl border bg-gradient-to-r from-white to-gray-50 dark:from-gray-800 dark:to-gray-750 px-4 py-3 text-sm placeholder:text-gray-400 dark:placeholder:text-gray-500 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-offset-white dark:focus:ring-offset-gray-900 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-300 ease-out hover:shadow-lg focus:shadow-xl backdrop-blur-sm";
  
  const fileClasses = type === "file" 
    ? "file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-gradient-to-r file:from-primary-50 file:to-primary-100 dark:file:from-primary-900 dark:file:to-primary-800 file:text-primary-700 dark:file:text-primary-300 hover:file:from-primary-100 hover:file:to-primary-200 dark:hover:file:from-primary-800 dark:hover:file:to-primary-700 file:cursor-pointer file:transition-all file:duration-300 file:shadow-sm hover:file:shadow-md"
    : "";
    
  const errorClasses = error 
    ? "border-red-400 focus:ring-red-500 focus:border-red-500 shadow-red-100 dark:shadow-red-900/20 bg-gradient-to-r from-red-50 to-white dark:from-red-900/10 dark:to-gray-800" 
    : "border-gray-200 dark:border-gray-700 focus:ring-primary-500 focus:border-primary-400 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-md focus:from-primary-50 focus:to-white dark:focus:from-primary-900/10 dark:focus:to-gray-800";
  return (
    <input
      type={type}
      className={cn(
        baseClasses,
        fileClasses,
        errorClasses,
        className
      )}
      ref={ref}
      {...props}
    />
  );
});

Input.displayName = "Input";

export default Input;