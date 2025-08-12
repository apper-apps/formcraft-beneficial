import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import formService from '@/services/api/formService';
import { cn } from '@/utils/cn';

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Simulate form submission
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, you would submit to your backend
      console.log('Form submitted:', {
        formId: formData.shareId,
        title: formData.title,
        values: formValues,
        submittedAt: new Date().toISOString()
      });

      setSubmitted(true);
      toast.success('Form submitted successfully!');
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Failed to submit form. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const renderField = (field) => {
    const baseInputClasses = "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white";

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
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          {/* Form Header */}
          <div className="bg-primary-500 text-white p-6">
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
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {formData.fields.map((field) => (
              <div key={field.id} className="space-y-2">
                {field.type !== 'checkbox' && (
                  <label
                    htmlFor={field.id}
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    {field.label}
                    {field.required && <span className="text-red-500 ml-1">*</span>}
                  </label>
                )}
                {renderField(field)}
                {field.description && (
                  <p className="text-xs text-gray-500 dark:text-gray-400">
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
                className="w-full flex items-center justify-center space-x-2"
              >
                {submitting && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>}
                <span>{submitting ? 'Submitting...' : 'Submit Form'}</span>
              </Button>
            </div>
          </form>

          {/* Footer */}
          <div className="bg-gray-50 dark:bg-gray-800 px-6 py-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-center text-sm text-gray-500 dark:text-gray-400">
              <span>Powered by</span>
              <Button
                onClick={() => navigate('/')}
                variant="ghost"
                size="sm"
                className="ml-1 text-primary-600 dark:text-primary-400 p-0 h-auto font-medium"
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