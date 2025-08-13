import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import ApperIcon from '@/components/ApperIcon';
import formService from '@/services/api/formService';

const ShareFormModal = ({ isOpen, onClose, formData }) => {
  const [shareUrl, setShareUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen && formData) {
      generateShareLink();
    }
    
    // Reset copied state when modal closes
    if (!isOpen) {
      setCopied(false);
      setShareUrl('');
    }
  }, [isOpen, formData]);

  const generateShareLink = async () => {
    setLoading(true);
    try {
      const result = await formService.generateShareableLink(formData);
      if (result.success) {
        setShareUrl(result.shareUrl);
        toast.success('Shareable link generated successfully!');
      }
    } catch (error) {
      console.error('Error generating share link:', error);
      toast.error('Failed to generate shareable link');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success('Link copied to clipboard!');
      
      // Reset copied state after 3 seconds
      setTimeout(() => setCopied(false), 3000);
    } catch (error) {
      console.error('Failed to copy link:', error);
      toast.error('Failed to copy link');
    }
  };

  const handleOpenInNewTab = () => {
    window.open(shareUrl, '_blank');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.2 }}
className="bg-white dark:bg-dark-900/95 rounded-lg shadow-xl w-full max-w-lg overflow-hidden border dark:border-primary-500/30 backdrop-filter dark:backdrop-blur-lg"
      >
<div className="flex items-center justify-between p-6 border-b dark:border-primary-500/30">
          <div className="flex items-center space-x-3">
<div className="w-10 h-10 bg-primary-100 dark:bg-primary-500/20 rounded-lg flex items-center justify-center backdrop-filter dark:backdrop-blur-lg">
              <ApperIcon name="Share2" size={20} className="text-primary-600 dark:text-primary-400" />
            </div>
            <div>
<h2 className="text-xl font-semibold text-gray-900 dark:text-white">Share Form</h2>
              <p className="text-sm text-gray-500 dark:text-gray-300">Generate a public link to share your form</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
className="p-1 hover:bg-gray-100 dark:hover:bg-primary-500/20 rounded-md backdrop-filter dark:backdrop-blur-lg"
          >
            <ApperIcon name="X" size={20} />
          </Button>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
              <span className="ml-3 text-gray-600 dark:text-gray-400">Generating shareable link...</span>
            </div>
          ) : shareUrl ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Public Form URL
                </label>
                <div className="flex space-x-2">
                  <Input
                    value={shareUrl}
                    readOnly
                    className="flex-1 bg-gray-50 dark:bg-gray-700 text-sm font-mono"
                  />
                  <Button
                    onClick={handleCopyLink}
                    variant={copied ? "primary" : "secondary"}
                    className="px-4"
                  >
                    <ApperIcon 
                      name={copied ? "Check" : "Copy"} 
                      size={16} 
                      className={copied ? "text-white" : ""}
                    />
                  </Button>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Anyone with this link can view and submit your form
                </p>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <div className="flex items-start space-x-2">
                  <ApperIcon name="Info" size={16} className="text-blue-600 dark:text-blue-400 mt-0.5" />
                  <div className="text-sm">
                    <p className="text-blue-800 dark:text-blue-200 font-medium">Form Details</p>
                    <ul className="text-blue-700 dark:text-blue-300 mt-1 space-y-1">
                      <li>• Title: {formData?.settings?.title || 'Untitled Form'}</li>
                      <li>• Fields: {formData?.fields?.length || 0} field{formData?.fields?.length !== 1 ? 's' : ''}</li>
                      <li>• Theme: {formData?.theme?.name || 'Default'}</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="flex space-x-3">
                <Button
                  onClick={handleOpenInNewTab}
                  variant="secondary"
                  className="flex-1 flex items-center justify-center space-x-2"
                >
                  <ApperIcon name="ExternalLink" size={16} />
                  <span>Preview Form</span>
                </Button>
                <Button
                  onClick={handleCopyLink}
                  variant="primary"
                  className="flex-1 flex items-center justify-center space-x-2"
                >
                  <ApperIcon name={copied ? "Check" : "Copy"} size={16} />
                  <span>{copied ? 'Copied!' : 'Copy Link'}</span>
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <ApperIcon name="AlertCircle" size={48} className="mx-auto mb-4 text-red-400" />
              <p className="text-gray-600 dark:text-gray-400">Failed to generate shareable link</p>
              <Button onClick={generateShareLink} variant="primary" className="mt-4">
                Try Again
              </Button>
            </div>
          )}
        </div>

<div className="flex justify-end space-x-3 p-6 border-t dark:border-primary-500/30 bg-gray-50 dark:bg-primary-500/10 backdrop-filter dark:backdrop-blur-lg">
          <Button variant="ghost" onClick={onClose}>
            Close
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default ShareFormModal;