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
    return (
      <motion.div 
        className="w-96 p-6 bg-background border-l border-gray-200 flex items-center justify-center"
        initial={{ x: 50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary-100 to-secondary-100 flex items-center justify-center">
            <ApperIcon name="Settings" className="w-8 h-8 text-primary-500" />
          </div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            No field selected
          </h3>
          <p className="text-gray-500 text-sm">
            Click on a field in the canvas to configure its properties
          </p>
        </div>
      </motion.div>
    );
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
      className="w-96 p-6 bg-background border-l border-gray-200 custom-scrollbar overflow-y-auto"
      initial={{ x: 50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      key={selectedField.id}
    >
      <div className="mb-6">
        <h2 className="text-lg font-bold text-gray-900 mb-1 flex items-center">
          <ApperIcon name="Settings" className="w-5 h-5 mr-2 text-primary-500" />
          Field Configuration
        </h2>
        <p className="text-sm text-gray-600">
          Configure properties for {selectedField.type} field
        </p>
      </div>

      <div className="space-y-6">
        {/* Basic Information */}
        <Card className="p-4">
          <h3 className="text-sm font-semibold text-gray-800 mb-3 flex items-center">
            <ApperIcon name="Type" className="w-4 h-4 mr-2 text-gray-500" />
            Basic Information
          </h3>
          
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
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
                <label className="block text-xs font-medium text-gray-700 mb-1">
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
                <label className="block text-xs font-medium text-gray-700 mb-1">
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
              <>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Minimum Value
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
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Maximum Value
                  </label>
                  <Input
                    type="number"
                    value={localField.max || ""}
                    onChange={(e) => handleLocalUpdate("max", e.target.value ? parseFloat(e.target.value) : null)}
                    placeholder="No maximum"
                    className="text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
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
              </>
            )}

            {localField.type === "file" && (
              <>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Accepted File Types
                  </label>
                  <Input
                    value={localField.accept || ""}
                    onChange={(e) => handleLocalUpdate("accept", e.target.value)}
                    placeholder="e.g., .pdf,.doc,.jpg"
                    className="text-sm"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Use comma-separated extensions or MIME types
                  </p>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
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
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="multiple"
                    checked={localField.multiple || false}
                    onChange={(e) => handleLocalUpdate("multiple", e.target.checked)}
                    className="w-3 h-3 text-primary-600"
                  />
                  <label htmlFor="multiple" className="text-xs text-gray-700">
                    Allow multiple files
                  </label>
                </div>
              </>
            )}

            {localField.type === "multiselect" && (
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
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
              <>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
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
                    <label className="block text-xs font-medium text-gray-700 mb-1">
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
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Pattern (Regex)
                    </label>
                    <Input
                      value={localField.pattern || ""}
                      onChange={(e) => handleLocalUpdate("pattern", e.target.value)}
                      placeholder="e.g., ^[A-Za-z]+$"
                      className="text-sm"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Regular expression for validation
                    </p>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Custom Error Message
                  </label>
                  <Input
                    value={localField.errorMessage || ""}
                    onChange={(e) => handleLocalUpdate("errorMessage", e.target.value)}
                    placeholder="This field is invalid"
                    className="text-sm"
                  />
                </div>
              </>
            )}

            {localField.type === "phone" && (
              <>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Phone Format
                  </label>
                  <select
                    value={localField.phoneFormat || "international"}
                    onChange={(e) => handleLocalUpdate("phoneFormat", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="international">International (+1 234 567-8900)</option>
                    <option value="us">US Format ((234) 567-8900)</option>
                    <option value="custom">Custom Pattern</option>
                  </select>
                </div>
                {localField.phoneFormat === "custom" && (
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
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
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Custom Error Message
                  </label>
                  <Input
                    value={localField.errorMessage || ""}
                    onChange={(e) => handleLocalUpdate("errorMessage", e.target.value)}
                    placeholder="Please enter a valid phone number"
                    className="text-sm"
                  />
                </div>
              </>
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
              <div>
                <label className="block text-xs font-medium text-gray-700">
                  Required Field
                </label>
                <p className="text-xs text-gray-500">
                  Make this field mandatory
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={localField.required || false}
                  onChange={(e) => handleLocalUpdate("required", e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>
            
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Help Text / Description
              </label>
              <textarea
                value={localField.description || ""}
                onChange={(e) => handleLocalUpdate("description", e.target.value)}
                placeholder="Add helpful description for users..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm resize-none"
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
                variant="outline"
                size="sm"
                onClick={handleAddOption}
                className="w-full mt-2 text-xs"
              >
                <ApperIcon name="Plus" className="w-3 h-3 mr-1" />
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
        <Card className="p-4 bg-gray-50">
          <h3 className="text-sm font-semibold text-gray-800 mb-3 flex items-center">
            <ApperIcon name="Eye" className="w-4 h-4 mr-2 text-gray-500" />
            Preview with Validation
          </h3>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {localField.label || "Field Label"}
              {localField.required && <span className="text-accent-500 ml-1">*</span>}
            </label>
            
{localField.type === "text" && (
              <div>
                <input
                  type="text"
                  placeholder={localField.placeholder || "Enter text..."}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  disabled
                />
                {(localField.minLength || localField.maxLength || localField.pattern) && (
                  <div className="mt-1 text-xs text-gray-500 space-y-1">
                    {localField.minLength && <div>Min length: {localField.minLength}</div>}
                    {localField.maxLength && <div>Max length: {localField.maxLength}</div>}
                    {localField.pattern && <div>Pattern: {localField.pattern}</div>}
                  </div>
                )}
              </div>
            )}
            
            {localField.type === "email" && (
              <div>
                <input
                  type="email"
                  placeholder={localField.placeholder || "Enter email..."}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  disabled
                />
                <div className="mt-1 text-xs text-gray-500">Email format validation enabled</div>
              </div>
            )}

            {localField.type === "phone" && (
              <div>
                <input
                  type="tel"
                  placeholder={localField.placeholder || "Enter phone number..."}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  disabled
                />
                <div className="mt-1 text-xs text-gray-500">
                  Format: {localField.phoneFormat || "International"}
                </div>
              </div>
            )}

            {localField.type === "textarea" && (
              <div>
                <textarea
                  placeholder={localField.placeholder || "Enter your text here..."}
                  rows={localField.rows || 3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm resize-none"
                  disabled
                />
                {(localField.minLength || localField.maxLength) && (
                  <div className="mt-1 text-xs text-gray-500 space-y-1">
                    {localField.minLength && <div>Min length: {localField.minLength}</div>}
                    {localField.maxLength && <div>Max length: {localField.maxLength}</div>}
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                disabled
              />
            )}

            {localField.type === "url" && (
              <div>
                <input
                  type="url"
                  placeholder={localField.placeholder || "https://example.com"}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  disabled
                />
                <div className="mt-1 text-xs text-gray-500">URL format validation enabled</div>
              </div>
            )}

            {localField.type === "file" && (
              <div>
                <input
                  type="file"
                  accept={localField.accept}
                  multiple={localField.multiple}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  disabled
                />
                {(localField.accept || localField.maxSize) && (
                  <div className="mt-1 text-xs text-gray-500 space-y-1">
                    {localField.accept && <div>Accepted: {localField.accept}</div>}
                    {localField.maxSize && <div>Max size: {localField.maxSize}MB</div>}
                  </div>
                )}
              </div>
            )}
            
            {localField.type === "dropdown" && (
              <select className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" disabled>
                <option>Select an option...</option>
                {optionInputs.filter(opt => opt.trim()).map((option, idx) => (
                  <option key={idx}>{option}</option>
                ))}
              </select>
            )}

            {localField.type === "multiselect" && (
              <div>
                <select 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" 
                  multiple 
                  size="3"
                  disabled
                >
                  {optionInputs.filter(opt => opt.trim()).map((option, idx) => (
                    <option key={idx}>{option}</option>
                  ))}
                </select>
                {localField.maxSelections && (
                  <div className="mt-1 text-xs text-gray-500">
                    Max selections: {localField.maxSelections}
                  </div>
                )}
              </div>
            )}
            
            {localField.description && (
              <p className="text-xs text-gray-500 mt-1">
                {localField.description}
              </p>
            )}

            {localField.errorMessage && (
              <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-xs text-red-600">
                <strong>Custom error:</strong> {localField.errorMessage}
              </div>
            )}
          </div>
        </Card>
      </div>
    </motion.div>
  );
};

export default FieldConfigurationPanel;