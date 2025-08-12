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
  selectedTheme,
  isMobileDragging,
  draggedField
}) => {
const [dragOverIndex, setDragOverIndex] = useState(null);
  const [touchPosition, setTouchPosition] = useState(null);

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

  const handleTouchMove = (e) => {
    if (!isMobileDragging) return;
    e.preventDefault();
    
    const touch = e.touches[0];
    const rect = e.currentTarget.getBoundingClientRect();
    const y = touch.clientY - rect.top;
    const fieldHeight = 120;
    const index = Math.floor(y / fieldHeight);
    setDragOverIndex(Math.min(Math.max(0, index), fields.length));
    setTouchPosition({ x: touch.clientX, y: touch.clientY });
  };

  const handleTouchEnd = (e) => {
    if (!isMobileDragging || !draggedField) return;
    
    const targetIndex = dragOverIndex !== null ? dragOverIndex : fields.length;
    const newField = createNewField(draggedField);
    onFieldAdd(newField, targetIndex);
    
    setDragOverIndex(null);
    setTouchPosition(null);
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
        "drop-zone h-2 md:h-2 transition-all duration-200",
        dragOverIndex === index && "h-8 md:h-8 bg-primary-100 border-2 border-dashed border-primary-300 rounded-md",
        isMobileDragging && dragOverIndex === index && "h-12 bg-primary-200 border-primary-400"
      )}
    />
  );

  if (fields.length === 0) {
    return (
<div
        className="w-full h-full bg-white dark:bg-gray-800 rounded-lg shadow-lg border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-primary-400 dark:hover:border-primary-400 transition-all duration-200 drop-zone touch-manipulation"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
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
className="w-full h-full bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-4 md:p-6 drop-zone custom-scrollbar overflow-y-auto transition-colors duration-200 touch-manipulation"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="mb-6">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Form Builder</h2>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          {fields.length} field{fields.length !== 1 ? "s" : ""} • Click to edit, drag to reorder
        </p>
      </div>

<div className="space-y-2 md:space-y-1">
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
              isMobile={window.innerWidth < 768}
            />
            {renderDropZone(index + 1)}
          </React.Fragment>
        ))}
      </div>
      
      {/* Mobile drag indicator */}
      {isMobileDragging && touchPosition && (
        <div
          className="fixed pointer-events-none z-50 bg-primary-500 text-white px-3 py-2 rounded-lg shadow-lg text-sm font-medium"
          style={{
            left: touchPosition.x - 50,
            top: touchPosition.y - 30,
          }}
        >
          Drop here
        </div>
      )}
    </div>
  );
};

export default FormCanvas;