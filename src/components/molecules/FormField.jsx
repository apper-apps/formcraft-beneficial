import React, { useState } from "react";
import ApperIcon from "@/components/ApperIcon";
import InlineEditor from "./InlineEditor";
import { cn } from "@/utils/cn";

const FormField = ({ 
  field, 
  index, 
  isSelected, 
  onSelect, 
  onUpdate, 
  onDelete, 
  onDragStart,
  className = "" 
}) => {
const handleDragStart = (e) => {
    e.dataTransfer.setData("application/json", JSON.stringify({ field, sourceIndex: index }));
    e.currentTarget.classList.add('dragging');
    if (onDragStart) {
      onDragStart(field, index);
    }
  };

  const handleDragEnd = (e) => {
    e.currentTarget.classList.remove('dragging');
  };

const renderFieldInput = () => {
    const baseInputClasses = "w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500";
    
switch (field.type) {
      case "text":
        return (
          <input
            type="text"
            placeholder={field.placeholder || "Enter your response here..."}
            className={baseInputClasses}
            disabled
          />
        );
      case "email":
        return (
          <input
            type="email"
            placeholder={field.placeholder || "Enter email address..."}
            className={baseInputClasses}
            disabled
          />
        );
      case "textarea":
        return (
          <textarea
            placeholder={field.placeholder || "Enter your text here..."}
            rows={field.rows || 3}
            className={`${baseInputClasses} resize-none`}
            disabled
          />
        );
      case "number":
        return (
          <input
            type="number"
            placeholder={field.placeholder || "Enter a number..."}
            min={field.min}
            max={field.max}
            step={field.step || 1}
            className={baseInputClasses}
            disabled
          />
        );
      case "url":
        return (
          <input
            type="url"
            placeholder={field.placeholder || "https://example.com"}
            className={baseInputClasses}
            disabled
          />
        );
case "file":
        return (
          <div className="space-y-2">
            <input
              type="file"
              accept={field.accept}
              multiple={field.multiple}
              className={`${baseInputClasses} file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100`}
              disabled
            />
            {field.maxSize && (
              <p className="text-xs text-gray-500">Maximum file size: {field.maxSize}MB per file</p>
            )}
            {field.accept && (
              <p className="text-xs text-gray-500">Accepted types: {field.accept}</p>
            )}
          </div>
        );
      case "dropdown":
        return (
          <select className={baseInputClasses} disabled>
            <option>{field.options?.[0] || "Select an option..."}</option>
            {field.options?.slice(1).map((option, idx) => (
              <option key={idx}>{option}</option>
            ))}
          </select>
        );
      case "multiselect":
        return (
          <select 
            className={baseInputClasses} 
            multiple 
            size="3"
            disabled
          >
            {field.options?.map((option, idx) => (
              <option key={idx}>{option}</option>
            ))}
          </select>
        );
      default:
        return null;
    }
  };

  return (
<div
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onClick={() => onSelect(field.id)}
      className={cn(
"field-item relative p-4 bg-white dark:bg-purple-800/30 rounded-lg border-2 border-gray-200 dark:border-purple-600/50 cursor-move hover:border-primary-300 dark:hover:border-purple-400 hover:shadow-lg dark:hover:shadow-purple-500/25 hover:scale-[1.02] transition-all duration-300 ease-out group",
        isSelected && "field-selected",
        className
      )}
    >
{/* Field Label */}
<div className="mb-2">
<label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
          {field.label || `${field.type.charAt(0).toUpperCase() + field.type.slice(1)} Field`}
          {field.required && <span className="text-accent-500 ml-1">*</span>}
        </label>
      </div>

      {/* Field Input */}
      <div className="mb-2">
        {renderFieldInput()}
      </div>

      {/* Field Description */}
      {field.description && (
        <div className="text-xs text-gray-500 mb-2">
          {field.description}
        </div>
      )}

{/* Field Type Indicator */}
      <div className="absolute top-2 left-2 px-2 py-1 bg-primary-100 text-primary-700 text-xs font-medium rounded opacity-0 group-hover:opacity-100 transition-opacity">
        {field.type}
      </div>

      {/* Configuration Indicator */}
      {isSelected && (
        <div className="absolute top-2 right-8 px-2 py-1 bg-primary-500 text-white text-xs font-medium rounded">
          Configuring
        </div>
      )}

      {/* Delete Button */}
<button
        onClick={(e) => {
          e.stopPropagation();
          onDelete(field.id);
        }}
        className="absolute top-2 right-2 w-6 h-6 bg-accent-500 text-white rounded-full opacity-0 group-hover:opacity-100 hover:bg-accent-600 hover:scale-110 transition-all duration-300 ease-out flex items-center justify-center shadow-lg"
      >
        <ApperIcon name="X" className="w-3 h-3" />
      </button>
    </div>
  );
};

export default FormField;