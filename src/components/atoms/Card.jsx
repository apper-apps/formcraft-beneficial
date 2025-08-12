import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Card = forwardRef(({ className = "", children, ...props }, ref) => {
  return (
    <div
      ref={ref}
className={cn(
        "rounded-xl bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 backdrop-blur-sm hover:border-gray-200 dark:hover:border-gray-600",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});

Card.displayName = "Card";

export default Card;