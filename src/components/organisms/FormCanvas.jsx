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
  draggedField,
  formTemplates,
  onUseTemplate
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
      required: false
    };

    switch (type) {
      case "text":
        return { 
          ...baseField, 
          label: "Full Name",
          placeholder: "Enter your full name..." 
        };
      case "email":
        return { 
          ...baseField, 
          label: "Email Address",
          placeholder: "your.email@example.com" 
        };
      case "phone":
        return { 
          ...baseField, 
          label: "Phone Number",
          placeholder: "(555) 123-4567" 
        };
      case "textarea":
        return { 
          ...baseField, 
          label: "Additional Comments",
          placeholder: "Please share any additional details or questions you may have...",
          rows: 4
        };
      case "dropdown":
        return { 
          ...baseField, 
          label: "How did you hear about us?",
          options: ["Google Search", "Social Media", "Word of Mouth", "Advertisement", "Other"] 
        };
      case "number":
        return { 
          ...baseField, 
          label: "Age",
          placeholder: "Enter your age" 
        };
      case "url":
        return { 
          ...baseField, 
          label: "Website",
          placeholder: "https://your-website.com" 
        };
      case "file":
        return { 
          ...baseField, 
          label: "Upload Document",
          accept: ".pdf,.doc,.docx,.txt"
        };
      case "multiselect":
        return { 
          ...baseField, 
          label: "Areas of Interest",
          options: ["Technology", "Business", "Design", "Marketing", "Education"] 
        };
      default:
        return { 
          ...baseField, 
          label: `${type.charAt(0).toUpperCase() + type.slice(1)} Field`,
          placeholder: `Enter ${type} here...`
        };
    }
  };

const renderDropZone = (index) => (
<div
      key={`drop-zone-${index}`}
      className={cn(
        "drop-zone h-2 md:h-2 transition-all duration-300 ease-out",
        dragOverIndex === index && "h-8 md:h-8 bg-primary-100 border-2 border-dashed border-primary-300 rounded-md scale-105 shadow-lg",
        isMobileDragging && dragOverIndex === index && "h-12 bg-primary-200 border-primary-400 shadow-xl"
      )}
    />
  );

if (fields.length === 0) {
    return (
      <div
        className="w-full h-full bg-white dark:bg-gray-800 rounded-lg shadow-lg border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-primary-400 dark:hover:border-primary-400 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 ease-out drop-zone touch-manipulation"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="flex flex-col items-center justify-center h-full text-center p-8">
          {/* Hero Section */}
          <div className="mb-8">
            <div className="w-24 h-24 mb-6 rounded-full bg-gradient-to-br from-primary-100 dark:from-primary-900/50 to-secondary-100 dark:to-secondary-900/50 flex items-center justify-center animate-pulse-glow mx-auto">
              <ApperIcon name="Zap" className="w-12 h-12 text-primary-500 dark:text-primary-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
              Create Your Perfect Form
            </h3>
            <p className="text-gray-600 dark:text-gray-300 max-w-lg mb-8 leading-relaxed text-lg">
              Start with a professional template or build from scratch. Drag & drop fields, customize everything, and create forms that convert.
            </p>
          </div>

          {/* Template Gallery */}
          {formTemplates && formTemplates.length > 0 && (
            <div className="w-full max-w-4xl mb-8">
              <div className="flex items-center justify-center mb-6">
                <div className="flex items-center space-x-3">
                  <ApperIcon name="Sparkles" className="w-5 h-5 text-yellow-500" />
                  <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                    Quick Start Templates
                  </h4>
                  <ApperIcon name="Sparkles" className="w-5 h-5 text-yellow-500" />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {formTemplates.slice(0, 4).map((template, index) => (
                  <div
                    key={template.Id}
                    className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-700 dark:to-gray-800 rounded-lg border border-gray-200 dark:border-gray-600 p-6 hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer group"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h5 className="font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                          {template.title}
                        </h5>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
                          {template.description}
                        </p>
                        <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                          <span className="flex items-center">
                            <ApperIcon name="FileText" className="w-3 h-3 mr-1" />
                            {template.fields?.length || 0} fields
                          </span>
                          <span className="flex items-center">
                            <ApperIcon name="Clock" className="w-3 h-3 mr-1" />
                            2 min setup
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => onUseTemplate(template)}
                      className="w-full bg-primary-500 hover:bg-primary-600 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200 flex items-center justify-center space-x-2 group-hover:bg-primary-600"
                    >
                      <ApperIcon name="Download" className="w-4 h-4" />
                      <span>Use Template</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Divider */}
          <div className="flex items-center w-full max-w-md mb-8">
            <div className="flex-1 border-t border-gray-300 dark:border-gray-600"></div>
            <span className="px-4 text-sm font-medium text-gray-500 dark:text-gray-400">OR</span>
            <div className="flex-1 border-t border-gray-300 dark:border-gray-600"></div>
          </div>

          {/* Build From Scratch */}
          <div className="bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20 rounded-xl p-6 max-w-lg">
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/50 rounded-full flex items-center justify-center">
                <ApperIcon name="Hammer" className="w-6 h-6 text-primary-600 dark:text-primary-400" />
              </div>
            </div>
            <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3 text-center">
              Build From Scratch
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 text-center">
              Drag field types from the left panel to start building your custom form
            </p>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
              <h5 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2 flex items-center">
                <ApperIcon name="Lightbulb" className="w-4 h-4 mr-2 text-yellow-500" />
                Pro Tips
              </h5>
              <ul className="text-xs text-gray-600 dark:text-gray-300 space-y-1.5">
                <li className="flex items-start">
                  <ApperIcon name="ChevronRight" className="w-3 h-3 mt-0.5 mr-2 text-primary-500" />
                  Drag field types to this canvas area
                </li>
                <li className="flex items-start">
                  <ApperIcon name="ChevronRight" className="w-3 h-3 mt-0.5 mr-2 text-primary-500" />
                  Click any field to customize properties
                </li>
                <li className="flex items-start">
                  <ApperIcon name="ChevronRight" className="w-3 h-3 mt-0.5 mr-2 text-primary-500" />
                  Reorder by dragging fields up or down
                </li>
                <li className="flex items-start">
                  <ApperIcon name="ChevronRight" className="w-3 h-3 mt-0.5 mr-2 text-primary-500" />
                  Preview anytime with the preview button
                </li>
              </ul>
            </div>
          </div>
          
          <div className="mt-8 flex items-center space-x-2 text-sm text-primary-500 dark:text-primary-400">
            <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse"></div>
            <span className="font-medium">Ready for your creativity</span>
          </div>
        </div>
      </div>
    );
  }

return (
    <div
      className="w-full h-full bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-4 md:p-6 drop-zone custom-scrollbar overflow-y-auto transition-all duration-300 ease-out touch-manipulation hover:shadow-xl"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Form Canvas</h2>
          <div className="flex items-center space-x-2 text-sm">
            <div className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-xs font-medium">
              {fields.length} field{fields.length !== 1 ? "s" : ""}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Live Preview
            </div>
          </div>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Click any field to edit its properties • Drag to reorder • Drop new fields anywhere
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
              className="animate-slide-up"
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