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
  const [editingProperty, setEditingProperty] = useState(null);

  const handleDragStart = (e) => {
    e.dataTransfer.setData("application/json", JSON.stringify({ field, sourceIndex: index }));
    if (onDragStart) {
      onDragStart(field, index);
    }
  };

  const handlePropertyEdit = (property, value) => {
    onUpdate(field.id, { [property]: value });
    setEditingProperty(null);
  };

  const renderFieldInput = () => {
    const baseInputClasses = "w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500";
    
    switch (field.type) {
      case "text":
        return (
          <input
            type="text"
            placeholder={field.placeholder || "Enter text..."}
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
      case "dropdown":
        return (
          <select className={baseInputClasses} disabled>
            <option>{field.options?.[0] || "Select an option..."}</option>
            {field.options?.slice(1).map((option, idx) => (
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
      onClick={() => onSelect(field.id)}
      className={cn(
        "field-item relative p-4 bg-white rounded-lg border-2 border-gray-200 cursor-move hover:border-primary-300 transition-all duration-200 group",
        isSelected && "field-selected",
        className
      )}
    >
      {/* Field Label */}
      <div className="mb-2">
        {editingProperty === "label" ? (
          <InlineEditor
            value={field.label}
            onSave={(value) => handlePropertyEdit("label", value)}
            onCancel={() => setEditingProperty(null)}
            placeholder="Field label..."
          />
        ) : (
          <label
            className="block text-sm font-medium text-gray-700 cursor-pointer hover:text-primary-600 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              setEditingProperty("label");
            }}
          >
            {field.label || "Click to add label"}
            <ApperIcon name="Edit2" className="w-3 h-3 ml-1 inline opacity-0 group-hover:opacity-100 transition-opacity" />
          </label>
        )}
      </div>

      {/* Field Input */}
      <div className="mb-2">
        {renderFieldInput()}
      </div>

      {/* Placeholder Editor */}
      {(field.type === "text" || field.type === "email") && (
        <div className="text-xs text-gray-500">
          {editingProperty === "placeholder" ? (
            <InlineEditor
              value={field.placeholder}
              onSave={(value) => handlePropertyEdit("placeholder", value)}
              onCancel={() => setEditingProperty(null)}
              placeholder="Placeholder text..."
            />
          ) : (
            <span
              className="cursor-pointer hover:text-primary-600 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                setEditingProperty("placeholder");
              }}
            >
              Placeholder: {field.placeholder || "Click to edit"}
              <ApperIcon name="Edit2" className="w-3 h-3 ml-1 inline opacity-0 group-hover:opacity-100 transition-opacity" />
            </span>
          )}
        </div>
      )}

      {/* Options Editor for Dropdown */}
      {field.type === "dropdown" && (
        <div className="mt-2 text-xs text-gray-500">
          <div>Options: {field.options?.join(", ") || "No options set"}</div>
        </div>
      )}

      {/* Delete Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete(field.id);
        }}
        className="absolute top-2 right-2 w-6 h-6 bg-accent-500 text-white rounded-full opacity-0 group-hover:opacity-100 hover:bg-accent-600 transition-all duration-200 flex items-center justify-center"
      >
        <ApperIcon name="X" className="w-3 h-3" />
      </button>
    </div>
  );
};

export default FormField;