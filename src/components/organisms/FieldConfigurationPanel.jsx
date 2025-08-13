import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Card from "@/components/atoms/Card";
import { cn } from "@/utils/cn";

const FieldConfigurationPanel = ({ 
  selectedField, 
  onFieldUpdate, 
  onFieldDelete 
}) => {
  const [localField, setLocalField] = useState(null);
  const [optionInputs, setOptionInputs] = useState([]);

useEffect(() => {
    if (selectedField) {
      setLocalField({ ...selectedField });
      if ((selectedField.type === "dropdown" || selectedField.type === "multiselect") && selectedField.options) {
        setOptionInputs(selectedField.options.map(opt => opt));
      } else if (selectedField.type === "dropdown" || selectedField.type === "multiselect") {
        setOptionInputs(["Option 1", "Option 2"]);
      }
    }
  }, [selectedField]);

  if (!selectedField || !localField) {
    return null;
  }

  const handleLocalUpdate = (property, value) => {
    setLocalField(prev => ({ ...prev, [property]: value }));
  };

  const handleSave = () => {
const updates = { ...localField };
    
    if (localField.type === "dropdown" || localField.type === "multiselect") {
      updates.options = optionInputs.filter(opt => opt.trim() !== "");
    }
    
    onFieldUpdate(selectedField.id, updates);
  };

  const handleAddOption = () => {
    setOptionInputs(prev => [...prev, `Option ${prev.length + 1}`]);
  };

  const handleOptionChange = (index, value) => {
    setOptionInputs(prev => 
      prev.map((opt, idx) => idx === index ? value : opt)
    );
  };

  const handleRemoveOption = (index) => {
    setOptionInputs(prev => prev.filter((_, idx) => idx !== index));
  };

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete the "${selectedField.label}" field?`)) {
      onFieldDelete(selectedField.id);
    }
  };

return (
    <motion.div 
className="fixed right-0 top-0 w-96 h-screen bg-black/80 backdrop-blur-sm z-50"
      initial={{ x: 384, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 384, opacity: 0 }}
      transition={{ duration: 0.3 }}
      key={selectedField.id}
    >
      <div className="h-full w-96 bg-gradient-to-b from-gray-50 to-white dark:from-dark-900/50 dark:to-dark-800/70 border-l border-gray-200 dark:border-primary-500/30 custom-scrollbar overflow-y-auto shadow-xl backdrop-filter dark:backdrop-blur-lg p-6">
        {/* Close Button */}
        <button
          onClick={() => onFieldUpdate && onFieldUpdate(null, null)}
          className="absolute top-4 right-4 w-8 h-8 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-full flex items-center justify-center transition-colors z-10"
        >
          <ApperIcon name="X" className="w-4 h-4" />
        </button>
      <div className="mb-6">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-1 flex items-center">
<ApperIcon name="Settings" className="w-5 h-5 mr-2 text-primary-500 dark:text-primary-300" />
          Field Configuration
        </h2>
<p className="text-sm text-gray-600 dark:text-gray-300">
          Configure properties for {selectedField.type} field
        </p>
      </div>

      <div className="space-y-6">
        {/* Basic Information */}
<Card className="p-6 bg-gradient-to-br from-white to-gray-50 dark:from-dark-900/40 dark:to-dark-800/60 border dark:border-primary-500/20 backdrop-filter dark:backdrop-blur-lg">
          <h3 className="text-sm font-semibold text-gray-800 mb-3 flex items-center">
            <ApperIcon name="Type" className="w-4 h-4 mr-2 text-gray-500" />
            Basic Information
          </h3>
          
<div className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">
                Field Label
              </label>
              <Input
                value={localField.label || ""}
                onChange={(e) => handleLocalUpdate("label", e.target.value)}
                placeholder="Enter field label..."
                className="text-sm"
              />
            </div>
            
            {(localField.type === "text" || localField.type === "email" || localField.type === "textarea" || localField.type === "number" || localField.type === "url") && (
              <div>
                <label className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">
                  Placeholder Text
                </label>
                <Input
                  value={localField.placeholder || ""}
                  onChange={(e) => handleLocalUpdate("placeholder", e.target.value)}
                  placeholder="Enter placeholder text..."
                  className="text-sm"
                />
              </div>
            )}

            {localField.type === "textarea" && (
              <div>
                <label className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">
                  Rows
                </label>
                <Input
                  type="number"
                  value={localField.rows || 3}
                  onChange={(e) => handleLocalUpdate("rows", parseInt(e.target.value) || 3)}
                  min="1"
                  max="10"
                  className="text-sm"
                />
              </div>
            )}

            {localField.type === "number" && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">
                      Min Value
                    </label>
                    <Input
                      type="number"
                      value={localField.min || ""}
                      onChange={(e) => handleLocalUpdate("min", e.target.value ? parseFloat(e.target.value) : null)}
                      placeholder="No minimum"
                      className="text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">
                      Max Value
                    </label>
                    <Input
                      type="number"
                      value={localField.max || ""}
                      onChange={(e) => handleLocalUpdate("max", e.target.value ? parseFloat(e.target.value) : null)}
                      placeholder="No maximum"
                      className="text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">
                    Step
                  </label>
                  <Input
                    type="number"
                    value={localField.step || 1}
                    onChange={(e) => handleLocalUpdate("step", parseFloat(e.target.value) || 1)}
                    min="0.01"
                    step="0.01"
                    className="text-sm"
                  />
                </div>
              </div>
            )}

            {localField.type === "file" && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">
                    Accepted File Types
                  </label>
                  <Input
                    value={localField.accept || ""}
                    onChange={(e) => handleLocalUpdate("accept", e.target.value)}
                    placeholder="e.g., .pdf,.doc,.jpg"
                    className="text-sm"
                  />
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-2 bg-blue-50 dark:bg-blue-900/20 p-2 rounded-md">
                    Use comma-separated extensions or MIME types
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">
                    Max File Size (MB)
                  </label>
                  <Input
                    type="number"
                    value={localField.maxSize || ""}
                    onChange={(e) => handleLocalUpdate("maxSize", e.target.value ? parseFloat(e.target.value) : null)}
                    placeholder="No limit"
                    min="0.1"
                    step="0.1"
                    className="text-sm"
                  />
                </div>
                <div className="flex items-center space-x-3 bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                  <input
                    type="checkbox"
                    id="multiple"
                    checked={localField.multiple || false}
                    onChange={(e) => handleLocalUpdate("multiple", e.target.checked)}
                    className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label htmlFor="multiple" className="text-sm font-medium text-gray-800 dark:text-gray-200">
                    Allow multiple files
                  </label>
                </div>
              </div>
            )}

            {localField.type === "multiselect" && (
              <div>
                <label className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">
                  Maximum Selections
                </label>
                <Input
                  type="number"
                  value={localField.maxSelections || ""}
                  onChange={(e) => handleLocalUpdate("maxSelections", e.target.value ? parseInt(e.target.value) : null)}
                  placeholder="No limit"
                  min="1"
                  className="text-sm"
                />
              </div>
            )}

            {/* Validation Settings */}
            {(localField.type === "text" || localField.type === "textarea" || localField.type === "email" || localField.type === "url") && (
              <div className="space-y-4 bg-gray-50 dark:bg-gray-800 p-4 rounded-xl">
                <h4 className="text-sm font-bold text-gray-800 dark:text-gray-200">Validation Settings</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">
                      Min Length
                    </label>
                    <Input
                      type="number"
                      value={localField.minLength || ""}
                      onChange={(e) => handleLocalUpdate("minLength", e.target.value ? parseInt(e.target.value) : null)}
                      placeholder="No min"
                      min="0"
                      className="text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">
                      Max Length
                    </label>
                    <Input
                      type="number"
                      value={localField.maxLength || ""}
                      onChange={(e) => handleLocalUpdate("maxLength", e.target.value ? parseInt(e.target.value) : null)}
                      placeholder="No max"
                      min="1"
                      className="text-sm"
                    />
                  </div>
                </div>

                {localField.type === "text" && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">
                      Pattern (Regex)
                    </label>
                    <Input
                      value={localField.pattern || ""}
                      onChange={(e) => handleLocalUpdate("pattern", e.target.value)}
                      placeholder="e.g., ^[A-Za-z]+$"
                      className="text-sm"
                    />
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-2 bg-blue-50 dark:bg-blue-900/20 p-2 rounded-md">
                      Regular expression for validation
                    </p>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">
                    Custom Error Message
                  </label>
                  <Input
                    value={localField.errorMessage || ""}
                    onChange={(e) => handleLocalUpdate("errorMessage", e.target.value)}
                    placeholder="This field is invalid"
                    className="text-sm"
                  />
                </div>
              </div>
            )}

            {localField.type === "phone" && (
              <div className="space-y-4 bg-gray-50 dark:bg-gray-800 p-4 rounded-xl">
                <h4 className="text-sm font-bold text-gray-800 dark:text-gray-200">Phone Settings</h4>
                <div>
                  <label className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">
                    Phone Format
                  </label>
                  <select
                    value={localField.phoneFormat || "international"}
                    onChange={(e) => handleLocalUpdate("phoneFormat", e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-gradient-to-r from-white to-gray-50 dark:from-gray-700 dark:to-gray-650 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:text-white transition-all duration-300"
                  >
                    <option value="international">International (+1 234 567-8900)</option>
                    <option value="us">US Format ((234) 567-8900)</option>
                    <option value="custom">Custom Pattern</option>
                  </select>
                </div>
                {localField.phoneFormat === "custom" && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">
                      Custom Pattern
                    </label>
                    <Input
                      value={localField.pattern || ""}
                      onChange={(e) => handleLocalUpdate("pattern", e.target.value)}
                      placeholder="e.g., ^\d{3}-\d{3}-\d{4}$"
                      className="text-sm"
                    />
                  </div>
                )}
                <div>
                  <label className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">
                    Custom Error Message
                  </label>
                  <Input
                    value={localField.errorMessage || ""}
                    onChange={(e) => handleLocalUpdate("errorMessage", e.target.value)}
                    placeholder="Please enter a valid phone number"
                    className="text-sm"
                  />
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Field Settings */}
        <Card className="p-4">
          <h3 className="text-sm font-semibold text-gray-800 mb-3 flex items-center">
            <ApperIcon name="Settings2" className="w-4 h-4 mr-2 text-gray-500" />
            Field Settings
          </h3>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
<div className="bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-primary-500/10 dark:to-secondary-500/10 p-4 rounded-xl border border-primary-200 dark:border-primary-500/30 backdrop-filter dark:backdrop-blur-lg">
                <div>
                  <label className="block text-sm font-bold text-gray-800 dark:text-gray-200">
                    Required Field
                  </label>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Make this field mandatory for submission
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer mt-3">
                  <input
                    type="checkbox"
                    checked={localField.required || false}
                    onChange={(e) => handleLocalUpdate("required", e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-12 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-gradient-to-r peer-checked:from-primary-500 peer-checked:to-secondary-500"></div>
                  <span className="ml-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                    {localField.required ? 'Required' : 'Optional'}
                  </span>
                </label>
              </div>
            </div>
            
<div>
              <label className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">
                Help Text / Description
              </label>
              <textarea
                value={localField.description || ""}
                onChange={(e) => handleLocalUpdate("description", e.target.value)}
                placeholder="Add helpful description for users..."
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-gradient-to-r from-white to-gray-50 dark:from-gray-700 dark:to-gray-650 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm resize-none dark:text-white transition-all duration-300 hover:shadow-md focus:shadow-lg"
                rows={3}
              />
            </div>
          </div>
        </Card>

        {/* Field-Specific Options */}
{(localField.type === "dropdown" || localField.type === "multiselect") && (
          <Card className="p-4">
            <h3 className="text-sm font-semibold text-gray-800 mb-3 flex items-center">
              <ApperIcon name="List" className="w-4 h-4 mr-2 text-gray-500" />
              {localField.type === "dropdown" ? "Dropdown Options" : "Multi-Select Options"}
            </h3>
            
            <div className="space-y-2">
              <AnimatePresence>
                {optionInputs.map((option, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex items-center space-x-2"
                  >
                    <Input
                      value={option}
                      onChange={(e) => handleOptionChange(index, e.target.value)}
                      placeholder={`Option ${index + 1}`}
                      className="text-sm flex-1"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveOption(index)}
                      className="p-1 h-8 w-8 text-gray-500 hover:text-accent-500"
                      disabled={optionInputs.length <= 1}
                    >
                      <ApperIcon name="X" className="w-3 h-3" />
                    </Button>
                  </motion.div>
                ))}
              </AnimatePresence>
              
<Button
                variant="secondary"
                size="sm"
                onClick={handleAddOption}
                className="w-full mt-3 text-sm"
              >
                <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
                Add Option
              </Button>
            </div>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-2 pt-4 border-t border-gray-200">
          <Button
            onClick={handleSave}
            className="flex-1"
          >
            <ApperIcon name="Save" className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
          
          <Button
            variant="destructive"
            onClick={handleDelete}
            className="px-3"
          >
            <ApperIcon name="Trash2" className="w-4 h-4" />
          </Button>
        </div>

{/* Field Preview */}
<Card className="p-6 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-primary-500/10 dark:via-secondary-500/10 dark:to-accent-500/10 border-blue-200 dark:border-primary-500/30 backdrop-filter dark:backdrop-blur-lg">
          <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-4 flex items-center">
            <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mr-3">
              <ApperIcon name="Eye" className="w-3.5 h-3.5 text-white" />
            </div>
            Live Preview
          </h3>
          
          <div className="space-y-4">
            <label className="block text-sm font-bold text-gray-800 dark:text-gray-200">
              {localField.label || "Field Label"}
              {localField.required && <span className="text-red-500 ml-1 text-base">*</span>}
            </label>
            
            {localField.type === "text" && (
              <div>
                <input
                  type="text"
                  placeholder={localField.placeholder || "Enter text..."}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-gradient-to-r from-white to-gray-50 dark:from-gray-700 dark:to-gray-650 text-sm transition-all duration-300 hover:shadow-md"
                  disabled
                />
                {(localField.minLength || localField.maxLength || localField.pattern) && (
                  <div className="mt-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                    <div className="text-xs text-blue-700 dark:text-blue-300 space-y-1">
                      {localField.minLength && <div>• Min length: {localField.minLength} characters</div>}
                      {localField.maxLength && <div>• Max length: {localField.maxLength} characters</div>}
                      {localField.pattern && <div>• Pattern: {localField.pattern}</div>}
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {localField.type === "email" && (
              <div>
                <input
                  type="email"
                  placeholder={localField.placeholder || "Enter email..."}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-gradient-to-r from-white to-gray-50 dark:from-gray-700 dark:to-gray-650 text-sm transition-all duration-300 hover:shadow-md"
                  disabled
                />
                <div className="mt-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800 text-xs text-green-700 dark:text-green-300">
                  ✓ Email format validation enabled
                </div>
              </div>
            )}

            {localField.type === "phone" && (
              <div>
                <input
                  type="tel"
                  placeholder={localField.placeholder || "Enter phone number..."}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-gradient-to-r from-white to-gray-50 dark:from-gray-700 dark:to-gray-650 text-sm transition-all duration-300 hover:shadow-md"
                  disabled
                />
                <div className="mt-2 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800 text-xs text-purple-700 dark:text-purple-300">
                  📱 Format: {localField.phoneFormat || "International"}
                </div>
              </div>
            )}

            {localField.type === "textarea" && (
              <div>
                <textarea
                  placeholder={localField.placeholder || "Enter your text here..."}
                  rows={localField.rows || 3}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-gradient-to-r from-white to-gray-50 dark:from-gray-700 dark:to-gray-650 text-sm resize-none transition-all duration-300 hover:shadow-md"
                  disabled
                />
                {(localField.minLength || localField.maxLength) && (
                  <div className="mt-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                    <div className="text-xs text-blue-700 dark:text-blue-300 space-y-1">
                      {localField.minLength && <div>• Min length: {localField.minLength} characters</div>}
                      {localField.maxLength && <div>• Max length: {localField.maxLength} characters</div>}
                    </div>
                  </div>
                )}
              </div>
            )}

            {localField.type === "number" && (
              <input
                type="number"
                placeholder={localField.placeholder || "Enter a number..."}
                min={localField.min}
                max={localField.max}
                step={localField.step || 1}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-gradient-to-r from-white to-gray-50 dark:from-gray-700 dark:to-gray-650 text-sm transition-all duration-300 hover:shadow-md"
                disabled
              />
            )}

            {localField.type === "url" && (
              <div>
                <input
                  type="url"
                  placeholder={localField.placeholder || "https://example.com"}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-gradient-to-r from-white to-gray-50 dark:from-gray-700 dark:to-gray-650 text-sm transition-all duration-300 hover:shadow-md"
                  disabled
                />
                <div className="mt-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800 text-xs text-green-700 dark:text-green-300">
                  🔗 URL format validation enabled
                </div>
              </div>
            )}

            {localField.type === "file" && (
              <div>
                <input
                  type="file"
                  accept={localField.accept}
                  multiple={localField.multiple}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-gradient-to-r from-white to-gray-50 dark:from-gray-700 dark:to-gray-650 text-sm transition-all duration-300 hover:shadow-md"
                  disabled
                />
                {(localField.accept || localField.maxSize) && (
                  <div className="mt-2 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
                    <div className="text-xs text-orange-700 dark:text-orange-300 space-y-1">
                      {localField.accept && <div>📄 Accepted: {localField.accept}</div>}
                      {localField.maxSize && <div>📏 Max size: {localField.maxSize}MB</div>}
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {localField.type === "dropdown" && (
              <select className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-gradient-to-r from-white to-gray-50 dark:from-gray-700 dark:to-gray-650 text-sm transition-all duration-300 hover:shadow-md" disabled>
                <option>Select an option...</option>
                {optionInputs.filter(opt => opt.trim()).map((option, idx) => (
                  <option key={idx}>{option}</option>
                ))}
              </select>
            )}

            {localField.type === "multiselect" && (
              <div>
                <select 
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-gradient-to-r from-white to-gray-50 dark:from-gray-700 dark:to-gray-650 text-sm transition-all duration-300 hover:shadow-md" 
                  multiple 
                  size="3"
                  disabled
                >
                  {optionInputs.filter(opt => opt.trim()).map((option, idx) => (
                    <option key={idx}>{option}</option>
                  ))}
                </select>
                {localField.maxSelections && (
                  <div className="mt-2 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800 text-xs text-yellow-700 dark:text-yellow-300">
                    🔢 Max selections: {localField.maxSelections}
                  </div>
                )}
              </div>
            )}
            
            {localField.description && (
              <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg border-l-4 border-blue-400">
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  💡 {localField.description}
                </p>
              </div>
            )}

            {localField.errorMessage && (
              <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <div className="text-sm text-red-700 dark:text-red-300">
                  <strong>Custom error message:</strong> {localField.errorMessage}
                </div>
              </div>
            )}
          </div>
        </Card>
</div>
      </div>
    </motion.div>
  );
};

export default FieldConfigurationPanel;