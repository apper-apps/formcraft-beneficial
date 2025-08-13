import React from "react";
import FieldTypeButton from "@/components/molecules/FieldTypeButton";

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

  return (
<div className="w-full h-full bg-white dark:bg-purple-900/30 rounded-lg shadow-lg border border-gray-200 dark:border-purple-600/30 p-6">
      <div className="mb-6">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2 bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-300 dark:to-indigo-300 bg-clip-text text-transparent">
          Field Types
        </h2>
        <p className="text-sm text-gray-600 dark:text-purple-200">
          Drag field types to the canvas to add them to your form
        </p>
      </div>

<div className="space-y-3">
        {fieldTypes.map((fieldType, index) => (
          <div
            key={fieldType.type}
            className="animate-slide-up"
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            <FieldTypeButton
              type={fieldType.type}
              icon={fieldType.icon}
              label={fieldType.label}
              onDragStart={onDragStart}
            />
          </div>
        ))}
      </div>

<div className="mt-8 p-4 bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-purple-600/20 dark:to-indigo-600/20 rounded-lg border border-primary-200 dark:border-purple-500/30">
        <h3 className="font-semibold text-primary-700 dark:text-purple-200 mb-2 flex items-center">
          <span className="w-2 h-2 bg-primary-500 dark:bg-purple-400 rounded-full mr-2"></span>
          Quick Tips
        </h3>
        <ul className="text-xs text-primary-600 dark:text-purple-300 space-y-1">
          <li>• Drag fields to the canvas area</li>
          <li>• Click fields to edit properties</li>
          <li>• Reorder by dragging within canvas</li>
        </ul>
      </div>
    </div>
  );
};

export default FieldToolbar;