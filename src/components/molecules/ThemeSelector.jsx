import React, { useState } from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import { cn } from "@/utils/cn";

const ThemeSelector = ({ selectedTheme, themes, onThemeSelect }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleThemeSelect = (theme) => {
    onThemeSelect(theme);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <Button
        variant="secondary"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 bg-purple-100 hover:bg-purple-200 text-purple-700 dark:bg-purple-900/50 dark:hover:bg-purple-900/70 dark:text-purple-300"
      >
        <ApperIcon name="Palette" className="w-4 h-4" />
        <span>{selectedTheme?.name || "Theme"}</span>
        <ApperIcon name={isOpen ? "ChevronUp" : "ChevronDown"} className="w-4 h-4" />
      </Button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50 p-4">
          <div className="grid grid-cols-2 gap-3">
            {themes.map((theme) => (
              <button
                key={theme.id}
                onClick={() => handleThemeSelect(theme)}
                className={cn(
                  "relative p-3 rounded-lg border-2 transition-all duration-200 hover:shadow-md group",
                  selectedTheme?.id === theme.id
                    ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20"
                    : "border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500"
                )}
              >
                <div 
                  className="w-full h-16 rounded-md mb-2 shadow-sm"
                  style={{ background: theme.thumbnail }}
                />
                <div className="text-left">
                  <div className="font-medium text-gray-900 dark:text-white text-sm">
                    {theme.name}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {theme.description}
                  </div>
                </div>
                {selectedTheme?.id === theme.id && (
                  <div className="absolute top-2 right-2">
                    <div className="w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center">
                      <ApperIcon name="Check" className="w-3 h-3 text-white" />
                    </div>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Overlay to close dropdown when clicking outside */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default ThemeSelector;