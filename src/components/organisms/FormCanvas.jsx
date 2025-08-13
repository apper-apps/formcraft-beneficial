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
  onUseTemplate,
  onBuildFromScratch
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
<div className="w-full max-w-[800px] mx-auto p-10">
<div
className="w-full h-full bg-[var(--bg-card)] rounded-2xl shadow-2xl border-2 border-dashed border-[var(--border-primary)] hover:border-[var(--border-hover)] hover:shadow-3xl hover:scale-[1.01] transition-all duration-500 ease-out drop-zone touch-manipulation backdrop-filter backdrop-blur-sm relative z-1" 
style={{ 
  backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px)',
  backgroundSize: '40px 40px',
  minHeight: '400px'
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
              Start Building Your Form
            </h3>
            <p className="text-gray-600 dark:text-gray-200 max-w-lg mb-8 leading-relaxed text-lg font-medium">
              Drag fields from the left panel to start building your form
            </p>
          </div>

{/* Build From Scratch Card */}
<div 
  className="build-from-scratch-card bg-gradient-to-br from-[rgba(59,130,246,0.1)] to-[rgba(147,51,234,0.1)] border-2 border-dashed border-[rgba(59,130,246,0.3)] rounded-2xl p-10 max-w-lg shadow-xl backdrop-filter backdrop-blur-sm cursor-pointer hover:border-[rgba(59,130,246,0.6)] hover:bg-gradient-to-br hover:from-[rgba(59,130,246,0.2)] hover:to-[rgba(147,51,234,0.2)] hover:scale-105 transition-all duration-300 ease-out min-h-[200px] flex flex-col items-center justify-center text-center"
  onClick={onBuildFromScratch}
  role="button"
  tabIndex={0}
  onKeyDown={(e) => e.key === 'Enter' && onBuildFromScratch()}
>
            <div className="icon-wrapper mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-[rgba(59,130,246,0.2)] to-[rgba(147,51,234,0.2)] rounded-full flex items-center justify-center shadow-lg backdrop-filter backdrop-blur-sm border border-[rgba(59,130,246,0.3)]">
                <ApperIcon name="Hammer" className="w-8 h-8 text-[var(--accent-blue)]" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              Build From Scratch
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Drag field types from the left panel to start building your custom form
            </p>
          </div>
          
          <div className="mt-10 flex items-center space-x-3 text-sm bg-gradient-to-r from-primary-50 to-primary-100 dark:from-primary-600/30 dark:to-primary-700/40 px-4 py-2 rounded-full border border-primary-200 dark:border-primary-500/40 shadow-md">
            <div className="w-2.5 h-2.5 bg-primary-500 dark:bg-primary-400 rounded-full animate-pulse"></div>
            <span className="font-bold text-primary-600 dark:text-white">Ready for your creativity</span>
          </div>
        </div>
      </div>
      </div>
    );
  }

return (
<div className="w-full max-w-[800px] mx-auto p-10">
<div
className="w-full h-full bg-[var(--bg-card)] rounded-2xl shadow-2xl border border-[var(--border-primary)] p-6 md:p-8 drop-zone custom-scrollbar overflow-y-auto transition-all duration-300 ease-out touch-manipulation hover:shadow-3xl backdrop-filter backdrop-blur-lg relative z-1"
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
    </div>
  );
};

export default FormCanvas;