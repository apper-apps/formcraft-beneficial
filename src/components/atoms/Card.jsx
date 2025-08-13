import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Card = forwardRef(({ className = "", children, ...props }, ref) => {
  return (
    <div
      ref={ref}
className={cn(
"rounded-xl bg-white dark:bg-dark-900/80 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-primary-500/30 backdrop-filter dark:backdrop-blur-lg hover:border-gray-200 dark:hover:border-primary-400/50",
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