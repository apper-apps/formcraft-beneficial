import React, { useState } from "react";
import toast from "react-hot-toast";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import { cn } from "@/utils/cn";

const FormPreview = ({ fields, formSettings = {} }) => {
  const [formData, setFormData] = useState({});

  const handleInputChange = (fieldId, value) => {
    setFormData(prev => ({
      ...prev,
      [fieldId]: value
    }));
  };

const handleSubmit = (e) => {
    e.preventDefault();
    
    // Basic validation if enabled
    if (formSettings.enableValidation) {
      const requiredFields = formSettings.requireAllFields ? 
        fields : 
        fields.filter(field => field.required);
      
      for (const field of requiredFields) {
        if (!formData[field.id] || formData[field.id].toString().trim() === '') {
          toast.error(`${field.label} is required`);
          return;
        }
      }
    }

    console.log("Form Data:", formData);
    toast.success(formSettings.successMessage || "Form submitted successfully!");
    
    // Handle redirect if configured
    if (formSettings.redirectAfterSubmission && formSettings.redirectUrl) {
      setTimeout(() => {
        window.open(formSettings.redirectUrl, '_blank');
      }, 2000);
    }
  };

  const renderField = (field) => {
const baseInputClasses = "w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200";
    
    switch (field.type) {
      case "text":
        return (
          <input
            type="text"
            id={field.id}
            placeholder={field.placeholder || "Enter text..."}
            value={formData[field.id] || ""}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            className={baseInputClasses}
          />
        );
      case "email":
        return (
          <input
            type="email"
            id={field.id}
            placeholder={field.placeholder || "Enter email address..."}
            value={formData[field.id] || ""}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            className={baseInputClasses}
          />
        );
      case "dropdown":
        return (
          <select
            id={field.id}
            value={formData[field.id] || ""}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            className={baseInputClasses}
          >
            <option value="">Select an option...</option>
            {field.options?.map((option, idx) => (
              <option key={idx} value={option}>
                {option}
              </option>
            ))}
          </select>
        );
      default:
        return null;
    }
  };

  if (fields.length === 0) {
return (
      <div className="w-full h-full bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6 transition-colors duration-200">
        <div className="flex flex-col items-center justify-center h-full text-center">
          <div className="w-16 h-16 mb-4 rounded-full bg-gradient-to-br from-primary-100 dark:from-primary-900/50 to-secondary-100 dark:to-secondary-900/50 flex items-center justify-center">
            <ApperIcon name="Eye" className="w-8 h-8 text-primary-500 dark:text-primary-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-2">
            Live Preview
          </h3>
          <p className="text-gray-500 dark:text-gray-400 max-w-md">
            Your form preview will appear here as you add fields to the canvas. Add some fields to get started!
          </p>
        </div>
      </div>
    );
  }

  return (
<div className="w-full h-full bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6 custom-scrollbar overflow-y-auto transition-colors duration-200">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-bold text-gray-900 bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
            Live Preview
          </h2>
          <div className="flex items-center space-x-1 text-xs text-green-600">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>Live</span>
          </div>
        </div>
<p className="text-sm text-gray-600 dark:text-gray-300">
          This is how your form will look to users
        </p>
      </div>

      <div className="preview-form">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {formSettings.title || "Preview Form"}
            </h1>
            {formSettings.description && (
              <p className="text-gray-600 dark:text-gray-300">{formSettings.description}</p>
            )}
            {!formSettings.description && (
              <p className="text-gray-600 dark:text-gray-300">Please fill out the form below.</p>
            )}
          </div>

          {fields.map((field) => (
            <div key={field.id} className="space-y-2">
              <label 
                htmlFor={field.id} 
                className="block text-sm font-medium text-gray-700 dark:text-gray-200"
              >
                {field.label || "Untitled Field"}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </label>
              {renderField(field)}
            </div>
          ))}

          <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
<Button type="submit" className="w-full">
              {formSettings.submitButtonText || "Submit Form"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormPreview;