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
    <div className="w-full h-full bg-white rounded-lg shadow-lg border border-gray-200 p-6">
      <div className="mb-6">
        <h2 className="text-lg font-bold text-gray-900 mb-2 bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
          Field Types
        </h2>
        <p className="text-sm text-gray-600">
          Drag field types to the canvas to add them to your form
        </p>
      </div>

      <div className="space-y-3">
        {fieldTypes.map((fieldType) => (
          <FieldTypeButton
            key={fieldType.type}
            type={fieldType.type}
            icon={fieldType.icon}
            label={fieldType.label}
            onDragStart={onDragStart}
          />
        ))}
      </div>

      <div className="mt-8 p-4 bg-gradient-to-br from-primary-50 to-secondary-50 rounded-lg border border-primary-200">
        <h3 className="font-semibold text-primary-700 mb-2 flex items-center">
          <span className="w-2 h-2 bg-primary-500 rounded-full mr-2"></span>
          Quick Tips
        </h3>
        <ul className="text-xs text-primary-600 space-y-1">
          <li>• Drag fields to the canvas area</li>
          <li>• Click fields to edit properties</li>
          <li>• Reorder by dragging within canvas</li>
        </ul>
      </div>
    </div>
  );
};

export default FieldToolbar;