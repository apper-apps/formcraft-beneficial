import React from "react";
import { useTheme } from "@/contexts/ThemeContext";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Header = ({ onExport, onFormSettings, onSaveForm, onLoadForm, onNewForm, fieldCount, formTitle, hasFields }) => {
  const { isDark, toggleTheme } = useTheme();
  return (
<header
    className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 px-6 py-4 transition-colors duration-200">
    <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-3">
                    <div
                        className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
                        <ApperIcon name="Layout" className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-gray-900 dark:text-white">FormCraft</h1>
                        <p className="text-sm text-gray-600 dark:text-gray-300">Visual Form Builder</p>
                    </div>
                </div>
                <Button
                    variant="ghost"
                    onClick={toggleTheme}
                    className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                    aria-label={`Switch to ${isDark ? "light" : "dark"} theme`}>
                    <ApperIcon name={isDark ? "Sun" : "Moon"} className="w-4 h-4" />
                </Button>
            </div>
            <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <ApperIcon name="Layout" className="w-4 h-4" />
                    <span>{fieldCount}field{fieldCount !== 1 ? "s" : ""}</span>
                </div>
                <Button
                    variant="secondary"
                    onClick={onNewForm}
                    className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200">
                    <ApperIcon name="Plus" className="w-4 h-4" />
                    <span>New Form</span>
                </Button>
                <Button
                    variant="secondary"
                    onClick={() => onSaveForm(formTitle)}
                    disabled={!hasFields}
                    className="flex items-center space-x-2 bg-green-100 dark:bg-green-900/50 hover:bg-green-200 dark:hover:bg-green-900/70 text-green-700 dark:text-green-300 disabled:bg-gray-100 dark:disabled:bg-gray-700 disabled:text-gray-400 dark:disabled:text-gray-500">
                    <ApperIcon name="Save" className="w-4 h-4" />
                    <span>Save Form</span>
                </Button>
                <Button
                    variant="secondary"
                    onClick={onLoadForm}
                    className="flex items-center space-x-2 bg-blue-100 hover:bg-blue-200 text-blue-700">
                    <ApperIcon name="FolderOpen" className="w-4 h-4" />
                    <span>Load Form</span>
                </Button>
                <Button
                    variant="ghost"
                    onClick={onFormSettings}
                    className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                    <ApperIcon name="Settings" className="w-4 h-4" />
                    <span>Form Settings</span>
                </Button>
                <Button
                    variant="secondary"
                    onClick={onExport}
                    className="flex items-center space-x-2">
                    <ApperIcon name="Download" className="w-4 h-4" />
                    <span>Export</span>
                </Button>
            </div>
        </div>
    </div></header>
  );
};

export default Header;