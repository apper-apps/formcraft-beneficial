import React from "react";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const Header = ({ onExport, onFormSettings, onSaveForm, onLoadForm, onNewForm, fieldCount, formTitle, hasFields }) => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
              <ApperIcon name="Layout" className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">FormCraft</h1>
              <p className="text-sm text-gray-600">Visual Form Builder</p>
            </div>
          </div>
        </div>

<div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <ApperIcon name="Layout" className="w-4 h-4" />
            <span>{fieldCount} field{fieldCount !== 1 ? "s" : ""}</span>
          </div>

          <Button
            variant="secondary"
            onClick={onNewForm}
            className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 text-gray-700"
          >
            <ApperIcon name="Plus" className="w-4 h-4" />
            <span>New Form</span>
          </Button>

          <Button
            variant="secondary"
            onClick={() => onSaveForm(formTitle)}
            disabled={!hasFields}
            className="flex items-center space-x-2 bg-green-100 hover:bg-green-200 text-green-700 disabled:bg-gray-100 disabled:text-gray-400"
          >
            <ApperIcon name="Save" className="w-4 h-4" />
            <span>Save Form</span>
          </Button>

          <Button
            variant="secondary"
            onClick={onLoadForm}
            className="flex items-center space-x-2 bg-blue-100 hover:bg-blue-200 text-blue-700"
          >
            <ApperIcon name="FolderOpen" className="w-4 h-4" />
            <span>Load Form</span>
          </Button>

          <Button
            variant="ghost"
            onClick={onFormSettings}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
          >
            <ApperIcon name="Settings" className="w-4 h-4" />
            <span>Form Settings</span>
          </Button>

          <Button
            variant="secondary"
            onClick={onExport}
            className="flex items-center space-x-2"
          >
            <ApperIcon name="Download" className="w-4 h-4" />
            <span>Export</span>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;