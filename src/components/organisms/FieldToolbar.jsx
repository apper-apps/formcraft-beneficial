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
<div className="field-types-sidebar fixed left-0 top-16 w-52 h-[calc(100vh-4rem)] bg-[rgba(10,10,15,0.95)] backdrop-blur-[10px] border-r border-[rgba(255,255,255,0.1)] p-5 px-3 overflow-y-auto z-40 custom-scrollbar">
      <div className="mb-6">
        <h2 className="text-lg font-bold text-white mb-2 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
          Field Types
        </h2>
        <p className="text-sm text-gray-300">
          Drag field types to the canvas to add them to your form
        </p>
      </div>

      <div className="space-y-2">
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
    </div>
  );
};

export default FieldToolbar;