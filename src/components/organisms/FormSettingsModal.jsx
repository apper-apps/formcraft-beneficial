import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Card from '@/components/atoms/Card';
import ApperIcon from '@/components/ApperIcon';
import { cn } from '@/utils/cn';

const FormSettingsModal = ({ isOpen, onClose, settings, onSave }) => {
  const [formSettings, setFormSettings] = useState({
    title: settings?.title || 'Untitled Form',
    description: settings?.description || '',
    submitButtonText: settings?.submitButtonText || 'Submit Form',
    successMessage: settings?.successMessage || 'Thank you! Your form has been submitted successfully.',
    redirectAfterSubmission: settings?.redirectAfterSubmission || false,
    redirectUrl: settings?.redirectUrl || '',
    enableValidation: settings?.enableValidation || true,
    requireAllFields: settings?.requireAllFields || false,
    showProgressBar: settings?.showProgressBar || false,
    allowSaveDraft: settings?.allowSaveDraft || false
  });

  const handleInputChange = (field, value) => {
    setFormSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    onSave(formSettings);
    onClose();
  };

  const handleReset = () => {
    setFormSettings({
      title: 'Untitled Form',
      description: '',
      submitButtonText: 'Submit Form',
      successMessage: 'Thank you! Your form has been submitted successfully.',
      redirectAfterSubmission: false,
      redirectUrl: '',
      enableValidation: true,
      requireAllFields: false,
      showProgressBar: false,
      allowSaveDraft: false
    });
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-primary-50 rounded-lg">
                <ApperIcon name="Settings" className="w-5 h-5 text-primary-500" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Form Settings</h2>
                <p className="text-sm text-gray-500">Configure your form's appearance and behavior</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <ApperIcon name="X" className="w-5 h-5" />
            </Button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-8 overflow-y-auto max-h-[calc(90vh-140px)] custom-scrollbar">
            {/* Basic Information */}
            <Card className="p-6">
              <div className="flex items-center space-x-2 mb-4">
                <ApperIcon name="FileText" className="w-5 h-5 text-gray-600" />
                <h3 className="font-semibold text-gray-900">Basic Information</h3>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Form Title
                  </label>
                  <Input
                    value={formSettings.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="Enter form title"
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Form Description
                  </label>
                  <textarea
                    value={formSettings.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Enter form description (optional)"
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
                  />
                </div>
              </div>
            </Card>

            {/* Submit Button Configuration */}
            <Card className="p-6">
              <div className="flex items-center space-x-2 mb-4">
                <ApperIcon name="MousePointer" className="w-5 h-5 text-gray-600" />
                <h3 className="font-semibold text-gray-900">Submit Button</h3>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Button Text
                  </label>
                  <Input
                    value={formSettings.submitButtonText}
                    onChange={(e) => handleInputChange('submitButtonText', e.target.value)}
                    placeholder="Submit Form"
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Success Message
                  </label>
                  <textarea
                    value={formSettings.successMessage}
                    onChange={(e) => handleInputChange('successMessage', e.target.value)}
                    placeholder="Thank you! Your form has been submitted successfully."
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
                  />
                </div>
              </div>
            </Card>

            {/* Post-Submission Behavior */}
            <Card className="p-6">
              <div className="flex items-center space-x-2 mb-4">
                <ApperIcon name="ArrowRight" className="w-5 h-5 text-gray-600" />
                <h3 className="font-semibold text-gray-900">Post-Submission</h3>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Redirect after submission
                    </label>
                    <p className="text-xs text-gray-500">Redirect users to a specific URL after form submission</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleInputChange('redirectAfterSubmission', !formSettings.redirectAfterSubmission)}
                    className={cn(
                      "relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2",
                      formSettings.redirectAfterSubmission ? "bg-primary-500" : "bg-gray-300"
                    )}
                  >
                    <span
                      className={cn(
                        "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                        formSettings.redirectAfterSubmission ? "translate-x-6" : "translate-x-1"
                      )}
                    />
                  </button>
                </div>
                {formSettings.redirectAfterSubmission && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <Input
                      value={formSettings.redirectUrl}
                      onChange={(e) => handleInputChange('redirectUrl', e.target.value)}
                      placeholder="https://example.com/thank-you"
                      className="w-full"
                    />
                  </motion.div>
                )}
              </div>
            </Card>

            {/* Validation Settings */}
            <Card className="p-6">
              <div className="flex items-center space-x-2 mb-4">
                <ApperIcon name="Shield" className="w-5 h-5 text-gray-600" />
                <h3 className="font-semibold text-gray-900">Validation Settings</h3>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Enable form validation
                    </label>
                    <p className="text-xs text-gray-500">Validate fields before allowing submission</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleInputChange('enableValidation', !formSettings.enableValidation)}
                    className={cn(
                      "relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2",
                      formSettings.enableValidation ? "bg-primary-500" : "bg-gray-300"
                    )}
                  >
                    <span
                      className={cn(
                        "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                        formSettings.enableValidation ? "translate-x-6" : "translate-x-1"
                      )}
                    />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Require all fields
                    </label>
                    <p className="text-xs text-gray-500">Make all form fields mandatory</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleInputChange('requireAllFields', !formSettings.requireAllFields)}
                    className={cn(
                      "relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2",
                      formSettings.requireAllFields ? "bg-primary-500" : "bg-gray-300"
                    )}
                  >
                    <span
                      className={cn(
                        "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                        formSettings.requireAllFields ? "translate-x-6" : "translate-x-1"
                      )}
                    />
                  </button>
                </div>
              </div>
            </Card>

            {/* Advanced Features */}
            <Card className="p-6">
              <div className="flex items-center space-x-2 mb-4">
                <ApperIcon name="Zap" className="w-5 h-5 text-gray-600" />
                <h3 className="font-semibold text-gray-900">Advanced Features</h3>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Show progress bar
                    </label>
                    <p className="text-xs text-gray-500">Display completion progress for multi-step forms</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleInputChange('showProgressBar', !formSettings.showProgressBar)}
                    className={cn(
                      "relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2",
                      formSettings.showProgressBar ? "bg-primary-500" : "bg-gray-300"
                    )}
                  >
                    <span
                      className={cn(
                        "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                        formSettings.showProgressBar ? "translate-x-6" : "translate-x-1"
                      )}
                    />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Allow save as draft
                    </label>
                    <p className="text-xs text-gray-500">Let users save and continue later</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleInputChange('allowSaveDraft', !formSettings.allowSaveDraft)}
                    className={cn(
                      "relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2",
                      formSettings.allowSaveDraft ? "bg-primary-500" : "bg-gray-300"
                    )}
                  >
                    <span
                      className={cn(
                        "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                        formSettings.allowSaveDraft ? "translate-x-6" : "translate-x-1"
                      )}
                    />
                  </button>
                </div>
              </div>
            </Card>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50">
            <Button
              variant="ghost"
              onClick={handleReset}
              className="text-gray-600 hover:text-gray-800"
            >
              Reset to Defaults
            </Button>
            <div className="flex items-center space-x-3">
              <Button
                variant="secondary"
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleSave}
                className="flex items-center space-x-2"
              >
                <ApperIcon name="Save" className="w-4 h-4" />
                <span>Save Settings</span>
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default FormSettingsModal;