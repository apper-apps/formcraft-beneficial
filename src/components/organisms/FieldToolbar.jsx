import React, { useState } from "react";
import FieldTypeButton from "@/components/molecules/FieldTypeButton";
import ApperIcon from "@/components/ApperIcon";

const FieldToolbar = ({ onDragStart }) => {
const fieldTypes = [
    { type: "text", icon: "Type", label: "Text Input" },
    { type: "email", icon: "Mail", label: "Email" },
    { type: "dropdown", icon: "ChevronDown", label: "Dropdown" },
    { type: "textarea", icon: "FileText", label: "Textarea" },
    { type: "file", icon: "Upload", label: "File Upload" },
    { type: "number", icon: "Hash", label: "Number Input" },
    { type: "url", icon: "Link", label: "URL Input" },
    { type: "multiselect", icon: "List", label: "Multi-Select" }
  ];
const [isCollapsed, setIsCollapsed] = useState(false);

  return (
<div className={`field-types-sidebar fixed left-0 top-0 h-screen bg-[var(--bg-secondary)] backdrop-blur-[10px] border-r border-[var(--border-primary)] overflow-y-auto z-40 custom-scrollbar pt-20 transition-all duration-300 ${isCollapsed ? 'w-15' : 'w-60'}`}>
      {/* Collapse/Expand Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute top-24 -right-3 w-6 h-6 bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-full flex items-center justify-center hover:bg-[var(--accent-blue)] transition-all duration-300 z-50"
      >
        <ApperIcon 
          name={isCollapsed ? "ChevronRight" : "ChevronLeft"} 
          className="w-3 h-3 text-white" 
        />
      </button>

      <div className="p-5">
        {!isCollapsed && (
          <div className="mb-6">
            <h2 className="text-lg font-bold text-white mb-2 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Field Types
            </h2>
            <p className="text-sm text-gray-300">
              Drag field types to the canvas to add them to your form
            </p>
          </div>
        )}

        <div className="space-y-2">
          {fieldTypes.map((fieldType, index) => (
            <div
              key={fieldType.type}
              className="animate-slide-up group"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className={`transition-all duration-300 hover:translate-x-1 hover:shadow-md hover:border-blue-400 ${isCollapsed ? 'tooltip-container' : ''}`}>
                <FieldTypeButton
                  type={fieldType.type}
                  icon={fieldType.icon}
                  label={isCollapsed ? "" : fieldType.label}
                  onDragStart={onDragStart}
                  isCollapsed={isCollapsed}
                />
                {isCollapsed && (
                  <div className="tooltip absolute left-16 top-1/2 transform -translate-y-1/2 bg-[var(--bg-card)] text-white px-3 py-2 rounded-lg text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-50 border border-[var(--border-primary)]">
                    {fieldType.label}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {!isCollapsed && (
          <div className="mt-8 p-4 bg-[rgba(59,130,246,0.1)] rounded-lg border border-[rgba(59,130,246,0.3)] backdrop-blur-sm">
            <h3 className="font-semibold text-blue-300 mb-2 flex items-center">
              <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
              Quick Tips
            </h3>
            <ul className="text-xs text-gray-300 space-y-1">
              <li>• Drag fields to the canvas area</li>
              <li>• Click fields to edit properties</li>
              <li>• Reorder by dragging within canvas</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default FieldToolbar;