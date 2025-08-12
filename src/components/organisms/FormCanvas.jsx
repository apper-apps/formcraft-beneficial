import React, { useState } from "react";
import ApperIcon from "@/components/ApperIcon";
import FormPreview from "@/components/organisms/FormPreview";
import FormField from "@/components/molecules/FormField";
import { cn } from "@/utils/cn";

const FormCanvas = ({ 
  fields, 
  selectedFieldId, 
  onFieldSelect, 
  onFieldUpdate, 
  onFieldDelete, 
  onFieldAdd, 
  onFieldReorder,
  formSettings,
  selectedTheme
}) => {
  const [dragOverIndex, setDragOverIndex] = useState(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    const rect = e.currentTarget.getBoundingClientRect();
    const y = e.clientY - rect.top;
    const fieldHeight = 120; // Approximate field height
    const index = Math.floor(y / fieldHeight);
    setDragOverIndex(Math.min(index, fields.length));
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOverIndex(null);

    try {
      // Try to parse as existing field (reorder)
      const data = JSON.parse(e.dataTransfer.getData("application/json"));
      if (data.field && typeof data.sourceIndex === "number") {
        const targetIndex = dragOverIndex !== null ? dragOverIndex : fields.length;
        onFieldReorder(data.sourceIndex, targetIndex);
        return;
      }
    } catch {
      // If parsing fails, treat as new field
    }

    // Handle new field from toolbar
    const fieldType = e.dataTransfer.getData("text/plain");
    if (fieldType) {
      const newField = createNewField(fieldType);
      const targetIndex = dragOverIndex !== null ? dragOverIndex : fields.length;
      onFieldAdd(newField, targetIndex);
    }
  };

  const createNewField = (type) => {
    const id = Date.now().toString();
    const baseField = {
      id,
      type,
      label: `${type.charAt(0).toUpperCase() + type.slice(1)} Field`,
      required: false
    };

    switch (type) {
      case "text":
        return { ...baseField, placeholder: "Enter text here..." };
      case "email":
        return { ...baseField, placeholder: "Enter email address..." };
      case "dropdown":
        return { ...baseField, options: ["Option 1", "Option 2", "Option 3"] };
      default:
        return baseField;
    }
  };

  const renderDropZone = (index) => (
    <div
      key={`drop-zone-${index}`}
      className={cn(
        "drop-zone h-2 transition-all duration-200",
        dragOverIndex === index && "h-8 bg-primary-100 border-2 border-dashed border-primary-300 rounded-md"
      )}
    />
  );

  if (fields.length === 0) {
    return (
<div
        className="w-full h-full bg-white dark:bg-gray-800 rounded-lg shadow-lg border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-primary-400 dark:hover:border-primary-400 transition-all duration-200 drop-zone"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center justify-center h-full text-center p-8">
          <div className="w-16 h-16 mb-4 rounded-full bg-gradient-to-br from-primary-100 dark:from-primary-900/50 to-secondary-100 dark:to-secondary-900/50 flex items-center justify-center">
            <ApperIcon name="MousePointer2" className="w-8 h-8 text-primary-500 dark:text-primary-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-2">
            Drag fields here to start building
          </h3>
          <p className="text-gray-500 dark:text-gray-400 max-w-md">
            Select field types from the toolbar on the left and drag them to this canvas to create your form.
          </p>
          <div className="mt-6 flex items-center space-x-2 text-sm text-gray-400 dark:text-gray-500">
            <div className="w-2 h-2 bg-primary-400 rounded-full animate-pulse"></div>
            <span>Ready to accept fields</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
className="w-full h-full bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6 drop-zone custom-scrollbar overflow-y-auto transition-colors duration-200"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="mb-6">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Form Builder</h2>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          {fields.length} field{fields.length !== 1 ? "s" : ""} • Click to edit, drag to reorder
        </p>
      </div>

      <div className="space-y-1">
        {renderDropZone(0)}
        {fields.map((field, index) => (
          <React.Fragment key={field.id}>
            <FormField
              field={field}
              index={index}
              isSelected={selectedFieldId === field.id}
              onSelect={onFieldSelect}
              onUpdate={onFieldUpdate}
              onDelete={onFieldDelete}
            />
            {renderDropZone(index + 1)}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default FormCanvas;