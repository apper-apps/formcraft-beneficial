import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Card from '@/components/atoms/Card';
import ApperIcon from '@/components/ApperIcon';
import { cn } from '@/utils/cn';

const FormManagementModal = ({ 
  isOpen, 
  onClose, 
  savedForms, 
  onLoadForm, 
  onRenameForm, 
  onDeleteForm,
  loading 
}) => {
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const handleStartEdit = (form) => {
    setEditingId(form.id);
    setEditingName(form.name);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingName('');
  };

  const handleSaveEdit = async () => {
    if (editingName.trim() && editingId) {
      try {
        await onRenameForm(editingId, editingName.trim());
        setEditingId(null);
        setEditingName('');
      } catch (error) {
        console.error('Failed to rename form:', error);
      }
    }
  };

  const handleDeleteClick = (formId) => {
    setDeleteConfirmId(formId);
  };

  const handleConfirmDelete = async () => {
    if (deleteConfirmId) {
      try {
        await onDeleteForm(deleteConfirmId);
        setDeleteConfirmId(null);
      } catch (error) {
        console.error('Failed to delete form:', error);
      }
    }
  };

  const handleCancelDelete = () => {
    setDeleteConfirmId(null);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSaveEdit();
    } else if (e.key === 'Escape') {
      handleCancelEdit();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.2 }}
className="bg-white dark:bg-dark-900/95 rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] overflow-hidden border dark:border-primary-500/30 backdrop-filter dark:backdrop-blur-lg"
      >
<div className="flex items-center justify-between p-6 border-b dark:border-primary-500/30">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Load Saved Form</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
className="p-1 hover:bg-gray-100 dark:hover:bg-primary-500/20 rounded-md backdrop-filter dark:backdrop-blur-lg"
          >
            <ApperIcon name="X" size={20} />
          </Button>
        </div>

        <div className="p-6 max-h-96 overflow-y-auto custom-scrollbar">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
            </div>
          ) : savedForms.length === 0 ? (
            <div className="text-center py-12">
              <ApperIcon name="FileText" size={48} className="mx-auto mb-4 text-gray-400" />
              <p className="text-gray-500 mb-2">No saved forms found</p>
              <p className="text-sm text-gray-400">Create and save your first form to get started</p>
            </div>
          ) : (
            <div className="space-y-3">
              {savedForms.map((form) => (
                <Card key={form.id} className="p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      {editingId === form.id ? (
                        <div className="flex items-center space-x-2">
                          <Input
                            value={editingName}
                            onChange={(e) => setEditingName(e.target.value)}
                            onKeyDown={handleKeyPress}
                            className="flex-1"
                            placeholder="Form name"
                            autoFocus
                          />
                          <Button
                            size="sm"
                            onClick={handleSaveEdit}
                            disabled={!editingName.trim()}
                            className="px-3"
                          >
                            <ApperIcon name="Check" size={16} />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={handleCancelEdit}
                            className="px-3"
                          >
                            <ApperIcon name="X" size={16} />
                          </Button>
                        </div>
                      ) : (
                        <div>
                          <h3 className="font-medium text-gray-900 truncate">{form.name}</h3>
                          <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
                            <span className="flex items-center">
                              <ApperIcon name="Calendar" size={14} className="mr-1" />
                              {format(new Date(form.createdAt), 'MMM d, yyyy')}
                            </span>
                            <span className="flex items-center">
                              <ApperIcon name="Layout" size={14} className="mr-1" />
                              {form.fields.length} field{form.fields.length !== 1 ? 's' : ''}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    {editingId !== form.id && (
                      <div className="flex items-center space-x-2 ml-4">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => onLoadForm(form)}
                          className="flex items-center space-x-1"
                        >
                          <ApperIcon name="FolderOpen" size={16} />
                          <span>Load</span>
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleStartEdit(form)}
                          className="p-2"
                        >
                          <ApperIcon name="Edit2" size={16} />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDeleteClick(form.id)}
                          className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <ApperIcon name="Trash2" size={16} />
                        </Button>
                      </div>
                    )}
                  </div>

                  {deleteConfirmId === form.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-3 pt-3 border-t border-red-100 bg-red-50 -m-4 mt-3 p-4 rounded-b"
                    >
                      <p className="text-sm text-red-600 mb-3">
                        Are you sure you want to delete "{form.name}"? This action cannot be undone.
                      </p>
                      <div className="flex justify-end space-x-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={handleCancelDelete}
                        >
                          Cancel
                        </Button>
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={handleConfirmDelete}
                          className="bg-red-500 hover:bg-red-600 text-white"
                        >
                          Delete
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </Card>
              ))}
            </div>
          )}
        </div>

<div className="flex justify-end space-x-3 p-6 border-t dark:border-primary-500/30 bg-gray-50 dark:bg-primary-500/10 backdrop-filter dark:backdrop-blur-lg">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default FormManagementModal;