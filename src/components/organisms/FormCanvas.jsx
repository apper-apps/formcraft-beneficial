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
        dragOverIndex === index && "h-8 md:h-8 bg-primary-500/10 border-2 border-dashed border-primary-500 rounded-md scale-105 shadow-lg shadow-primary-500/20",
        isMobileDragging && dragOverIndex === index && "h-12 bg-primary-500/20 border-primary-400 shadow-xl shadow-primary-500/30"
      )}
    />
  );

if (fields.length === 0) {
    return (
      <div
className="w-full h-full bg-gradient-to-br from-white via-gray-50 to-white dark:from-dark-900/90 dark:via-dark-800/95 dark:to-dark-900/90 rounded-2xl shadow-2xl dark:shadow-primary-500/20 border-2 border-dashed border-gray-300 dark:border-primary-500/40 hover:border-primary-500 dark:hover:border-primary-400 hover:shadow-3xl dark:hover:shadow-primary-500/30 hover:scale-[1.01] transition-all duration-500 ease-out drop-zone touch-manipulation backdrop-blur-sm" 
style={{ 
  backgroundImage: 'linear-gradient(rgba(59, 130, 246, 0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(59, 130, 246, 0.02) 1px, transparent 1px)',
  backgroundSize: '40px 40px'
}}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
>
        <div className="flex flex-col items-center justify-center h-full text-center p-8">
          {/* Hero Section */}
          <div className="mb-10">
<div className="w-28 h-28 mb-6 rounded-full bg-gradient-to-br from-primary-100 via-primary-200 to-primary-300 dark:from-primary-500/20 dark:via-primary-400/30 dark:to-primary-600/40 flex items-center justify-center animate-pulse-glow mx-auto shadow-2xl dark:shadow-primary-500/30 border border-white dark:border-primary-400/20 backdrop-filter dark:backdrop-blur-lg">
              <ApperIcon name="Zap" className="w-14 h-14 text-primary-600 dark:text-white" />
            </div>
            <h3 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-gray-100 dark:to-white bg-clip-text text-transparent mb-4">
              Create Your Perfect Form
            </h3>
            <p className="text-gray-600 dark:text-gray-200 max-w-lg mb-8 leading-relaxed text-lg font-medium">
              Start with a professional template or build from scratch. Drag & drop fields, customize everything, and create forms that convert.
            </p>
          </div>

          {/* Template Gallery */}
          {formTemplates && formTemplates.length > 0 && (
            <div className="w-full max-w-4xl mb-10">
<div className="flex items-center justify-center mb-8">
<div className="flex items-center space-x-3 bg-gradient-to-r from-primary-50 to-primary-100 dark:from-primary-500/10 dark:to-primary-400/20 px-6 py-3 rounded-full border border-primary-200 dark:border-primary-400/30 shadow-lg dark:shadow-primary-500/20 backdrop-filter dark:backdrop-blur-lg">
                  <ApperIcon name="Sparkles" className="w-5 h-5 text-primary-600 dark:text-white" />
                  <h4 className="text-lg font-bold text-primary-800 dark:text-white">
                    Quick Start Templates
                  </h4>
                  <ApperIcon name="Sparkles" className="w-5 h-5 text-yellow-500 dark:text-amber-300" />
                </div>
              </div>
              
<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10 justify-items-center max-w-4xl mx-auto">
                {formTemplates.slice(0, 4).map((template, index) => (
<div
className="w-full max-w-sm bg-gradient-to-br from-white via-gray-50 to-white dark:from-dark-900/60 dark:via-dark-800/80 dark:to-dark-900/60 rounded-xl border border-gray-200 dark:border-primary-500/20 p-6 hover:shadow-2xl dark:hover:shadow-primary-500/20 transition-all duration-500 hover:scale-105 hover:-translate-y-2 cursor-pointer group backdrop-filter dark:backdrop-blur-lg shadow-lg dark:shadow-primary-500/10 dark:hover:border-primary-400/50 dark:hover:shadow-primary-500/30" 
style={{ 
  background: 'rgba(20, 20, 32, 0.6)', 
  backdropFilter: 'blur(10px)' 
}}
                    className="w-full max-w-sm bg-gradient-to-br from-white via-gray-50 to-white dark:from-primary-600/20 dark:via-dark-900/95 dark:to-primary-700/25 rounded-xl border border-gray-200 dark:border-primary-500/40 p-6 hover:shadow-2xl dark:hover:shadow-primary-500/30 transition-all duration-500 hover:scale-105 hover:-translate-y-2 cursor-pointer group backdrop-blur-sm shadow-lg dark:shadow-primary-600/10"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
<h5 className="font-bold text-xl text-gray-900 dark:text-white mb-3 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                          {template.title}
                        </h5>
                        <p className="text-sm text-gray-600 dark:text-gray-200 mb-4 line-clamp-2 leading-relaxed font-medium">
                          {template.description}
                        </p>
                        <div className="flex items-center space-x-3 text-xs text-gray-500 dark:text-gray-300">
                          <span className="flex items-center bg-gray-100 dark:bg-primary-700/40 px-3 py-1.5 rounded-md border dark:border-primary-600/40 font-medium">
                            <ApperIcon name="FileText" className="w-3 h-3 mr-1.5" />
                            {template.fields?.length || 0} fields
                          </span>
                          <span className="flex items-center bg-primary-100 dark:bg-primary-600/40 px-3 py-1.5 rounded-md text-primary-700 dark:text-primary-200 border dark:border-primary-500/40 font-medium">
                            <ApperIcon name="Clock" className="w-3 h-3 mr-1.5" />
                            2 min setup
                          </span>
                        </div>
                      </div>
                    </div>
                    
<button
                      onClick={() => onUseTemplate(template)}
                      className="w-full bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl hover:shadow-primary-500/30 transform hover:-translate-y-0.5 active:translate-y-0 border border-primary-400/30 backdrop-filter backdrop-blur-lg"
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
<div className="flex items-center w-full max-w-md mb-10">
<div className="flex-1 border-t-2 border-gray-200 dark:border-primary-500/30"></div>
            <span className="px-6 text-sm font-bold text-gray-500 dark:text-gray-200 bg-gradient-to-r from-gray-100 to-gray-50 dark:from-primary-500/20 dark:to-primary-400/30 py-2 rounded-full border border-gray-200 dark:border-primary-500/30 shadow-md backdrop-filter dark:backdrop-blur-lg">OR</span>
            <div className="flex-1 border-t-2 border-gray-200 dark:border-primary-600/40"></div>
          </div>

{/* Build From Scratch */}
<div className="bg-gradient-to-br from-primary-50 via-white to-primary-100 dark:from-dark-900/50 dark:via-dark-800/70 dark:to-dark-900/50 rounded-2xl p-8 max-w-lg shadow-xl dark:shadow-primary-500/20 border border-primary-200 dark:border-primary-500/30 backdrop-filter dark:backdrop-blur-lg">
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-600/40 dark:to-primary-700/50 rounded-full flex items-center justify-center shadow-lg dark:shadow-primary-600/40">
                <ApperIcon name="Hammer" className="w-8 h-8 text-primary-600 dark:text-white" />
              </div>
            </div>
            <h4 className="text-2xl font-bold text-gray-800 dark:text-white mb-4 text-center">
              Build From Scratch
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-200 mb-6 text-center leading-relaxed font-medium">
              Drag field types from the left panel to start building your custom form
            </p>
            
            <div className="bg-white dark:bg-primary-900/30 rounded-xl p-5 border border-gray-200 dark:border-primary-600/30 shadow-inner">
              <h5 className="text-sm font-bold text-gray-700 dark:text-white mb-3 flex items-center">
                <ApperIcon name="Lightbulb" className="w-4 h-4 mr-2 text-primary-500 dark:text-primary-400" />
                Pro Tips
              </h5>
              <ul className="text-xs text-gray-600 dark:text-gray-200 space-y-2 font-medium">
                <li className="flex items-start bg-gray-50 dark:bg-primary-700/30 p-2 rounded-lg border dark:border-primary-600/30">
                  <ApperIcon name="ChevronRight" className="w-3 h-3 mt-0.5 mr-2 text-primary-500 dark:text-primary-400 flex-shrink-0" />
                  <span>Drag field types to this canvas area</span>
                </li>
                <li className="flex items-start bg-gray-50 dark:bg-primary-700/30 p-2 rounded-lg border dark:border-primary-600/30">
                  <ApperIcon name="ChevronRight" className="w-3 h-3 mt-0.5 mr-2 text-primary-500 dark:text-primary-400 flex-shrink-0" />
                  <span>Click any field to customize properties</span>
                </li>
                <li className="flex items-start bg-gray-50 dark:bg-primary-700/30 p-2 rounded-lg border dark:border-primary-600/30">
                  <ApperIcon name="ChevronRight" className="w-3 h-3 mt-0.5 mr-2 text-primary-500 dark:text-primary-400 flex-shrink-0" />
                  <span>Reorder by dragging fields up or down</span>
                </li>
                <li className="flex items-start bg-gray-50 dark:bg-primary-700/30 p-2 rounded-lg border dark:border-primary-600/30">
                  <ApperIcon name="ChevronRight" className="w-3 h-3 mt-0.5 mr-2 text-primary-500 dark:text-primary-400 flex-shrink-0" />
                  <span>Preview anytime with the preview button</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="mt-10 flex items-center space-x-3 text-sm bg-gradient-to-r from-primary-50 to-primary-100 dark:from-primary-600/30 dark:to-primary-700/40 px-4 py-2 rounded-full border border-primary-200 dark:border-primary-500/40 shadow-md">
            <div className="w-2.5 h-2.5 bg-primary-500 dark:bg-primary-400 rounded-full animate-pulse"></div>
            <span className="font-bold text-primary-600 dark:text-white">Ready for your creativity</span>
          </div>
        </div>
      </div>
    );
  }

return (
<div
className="w-full h-full bg-gradient-to-br from-white via-gray-50 to-white dark:from-dark-900/80 dark:via-dark-800/90 dark:to-dark-900/80 rounded-2xl shadow-2xl dark:shadow-primary-500/30 border border-gray-200 dark:border-primary-500/30 p-6 md:p-8 drop-zone custom-scrollbar overflow-y-auto transition-all duration-300 ease-out touch-manipulation hover:shadow-3xl dark:hover:shadow-primary-500/40 backdrop-filter dark:backdrop-blur-lg"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="mb-6">
<div className="flex items-center justify-between mb-2">
<h2 className="text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-700 dark:from-primary-300 dark:to-primary-100 bg-clip-text text-transparent">Form Canvas</h2>
          <div className="flex items-center space-x-2 text-sm">
            <div className="px-3 py-1.5 bg-green-100 dark:bg-green-600/40 text-green-700 dark:text-green-200 rounded-full text-xs font-bold border dark:border-green-500/40 shadow-sm">
              {fields.length} field{fields.length !== 1 ? "s" : ""}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-200 font-medium">
              Live Preview
            </div>
          </div>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-200 font-medium">
          Click any field to edit its properties • Drag to reorder • Drop new fields anywhere
        </p>
      </div>

<div className="space-y-4">
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