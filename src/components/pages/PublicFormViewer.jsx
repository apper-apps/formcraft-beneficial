import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Button from "@/components/atoms/Button";
import formService from "@/services/api/formService";
import { cn } from "@/utils/cn";

const PublicFormViewer = () => {
  const { shareId } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formValues, setFormValues] = useState({});

  useEffect(() => {
    loadSharedForm();
  }, [shareId]);

  const loadSharedForm = async () => {
    try {
      setLoading(true);
      const result = await formService.getSharedForm(shareId);
      if (result.success) {
        setFormData(result.form);
        // Initialize form values
        const initialValues = {};
        result.form.fields.forEach(field => {
          initialValues[field.id] = field.type === 'checkbox' ? false : '';
        });
        setFormValues(initialValues);
      }
    } catch (error) {
      console.error('Error loading shared form:', error);
      setError('Form not found or no longer available');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (fieldId, value) => {
    setFormValues(prev => ({
      ...prev,
      [fieldId]: value
    }));
  };

const handleSubmit = async (e, retryCount = 0) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Import submission service
      const { default: formSubmissionService } = await import('@/services/api/formSubmissionService');
      
      // Prepare submission data
      const submissionData = {
        formId: formData.shareId,
        formTitle: formData.title,
        data: formValues,
        userAgent: navigator.userAgent,
        referrer: document.referrer,
        metadata: {
          fieldCount: formData.fields?.length || 0,
          hasFileUploads: formData.fields?.some(field => field.type === 'file') || false,
          submissionSource: "public_form_viewer",
          retryCount
        }
      };

      // Save submission to database
      const savedSubmission = await formSubmissionService.create(submissionData);
      
      setSubmitted(true);
      toast.success('Form submitted successfully!');
      
      // Log success for debugging
      console.log('Form submission saved:', savedSubmission);
      
    } catch (error) {
      console.error('Error submitting form:', error);
      
      // Determine error type and provide appropriate feedback
      let errorMessage = 'Failed to submit form. Please try again.';
      let showRetry = false;
      
      // Network connectivity issues
      if (!navigator.onLine) {
        errorMessage = 'No internet connection. Please check your connection and try again.';
        showRetry = true;
      }
      // Network request failed (fetch/xhr errors)
      else if (error.name === 'NetworkError' || error.message.includes('fetch') || error.code === 'NETWORK_ERROR') {
        errorMessage = 'Network error occurred. Please check your connection and try again.';
        showRetry = true;
      }
      // Service unavailable or server errors
      else if (error.status >= 500 || error.message.includes('Service unavailable')) {
        errorMessage = 'Server temporarily unavailable. Please try again in a few moments.';
        showRetry = true;
      }
      // Validation or client errors
      else if (error.status >= 400 && error.status < 500) {
        errorMessage = error.message || 'Invalid form data. Please check your inputs and try again.';
        showRetry = false;
      }
      // Storage quota exceeded
      else if (error.name === 'QuotaExceededError') {
        errorMessage = 'Storage quota exceeded. Please clear your browser storage and try again.';
        showRetry = false;
      }
      // File upload errors
      else if (error.message.includes('file') || error.message.includes('upload')) {
        errorMessage = 'File upload failed. Please check file sizes and try again.';
        showRetry = true;
      }
      // Generic retry for unknown errors
      else {
        showRetry = retryCount < 2;
        if (showRetry) {
          errorMessage = `Submission failed (attempt ${retryCount + 1}/3). Retrying...`;
        } else {
          errorMessage = 'Form submission failed after multiple attempts. Please try again later.';
        }
      }

      // Show error toast with retry option if applicable
      if (showRetry && retryCount < 2) {
        toast.error(
          <div className="flex flex-col gap-2">
            <span>{errorMessage}</span>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                toast.dismiss();
                setTimeout(() => handleSubmit(e, retryCount + 1), 1000);
              }}
              className="text-xs"
            >
              Retry Now
            </Button>
          </div>,
          {
            autoClose: 8000,
            closeButton: true
          }
        );
      } else {
        toast.error(errorMessage, {
          autoClose: 6000
        });
      }

      // Auto-retry for network errors (with exponential backoff)
      if (showRetry && retryCount < 2 && (
        !navigator.onLine || 
        error.name === 'NetworkError' || 
        error.status >= 500
      )) {
        const retryDelay = Math.pow(2, retryCount) * 1000; // 1s, 2s, 4s
        setTimeout(() => {
          handleSubmit(e, retryCount + 1);
        }, retryDelay);
      }
      
    } finally {
      setSubmitting(false);
    }
  };
const renderField = (field) => {
    const baseInputClasses = "w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-gradient-to-r from-white to-gray-50 dark:from-gray-700 dark:to-gray-650 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-400 dark:text-white transition-all duration-300 hover:shadow-md focus:shadow-lg backdrop-blur-sm";

    switch (field.type) {
      case 'text':
      case 'email':
      case 'tel':
        return (
          <input
            type={field.type}
            id={field.id}
            name={field.id}
            value={formValues[field.id] || ''}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            placeholder={field.placeholder}
            required={field.required}
            className={baseInputClasses}
          />
        );
      
      case 'textarea':
        return (
          <textarea
            id={field.id}
            name={field.id}
            value={formValues[field.id] || ''}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            placeholder={field.placeholder}
            required={field.required}
            rows={4}
            className={baseInputClasses}
          />
        );
      
      case 'select':
        return (
          <select
            id={field.id}
            name={field.id}
            value={formValues[field.id] || ''}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            required={field.required}
            className={baseInputClasses}
          >
            <option value="">Select an option</option>
            {field.options?.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
        );
      
      case 'radio':
        return (
          <div className="space-y-2">
            {field.options?.map((option, index) => (
              <label key={index} className="flex items-center space-x-2">
                <input
                  type="radio"
                  name={field.id}
                  value={option}
                  checked={formValues[field.id] === option}
                  onChange={(e) => handleInputChange(field.id, e.target.value)}
                  required={field.required}
                  className="text-primary-500 focus:ring-primary-500"
                />
                <span className="text-gray-700 dark:text-gray-300">{option}</span>
              </label>
            ))}
          </div>
        );
      
      case 'checkbox':
        return (
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              id={field.id}
              name={field.id}
              checked={formValues[field.id] || false}
              onChange={(e) => handleInputChange(field.id, e.target.checked)}
              required={field.required}
              className="text-primary-500 focus:ring-primary-500 rounded"
            />
            <span className="text-gray-700 dark:text-gray-300">{field.label}</span>
          </label>
        );
      
      case 'number':
        return (
          <input
            type="number"
            id={field.id}
            name={field.id}
            value={formValues[field.id] || ''}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            placeholder={field.placeholder}
            required={field.required}
            className={baseInputClasses}
          />
        );
      
      default:
        return null;
    }
  };

  if (loading) {
    return <Loading message="Loading form..." />;
  }

  if (error) {
    return (
      <Error
        message={error}
        action={
          <Button onClick={() => navigate('/')} variant="primary">
            Go to Form Builder
          </Button>
        }
      />
    );
  }

  if (submitted) {
    return (
<div className="min-h-screen bg-gray-50 dark:bg-gradient-to-br dark:from-dark-900 dark:via-dark-800 dark:to-dark-900 flex items-center justify-center p-4" style={{ 
  backgroundImage: 'linear-gradient(rgba(59, 130, 246, 0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(59, 130, 246, 0.02) 1px, transparent 1px), radial-gradient(circle at 25% 25%, rgba(59, 130, 246, 0.3) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(6, 182, 212, 0.3) 0%, transparent 50%)',
  backgroundSize: '50px 50px, 50px 50px, 100% 100%, 100% 100%'
}}>
        <div className="max-w-md w-full text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="w-20 h-20 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <ApperIcon name="Check" size={40} className="text-green-600 dark:text-green-400" />
          </motion.div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Thank You!
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Your form has been submitted successfully.
          </p>
          <Button onClick={() => navigate('/')} variant="primary">
            Create Your Own Form
          </Button>
        </div>
      </div>
    );
  }

  return (
<div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-dark-900 dark:via-dark-800 dark:to-dark-900 py-8" style={{ 
  backgroundImage: 'linear-gradient(rgba(59, 130, 246, 0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(59, 130, 246, 0.02) 1px, transparent 1px), radial-gradient(circle at 25% 25%, rgba(59, 130, 246, 0.3) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(6, 182, 212, 0.3) 0%, transparent 50%)',
  backgroundSize: '50px 50px, 50px 50px, 100% 100%, 100% 100%'
}}>
<div className="max-w-2xl mx-auto px-4">
<div className="bg-gradient-to-br from-white via-gray-50 to-white dark:from-dark-900/80 dark:via-dark-800/90 dark:to-dark-900/80 rounded-2xl shadow-2xl dark:shadow-primary-500/30 overflow-hidden border border-gray-200 dark:border-primary-500/30 backdrop-filter dark:backdrop-blur-lg">
          {/* Form Header */}
<div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold">{formData.title}</h1>
                <p className="text-primary-100 mt-1">
                  Fill out this form to submit your information
                </p>
              </div>
<Button
                onClick={() => navigate('/')}
                variant="ghost"
                size="sm"
                className="text-white hover:bg-primary-600 border-white"
              >
                <ApperIcon name="ExternalLink" size={16} className="mr-2" />
                Create Form
              </Button>
            </div>
          </div>

          {/* Form Content */}
<form onSubmit={handleSubmit} className="p-8 space-y-8">
            {formData.fields.map((field) => (
              <div key={field.id} className="space-y-3">
                {field.type !== 'checkbox' && (
                  <label
                    htmlFor={field.id}
                    className="block text-sm font-semibold text-gray-800 dark:text-gray-200"
                  >
                    {field.label}
                    {field.required && <span className="text-red-500 ml-1 text-base">*</span>}
                  </label>
                )}
                {renderField(field)}
                {field.description && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 p-3 rounded-lg border-l-4 border-blue-400">
                    {field.description}
                  </p>
                )}
</div>
            ))}

            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <Button
                type="submit"
                variant="primary"
                disabled={submitting}
                className="w-full flex items-center justify-center space-x-2 text-lg py-4"
              >
                {submitting && <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>}
                <span>{submitting ? 'Submitting...' : 'Submit Form'}</span>
              </Button>
            </div>
          </form>

          {/* Footer */}
<div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-primary-500/10 dark:to-primary-400/20 px-8 py-6 border-t border-gray-200 dark:border-primary-500/30 backdrop-filter dark:backdrop-blur-lg">
<div className="flex items-center justify-center text-sm text-gray-500 dark:text-purple-200">
              <span>Powered by</span>
              <Button
                onClick={() => navigate('/')}
                variant="ghost"
                size="sm"
                className="ml-1 text-primary-600 dark:text-primary-400 p-0 h-auto font-semibold"
              >
                FormCraft
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicFormViewer;