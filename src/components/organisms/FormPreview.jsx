import React, { useState } from "react";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import { cn } from "@/utils/cn";
const FormPreview = ({ fields, formSettings = {}, selectedTheme, isPreviewMode = false, onBackToEditor }) => {
const [formData, setFormData] = useState({});
  const [validationErrors, setValidationErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);

  // Export validation function for reuse in standalone forms
  window.FormValidation = window.FormValidation || {};
  window.FormValidation.validateField = (field, value) => {
    const errors = [];
    
    // Required field validation
    if (field.required && (!value || value.toString().trim() === '')) {
      errors.push(field.errorMessage || `${field.label} is required`);
      return errors;
    }
    
    // Skip validation if field is empty and not required
    if (!value || value.toString().trim() === '') {
      return errors;
    }
    
    // Length validation for text fields
    if ((field.type === "text" || field.type === "textarea" || field.type === "email" || field.type === "url") && value) {
      if (field.minLength && value.length < field.minLength) {
        errors.push(field.errorMessage || `${field.label} must be at least ${field.minLength} characters`);
      }
      if (field.maxLength && value.length > field.maxLength) {
        errors.push(field.errorMessage || `${field.label} must not exceed ${field.maxLength} characters`);
      }
    }
    
    // Pattern validation
    if (field.pattern && value) {
      try {
        const regex = new RegExp(field.pattern);
        if (!regex.test(value)) {
          errors.push(field.errorMessage || `${field.label} format is invalid`);
        }
      } catch (e) {
        console.warn('Invalid regex pattern:', field.pattern);
      }
    }
    
    // Email validation
    if (field.type === "email" && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        errors.push(field.errorMessage || "Please enter a valid email address");
      }
    }
    
    // Phone validation
    if (field.type === "phone" && value) {
      let phoneRegex;
      switch (field.phoneFormat) {
        case "us":
          phoneRegex = /^\(\d{3}\) \d{3}-\d{4}$/;
          break;
        case "international":
          phoneRegex = /^\+\d{1,3} \d{3} \d{3}-\d{4}$/;
          break;
        case "custom":
          if (field.pattern) {
            try {
              phoneRegex = new RegExp(field.pattern);
            } catch (e) {
              console.warn('Invalid phone pattern:', field.pattern);
            }
          }
          break;
        default:
          phoneRegex = /^[\d\s()+−]{10,}$/;
      }
      if (phoneRegex && !phoneRegex.test(value)) {
        errors.push(field.errorMessage || "Please enter a valid phone number");
      }
    }
    
    // URL validation
    if (field.type === "url" && value) {
      try {
        new URL(value);
      } catch (e) {
        errors.push(field.errorMessage || "Please enter a valid URL");
      }
    }
    
    // Number range validation
    if (field.type === "number" && value) {
      const numValue = parseFloat(value);
      if (field.min !== null && numValue < field.min) {
        errors.push(field.errorMessage || `${field.label} must be at least ${field.min}`);
      }
      if (field.max !== null && numValue > field.max) {
        errors.push(field.errorMessage || `${field.label} must not exceed ${field.max}`);
      }
    }
    
    return errors;
  };

  const validateField = window.FormValidation.validateField;

  const handleInputChange = (fieldId, value, files = null) => {
    const field = fields.find(f => f.id === fieldId);
    
    // Handle file validation
    if (field?.type === "file" && files) {
      const errors = [];
      
      for (const file of files) {
        // File size validation
        if (field.maxSize && file.size > field.maxSize * 1024 * 1024) {
          errors.push(`${file.name} exceeds maximum size of ${field.maxSize}MB`);
        }
        
        // File type validation
        if (field.accept) {
          const acceptedTypes = field.accept.split(',').map(type => type.trim().toLowerCase());
          const fileName = file.name.toLowerCase();
          const fileExtension = '.' + fileName.split('.').pop();
          
          const isAccepted = acceptedTypes.some(type => {
            if (type.startsWith('.')) {
              return fileName.endsWith(type);
            } else if (type.includes('/')) {
              return file.type.match(type.replace('*', '.*'));
            }
            return false;
          });
          
          if (!isAccepted) {
            errors.push(`${file.name} is not an accepted file type`);
          }
        }
      }
      
      if (errors.length > 0) {
        setValidationErrors(prev => ({
          ...prev,
          [fieldId]: errors
        }));
        return;
      } else {
        // Clear file errors if validation passes
        setValidationErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[fieldId];
          return newErrors;
        });
      }
      
      setFormData(prev => ({
        ...prev,
        [fieldId]: files
      }));
      return;
    }
    
    // Regular field validation
    setFormData(prev => ({
      ...prev,
      [fieldId]: value
    }));
    
    if (field) {
      const errors = validateField(field, value);
      setValidationErrors(prev => ({
        ...prev,
        [fieldId]: errors.length > 0 ? errors : undefined
      }));
    }
  };

const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate all fields
    const allErrors = {};
    let hasErrors = false;
    
    fields.forEach(field => {
      const value = formData[field.id];
      const errors = validateField(field, value);
      if (errors.length > 0) {
        allErrors[field.id] = errors;
        hasErrors = true;
      }
    });
    
    if (hasErrors) {
      setValidationErrors(allErrors);
      toast.error("Please fix the validation errors before submitting");
      return;
    }
    
    // Clear any existing errors
    setValidationErrors({});
    
    // Store submitted data for preview mode
    const formattedData = Object.keys(formData).reduce((acc, fieldId) => {
      const field = fields.find(f => f.id === fieldId);
      if (field && formData[fieldId] !== undefined && formData[fieldId] !== '') {
        acc[field.label || `Field ${fieldId}`] = formData[fieldId];
      }
      return acc;
    }, {});
    
    setSubmittedData(formattedData);
    setIsSubmitted(true);
    
    console.log("Form Data:", formData);
    toast.success(formSettings.successMessage || "Form submitted successfully!");
    
    // Handle redirect if configured
    if (formSettings.redirectAfterSubmission && formSettings.redirectUrl) {
      setTimeout(() => {
        window.open(formSettings.redirectUrl, '_blank');
      }, 2000);
    }
  };

  // Handle form reset for testing
  const handleFormReset = () => {
    setFormData({});
    setValidationErrors({});
    setIsSubmitted(false);
    setSubmittedData(null);
  };

// Export theme function for standalone forms
window.FormValidation = window.FormValidation || {};
window.FormValidation.getThemeClasses = (selectedTheme) => {
    if (!selectedTheme) {
      return {
container: "w-full h-full bg-gradient-to-br from-white via-gray-50 to-white dark:from-primary-600/20 dark:via-dark-900/95 dark:to-primary-700/25 rounded-2xl shadow-2xl dark:shadow-primary-600/30 border border-gray-200 dark:border-primary-500/40 p-8 custom-scrollbar overflow-y-auto transition-all duration-300 backdrop-blur-sm",
        title: "text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-100 bg-clip-text text-transparent mb-4",
        description: "text-gray-600 dark:text-gray-200 text-lg leading-relaxed font-medium",
        fieldLabel: "block text-sm font-bold text-gray-800 dark:text-white mb-2",
        input: "w-full px-4 py-3 border border-gray-300 dark:border-primary-500/40 dark:bg-primary-800/20 dark:text-white rounded-xl bg-gradient-to-r from-white to-gray-50 dark:from-primary-800/20 dark:to-primary-700/20 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-400 transition-all duration-300 hover:shadow-md focus:shadow-lg backdrop-blur-sm",
        submitButton: "w-full text-lg py-4 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 font-bold shadow-lg hover:shadow-xl border border-primary-400/50",
        formSpacing: "space-y-6"
      };
    }
    return selectedTheme.styles;
  };

const getThemeClasses = () => {
    return window.FormValidation.getThemeClasses(selectedTheme);
  };

  // Export render field function for standalone forms
  window.FormValidation = window.FormValidation || {};
window.FormValidation.renderField = (field, formData, validationErrors, handleInputChange) => {
    const themeClasses = window.FormValidation.getThemeClasses();
    const hasError = validationErrors[field.id] && validationErrors[field.id].length > 0;
    const inputClasses = `${themeClasses.input} ${hasError ? 'border-red-400 focus:ring-red-500 focus:border-red-500 bg-gradient-to-r from-red-50 to-white dark:from-red-900/10 dark:to-gray-800' : ''}`;
    switch (field.type) {
      case "text":
        return `
          <div>
            <input
              type="text"
              id="${field.id}"
              placeholder="${field.placeholder || 'Enter text...'}"
              value="${formData[field.id] || ''}"
              class="${inputClasses}"
              ${field.minLength ? `minlength="${field.minLength}"` : ''}
              ${field.maxLength ? `maxlength="${field.maxLength}"` : ''}
              ${field.pattern ? `pattern="${field.pattern}"` : ''}
            />
            ${hasError ? `<div class="mt-2 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 p-2 rounded-lg">${validationErrors[field.id].join('<br>')}</div>` : ''}
          </div>
        `;
      case "email":
        return `
          <div>
            <input
              type="email"
              id="${field.id}"
              placeholder="${field.placeholder || 'Enter email address...'}"
              value="${formData[field.id] || ''}"
              class="${inputClasses}"
            />
            ${hasError ? `<div class="mt-2 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 p-2 rounded-lg">${validationErrors[field.id].join('<br>')}</div>` : ''}
          </div>
        `;
      case "phone":
        return `
          <div>
            <input
              type="tel"
              id="${field.id}"
              placeholder="${field.placeholder || 'Enter phone number...'}"
              value="${formData[field.id] || ''}"
              class="${inputClasses}"
            />
            ${hasError ? `<div class="mt-2 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 p-2 rounded-lg">${validationErrors[field.id].join('<br>')}</div>` : ''}
          </div>
        `;
      case "url":
        return `
          <div>
            <input
              type="url"
              id="${field.id}"
              placeholder="${field.placeholder || 'https://example.com'}"
              value="${formData[field.id] || ''}"
              class="${inputClasses}"
            />
            ${hasError ? `<div class="mt-2 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 p-2 rounded-lg">${validationErrors[field.id].join('<br>')}</div>` : ''}
          </div>
        `;
      case "textarea":
        return `
          <div>
            <textarea
              id="${field.id}"
              placeholder="${field.placeholder || 'Enter your text here...'}"
              class="${inputClasses} resize-none"
              rows="${field.rows || 3}"
              ${field.minLength ? `minlength="${field.minLength}"` : ''}
              ${field.maxLength ? `maxlength="${field.maxLength}"` : ''}
            >${formData[field.id] || ''}</textarea>
            ${hasError ? `<div class="mt-2 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 p-2 rounded-lg">${validationErrors[field.id].join('<br>')}</div>` : ''}
          </div>
        `;
      case "number":
        return `
          <div>
            <input
              type="number"
              id="${field.id}"
              placeholder="${field.placeholder || 'Enter a number...'}"
              value="${formData[field.id] || ''}"
              class="${inputClasses}"
              ${field.min !== null ? `min="${field.min}"` : ''}
              ${field.max !== null ? `max="${field.max}"` : ''}
              step="${field.step || 1}"
            />
            ${hasError ? `<div class="mt-2 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 p-2 rounded-lg">${validationErrors[field.id].join('<br>')}</div>` : ''}
          </div>
        `;
      case "file":
        return `
          <div>
            <input
              type="file"
              id="${field.id}"
              ${field.accept ? `accept="${field.accept}"` : ''}
              ${field.multiple ? 'multiple' : ''}
              class="${inputClasses}"
            />
            ${field.maxSize ? `<p class="mt-2 text-xs text-gray-500 bg-blue-50 dark:bg-blue-900/20 p-2 rounded-lg">Maximum file size: ${field.maxSize}MB</p>` : ''}
            ${hasError ? `<div class="mt-2 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 p-2 rounded-lg">${validationErrors[field.id].join('<br>')}</div>` : ''}
          </div>
        `;
      case "dropdown":
        return `
          <div>
            <select
              id="${field.id}"
              class="${inputClasses}"
            >
              <option value="">Select an option...</option>
              ${field.options?.map(option => `<option value="${option}" ${formData[field.id] === option ? 'selected' : ''}>${option}</option>`).join('') || ''}
            </select>
            ${hasError ? `<div class="mt-2 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 p-2 rounded-lg">${validationErrors[field.id].join('<br>')}</div>` : ''}
          </div>
        `;
      case "multiselect":
        return `
          <div>
            <select
              id="${field.id}"
              multiple
              size="4"
              class="${inputClasses}"
            >
              ${field.options?.map(option => {
                const selected = Array.isArray(formData[field.id]) && formData[field.id].includes(option);
                return `<option value="${option}" ${selected ? 'selected' : ''}>${option}</option>`;
              }).join('') || ''}
            </select>
            ${field.maxSelections ? `<p class="mt-2 text-xs text-gray-500 bg-blue-50 dark:bg-blue-900/20 p-2 rounded-lg">Maximum ${field.maxSelections} selections</p>` : ''}
            ${hasError ? `<div class="mt-2 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 p-2 rounded-lg">${validationErrors[field.id].join('<br>')}</div>` : ''}
          </div>
        `;
      default:
        return '';
    }
  };
  const renderField = (field) => {
const themeClasses = getThemeClasses();
const hasError = validationErrors[field.id] && validationErrors[field.id].length > 0;
    const inputClasses = `${themeClasses.input} ${hasError ? 'border-red-400 focus:ring-red-500 focus:border-red-500 bg-gradient-to-r from-red-50 to-white dark:from-red-900/20 dark:to-primary-800/10' : ''}`;
    
switch (field.type) {
      case "text":
        return (
          <div>
            <input
              type="text"
              id={field.id}
              placeholder={field.placeholder || "Enter text..."}
              value={formData[field.id] || ""}
              onChange={(e) => handleInputChange(field.id, e.target.value)}
              className={inputClasses}
              minLength={field.minLength}
              maxLength={field.maxLength}
              pattern={field.pattern}
            />
{hasError && (
              <div className="mt-2 text-sm text-red-600 dark:text-red-300 bg-red-50 dark:bg-red-900/30 p-3 rounded-lg border border-red-200 dark:border-red-700/50 font-medium">
                {validationErrors[field.id].map((error, idx) => (
                  <div key={idx}>{error}</div>
                ))}
              </div>
            )}
          </div>
        );
      case "email":
        return (
          <div>
            <input
              type="email"
              id={field.id}
              placeholder={field.placeholder || "Enter email address..."}
              value={formData[field.id] || ""}
              onChange={(e) => handleInputChange(field.id, e.target.value)}
              className={inputClasses}
            />
{hasError && (
              <div className="mt-2 text-sm text-red-600 dark:text-red-300 bg-red-50 dark:bg-red-900/30 p-3 rounded-lg border border-red-200 dark:border-red-700/50 font-medium">
                {validationErrors[field.id].map((error, idx) => (
                  <div key={idx}>{error}</div>
                ))}
              </div>
            )}
          </div>
        );
      case "phone":
        return (
          <div>
            <input
              type="tel"
              id={field.id}
              placeholder={field.placeholder || "Enter phone number..."}
              value={formData[field.id] || ""}
              onChange={(e) => handleInputChange(field.id, e.target.value)}
              className={inputClasses}
            />
{hasError && (
              <div className="mt-2 text-sm text-red-600 dark:text-red-300 bg-red-50 dark:bg-red-900/30 p-3 rounded-lg border border-red-200 dark:border-red-700/50 font-medium">
                {validationErrors[field.id].map((error, idx) => (
                  <div key={idx}>{error}</div>
                ))}
              </div>
            )}
          </div>
        );
      case "url":
        return (
          <div>
            <input
              type="url"
              id={field.id}
              placeholder={field.placeholder || "https://example.com"}
              value={formData[field.id] || ""}
              onChange={(e) => handleInputChange(field.id, e.target.value)}
              className={inputClasses}
            />
{hasError && (
              <div className="mt-2 text-sm text-red-600 dark:text-red-300 bg-red-50 dark:bg-red-900/30 p-3 rounded-lg border border-red-200 dark:border-red-700/50 font-medium">
                {validationErrors[field.id].map((error, idx) => (
                  <div key={idx}>{error}</div>
                ))}
              </div>
            )}
          </div>
        );
      case "textarea":
        return (
          <div>
            <textarea
              id={field.id}
              placeholder={field.placeholder || "Enter your text here..."}
              value={formData[field.id] || ""}
              onChange={(e) => handleInputChange(field.id, e.target.value)}
              className={`${inputClasses} resize-none`}
              rows={field.rows || 3}
              minLength={field.minLength}
              maxLength={field.maxLength}
            />
{hasError && (
              <div className="mt-2 text-sm text-red-600 dark:text-red-300 bg-red-50 dark:bg-red-900/30 p-3 rounded-lg border border-red-200 dark:border-red-700/50 font-medium">
                {validationErrors[field.id].map((error, idx) => (
                  <div key={idx}>{error}</div>
                ))}
              </div>
            )}
          </div>
        );
      case "number":
        return (
          <div>
            <input
              type="number"
              id={field.id}
              placeholder={field.placeholder || "Enter a number..."}
              value={formData[field.id] || ""}
              onChange={(e) => handleInputChange(field.id, e.target.value)}
              className={inputClasses}
              min={field.min}
              max={field.max}
              step={field.step || 1}
/>
            {hasError && (
              <div className="mt-2 text-sm text-red-600 dark:text-red-300 bg-red-50 dark:bg-red-900/30 p-3 rounded-lg border border-red-200 dark:border-red-700/50 font-medium">
                {validationErrors[field.id].map((error, idx) => (
                  <div key={idx}>{error}</div>
                ))}
              </div>
            )}
          </div>
        );
      case "file":
        return (
          <div>
            <input
              type="file"
              id={field.id}
              accept={field.accept}
              multiple={field.multiple}
              onChange={(e) => handleInputChange(field.id, e.target.value, e.target.files)}
              className={inputClasses}
            />
{field.maxSize && (
              <p className="mt-2 text-xs text-gray-600 dark:text-gray-200 bg-primary-50 dark:bg-primary-900/30 p-2 rounded-lg border border-primary-200 dark:border-primary-600/40 font-medium">
                Maximum file size: {field.maxSize}MB
              </p>
            )}
{hasError && (
              <div className="mt-2 text-sm text-red-600 dark:text-red-300 bg-red-50 dark:bg-red-900/30 p-3 rounded-lg border border-red-200 dark:border-red-700/50 font-medium">
                {validationErrors[field.id].map((error, idx) => (
                  <div key={idx}>{error}</div>
                ))}
              </div>
            )}
          </div>
        );
      case "dropdown":
        return (
          <div>
            <select
              id={field.id}
              value={formData[field.id] || ""}
              onChange={(e) => handleInputChange(field.id, e.target.value)}
              className={inputClasses}
            >
              <option value="">Select an option...</option>
              {field.options?.map((option, idx) => (
                <option key={idx} value={option}>
                  {option}
                </option>
              ))}
            </select>
            {hasError && (
<div className="mt-2 text-sm text-red-600 dark:text-red-300 bg-red-50 dark:bg-red-900/30 p-3 rounded-lg border border-red-200 dark:border-red-700/50 font-medium">
                {validationErrors[field.id].map((error, idx) => (
                  <div key={idx}>{error}</div>
                ))}
              </div>
            )}
          </div>
        );
      case "multiselect":
        return (
          <div>
            <select
              id={field.id}
              multiple
              size="4"
              value={Array.isArray(formData[field.id]) ? formData[field.id] : []}
              onChange={(e) => {
                const selectedValues = Array.from(e.target.selectedOptions, option => option.value);
                if (field.maxSelections && selectedValues.length > field.maxSelections) {
                  toast.error(`Maximum ${field.maxSelections} selections allowed`);
                  return;
                }
                handleInputChange(field.id, selectedValues);
              }}
              className={inputClasses}
            >
              {field.options?.map((option, idx) => (
                <option key={idx} value={option}>
                  {option}
                </option>
              ))}
            </select>
{field.maxSelections && (
              <p className="mt-2 text-xs text-gray-600 dark:text-gray-200 bg-primary-50 dark:bg-primary-900/30 p-2 rounded-lg border border-primary-200 dark:border-primary-600/40 font-medium">
                Maximum {field.maxSelections} selections
              </p>
            )}
            {hasError && (
<div className="mt-2 text-sm text-red-600 dark:text-red-300 bg-red-50 dark:bg-red-900/30 p-3 rounded-lg border border-red-200 dark:border-red-700/50 font-medium">
                {validationErrors[field.id].map((error, idx) => (
                  <div key={idx}>{error}</div>
                ))}
              </div>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  if (fields.length === 0) {
return (
<div className="w-full h-full bg-white dark:bg-primary-900/20 rounded-lg shadow-lg border border-gray-200 dark:border-primary-500/40 p-6 transition-colors duration-200">
        <div className="flex flex-col items-center justify-center h-full text-center">
          <div className="w-16 h-16 mb-4 rounded-full bg-gradient-to-br from-primary-100 dark:from-primary-500/40 to-primary-200 dark:to-primary-600/50 flex items-center justify-center shadow-lg dark:shadow-primary-600/30">
            <ApperIcon name="Eye" className="w-8 h-8 text-primary-500 dark:text-white" />
          </div>
          <h3 className="text-xl font-bold text-gray-700 dark:text-white mb-2">
            Live Preview
          </h3>
          <p className="text-gray-500 dark:text-gray-200 max-w-md font-medium">
            Your form preview will appear here as you add fields to the canvas. Add some fields to get started!
          </p>
        </div>
      </div>
    );
  }

return (
<div className={`${getThemeClasses().container} animate-scale-in`}>
      {/* Header for preview mode */}
{isPreviewMode && (
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Form Preview - Test Mode
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-200 font-medium">
              Test your form as users will experience it
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="secondary"
              onClick={handleFormReset}
              className="flex items-center space-x-2"
            >
              <ApperIcon name="RefreshCw" className="w-4 h-4" />
              <span>Reset Form</span>
            </Button>
            <Button
              variant="primary"
              onClick={onBackToEditor}
              className="flex items-center space-x-2"
            >
              <ApperIcon name="ArrowLeft" className="w-4 h-4" />
              <span>Back to Editor</span>
            </Button>
          </div>
        </div>
      )}

      {/* Regular preview header for build mode */}
{!isPreviewMode && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
<h2 className="text-2xl font-bold bg-gradient-to-r from-primary-500 via-primary-600 to-primary-700 dark:from-primary-300 dark:via-primary-200 dark:to-white bg-clip-text text-transparent">
              Live Preview
            </h2>
            <div className="flex items-center space-x-2 text-xs text-green-600 dark:text-green-200 bg-green-50 dark:bg-green-600/30 px-3 py-1 rounded-full border border-green-200 dark:border-green-500/40 font-bold shadow-sm">
              <div className="w-2.5 h-2.5 bg-green-500 dark:bg-green-400 rounded-full animate-pulse"></div>
              <span className="font-bold">Live</span>
            </div>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-200 bg-primary-50 dark:bg-primary-600/20 px-4 py-2 rounded-lg border border-primary-200 dark:border-primary-500/40 font-medium">
            This is how your form will look to users
          </p>
        </div>
      )}

{/* Form Submission Success Display */}
{isSubmitted && isPreviewMode && (
        <div className="mb-8 p-8 bg-gradient-to-br from-green-50 via-emerald-50 to-green-100 dark:from-green-900/40 dark:via-emerald-900/30 dark:to-green-900/40 border border-green-200 dark:border-green-700/50 rounded-2xl animate-slide-up shadow-2xl dark:shadow-green-900/20">
          <div className="flex items-start space-x-4">
            <div className="animate-scale-in bg-green-100 dark:bg-green-800/60 p-2 rounded-full shadow-lg" style={{ animationDelay: '0.2s' }}>
              <ApperIcon name="CheckCircle" className="w-8 h-8 text-green-600 dark:text-green-300" />
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-green-800 dark:text-green-200 mb-3 animate-slide-up" style={{ animationDelay: '0.1s' }}>
                Form Submitted Successfully!
              </h3>
              <p className="text-green-700 dark:text-green-200 mb-6 text-lg leading-relaxed animate-slide-up font-medium" style={{ animationDelay: '0.2s' }}>
                {formSettings.successMessage || "Thank you! Your form has been submitted successfully."}
              </p>
              
              {submittedData && Object.keys(submittedData).length > 0 && (
                <div className="bg-white dark:bg-primary-800/20 rounded-xl p-6 border border-green-200 dark:border-green-700/50 animate-slide-up shadow-xl backdrop-blur-sm" style={{ animationDelay: '0.3s' }}>
                  <h4 className="font-bold text-gray-900 dark:text-white mb-4 text-lg">Submitted Data:</h4>
                  <div className="space-y-3">
                    {Object.entries(submittedData).map(([label, value], index) => (
                      <div 
                        key={label} 
                        className="flex justify-between items-center py-3 px-4 bg-gray-50 dark:bg-primary-700/30 rounded-lg border border-gray-100 dark:border-primary-600/30 animate-slide-up"
                        style={{ animationDelay: `${0.4 + (index * 0.05)}s` }}
                      >
                        <span className="text-sm font-bold text-gray-700 dark:text-gray-200">{label}:</span>
                        <span className="text-sm text-gray-900 dark:text-white max-w-xs truncate bg-white dark:bg-primary-800/40 px-2 py-1 rounded border dark:border-primary-600/40 font-medium">
                          {Array.isArray(value) ? value.join(', ') : value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

<div className="preview-form">
<form onSubmit={handleSubmit} className="space-y-8">
<div className="mb-8">
            <h1 className={getThemeClasses().title}>
              {formSettings.title || "Preview Form"}
            </h1>
            {formSettings.description && (
              <p className={getThemeClasses().description}>{formSettings.description}</p>
            )}
            {!formSettings.description && (
              <p className={getThemeClasses().description}>Please fill out the form below.</p>
            )}
          </div>

          {fields.map((field) => (
            <div key={field.id} className="space-y-2">
<label 
                htmlFor={field.id} 
                className={getThemeClasses().fieldLabel}
              >
                {field.label || "Untitled Field"}
                {field.required && <span className="text-red-500 dark:text-red-400 ml-1 text-base font-bold">*</span>}
              </label>
              {renderField(field)}
              {field.description && (
                <p className="text-sm text-gray-600 dark:text-gray-200 mt-1 font-medium">
                  {field.description}
                </p>
              )}
            </div>
          ))}

<div className="pt-6 border-t border-gray-200 dark:border-primary-600/40">
            <Button type="submit" className={getThemeClasses().submitButton}>
              {formSettings.submitButtonText || "Submit Form"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormPreview;