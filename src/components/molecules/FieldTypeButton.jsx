import React from "react";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const FieldTypeButton = ({ 
  type, 
  icon, 
  label, 
  onDragStart, 
  className = "" 
}) => {
  const handleDragStart = (e) => {
    e.dataTransfer.setData("text/plain", type);
    if (onDragStart) {
      onDragStart(type);
    }
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      className={cn(
        "flex items-center space-x-3 p-4 bg-white rounded-lg border-2 border-gray-200 cursor-move hover:border-primary-300 hover:bg-primary-50 transition-all duration-200 transform hover:scale-102 hover:shadow-lg group",
        className
      )}
    >
      <div className="w-8 h-8 rounded-md bg-gradient-to-br from-primary-100 to-secondary-100 flex items-center justify-center group-hover:from-primary-200 group-hover:to-secondary-200 transition-all duration-200">
        <ApperIcon name={icon} className="w-5 h-5 text-primary-600" />
      </div>
      <span className="text-sm font-medium text-gray-700 group-hover:text-primary-700 transition-colors duration-200">
        {label}
      </span>
    </div>
  );
};

export default FieldTypeButton;