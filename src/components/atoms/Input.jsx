import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Input = forwardRef(({ 
  className = "", 
  type = "text",
  error = false,
  ...props 
}, ref) => {
const baseClasses = "flex h-10 w-full rounded-lg border bg-white dark:bg-gray-800 px-3 py-2 text-sm placeholder:text-gray-500 dark:placeholder:text-gray-400 text-gray-900 dark:text-white focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-300 ease-out hover:shadow-md focus:shadow-lg";
  
  const fileClasses = type === "file" 
    ? "file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100 file:cursor-pointer file:transition-all file:duration-300"
    : "";
    
  const errorClasses = error 
    ? "border-red-500 focus:ring-red-500 focus:border-red-500 shadow-red-100" 
    : "border-gray-300 dark:border-gray-600 focus:ring-primary-500 focus:border-primary-500 hover:border-gray-400 dark:hover:border-gray-500";

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