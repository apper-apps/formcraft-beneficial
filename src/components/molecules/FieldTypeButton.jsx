import React from "react";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const FieldTypeButton = ({ 
  type, 
  icon, 
  label, 
  onDragStart,
  onTouchStart,
  onTouchEnd,
  isMobileDragging,
  className,
  ...props 
}) => {
  const handleDragStart = (e) => {
    e.dataTransfer.setData('text/plain', type);
    e.dataTransfer.effectAllowed = 'copy';
    onDragStart?.(type);
  };

  const handleTouchStart = (e) => {
    e.preventDefault();
    onTouchStart?.(type, e);
  };

  const handleTouchEnd = (e) => {
    e.preventDefault();
    onTouchEnd?.();
  };

  return (
    <div
    draggable
    onDragStart={handleDragStart}
    onTouchStart={handleTouchStart}
    onTouchEnd={handleTouchEnd}
    className={cn(
        "flex items-center gap-3 p-4 md:p-4 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-primary-300 dark:hover:border-primary-400 hover:shadow-md transition-all duration-200 cursor-grab active:cursor-grabbing select-none touch-manipulation",
        "hover:scale-[1.02] active:scale-95 min-h-[60px] md:min-h-[auto]",
        isMobileDragging && "opacity-50 scale-95",
        className
    )}
    {...props}>
    <div
        className="flex items-center justify-center w-10 h-10 md:w-8 md:h-8 bg-primary-100 dark:bg-primary-900/30 rounded-md">
        <span
            className="text-sm font-medium text-gray-700 group-hover:text-primary-700 transition-colors duration-200">
            {label}
        </span>
    </div></div>
  );
};

export default FieldTypeButton;