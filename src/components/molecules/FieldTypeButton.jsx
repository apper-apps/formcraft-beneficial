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
  isCollapsed,
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
      "field-type-item w-full p-3 px-4 mb-2 bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.08)] rounded-lg cursor-grab transition-all duration-300 flex items-center gap-3",
      "hover:bg-[rgba(59,130,246,0.1)] hover:border-[rgba(59,130,246,0.3)] hover:transform hover:translate-x-1",
      "active:cursor-grabbing select-none touch-manipulation",
      isMobileDragging && "opacity-50 scale-95",
      className
    )}
    {...props}>
<div className="flex items-center justify-center w-8 h-8 bg-[rgba(59,130,246,0.2)] rounded-md border border-[rgba(59,130,246,0.3)] backdrop-blur-sm">
        <ApperIcon 
          name={icon} 
          size={16} 
          className="text-blue-300" 
        />
      </div>
      <span className="text-sm font-medium text-gray-200 group-hover:text-blue-300 transition-colors duration-200">
        {label}
      </span>
    </div>
  );
};

export default FieldTypeButton;