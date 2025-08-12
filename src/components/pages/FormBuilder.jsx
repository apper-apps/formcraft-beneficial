import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "react-toastify";
import JSZip from "jszip";
import FormCanvas from "@/components/organisms/FormCanvas";
import Header from "@/components/organisms/Header";
import FormSettingsModal from "@/components/organisms/FormSettingsModal";
import FieldToolbar from "@/components/organisms/FieldToolbar";
import FieldConfigurationPanel from "@/components/organisms/FieldConfigurationPanel";
import FormPreview from "@/components/organisms/FormPreview";
import fieldTypesData from "@/services/mockData/fieldTypes.json";
import formsData from "@/services/mockData/forms.json";
import themeTemplateService from "@/services/api/themeTemplateService";
import localStorageService from "@/services/api/localStorageService";
import formService from "@/services/api/formService";

const FormBuilder = () => {
const [fields, setFields] = useState([]);
  const [selectedFieldId, setSelectedFieldId] = useState(null);
  const [draggedField, setDraggedField] = useState(null);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [selectedFormTheme, setSelectedFormTheme] = useState(themeTemplateService.getDefaultTheme());
  const [formSettings, setFormSettings] = useState({
    title: "Untitled Form",
    description: "",
    submitButtonText: "Submit Form",
    successMessage: "Thank you! Your form has been submitted successfully.",
    redirectAfterSubmission: false,
    redirectUrl: "",
    enableValidation: true,
    requireAllFields: false,
    showProgressBar: false,
    allowSaveDraft: false
  });
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isManagementModalOpen, setIsManagementModalOpen] = useState(false);
  const [savedForms, setSavedForms] = useState([]);
const [managementLoading, setManagementLoading] = useState(false);
  const [availableThemes] = useState(themeTemplateService.getAll());
  
  const handleThemeSelect = (theme) => {
    setSelectedFormTheme(theme);
    toast.success(`Theme changed to ${theme.name}!`);
  };

  const handleDragStart = (fieldType) => {
    setDraggedField(fieldType);
  };

  const handleFieldAdd = (newField, targetIndex = fields.length) => {
    const updatedFields = [...fields];
    updatedFields.splice(targetIndex, 0, newField);
    setFields(updatedFields);
    setSelectedFieldId(newField.id);
    toast.success(`${newField.type.charAt(0).toUpperCase() + newField.type.slice(1)} field added!`);
  };

  const handleFieldUpdate = (fieldId, updates) => {
    setFields(prevFields =>
      prevFields.map(field =>
        field.id === fieldId ? { ...field, ...updates } : field
      )
    );
    toast.success("Field updated!");
  };

  const handleFieldDelete = (fieldId) => {
    setFields(prevFields => prevFields.filter(field => field.id !== fieldId));
    if (selectedFieldId === fieldId) {
      setSelectedFieldId(null);
    }
    toast.success("Field deleted!");
  };

  const handleFieldReorder = (sourceIndex, targetIndex) => {
    if (sourceIndex === targetIndex) return;

    const updatedFields = [...fields];
    const [movedField] = updatedFields.splice(sourceIndex, 1);
    updatedFields.splice(targetIndex, 0, movedField);
    setFields(updatedFields);
    toast.success("Field reordered!");
  };

const handleExport = () => {
    const formConfig = {
      ...formSettings,
      fields: fields,
      timestamp: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(formConfig, null, 2)], {
      type: "application/json"
    });
    
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "form-config.json";
    link.click();
    
    URL.revokeObjectURL(url);
    toast.success("Form configuration exported!");
  };

const handleDownloadForm = async () => {
    try {
      const formConfig = {
        ...formSettings,
        fields: fields,
        selectedTheme: selectedFormTheme
      };

      const htmlContent = await formService.generateStandaloneHTML(formConfig);
      const zip = new JSZip();
      zip.file("form.html", htmlContent);
      
      // Add a readme file with instructions
      const readmeContent = `# Standalone Form

This package contains a fully functional HTML form that works offline.

## Files:
- form.html: The complete form with embedded CSS and JavaScript

## Usage:
1. Open form.html in any web browser
2. The form works completely offline
3. Form submissions are stored in localStorage
4. All validation and styling are included

Generated on: ${new Date().toISOString()}
Form Title: ${formSettings.title || 'Untitled Form'}
`;
      
      zip.file("README.md", readmeContent);
      
      const zipBlob = await zip.generateAsync({ type: "blob" });
      
      const url = URL.createObjectURL(zipBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${(formSettings.title || 'form').toLowerCase().replace(/[^a-z0-9]/g, '-')}.zip`;
      link.click();
      
      URL.revokeObjectURL(url);
      toast.success("Form downloaded successfully!");
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Failed to export form. Please try again.");
    }
  };
const handleFormSettingsOpen = () => {
    setIsSettingsModalOpen(true);
  };

  const handleFormSettingsClose = () => {
    setIsSettingsModalOpen(false);
  };

  const handleFormSettingsSave = (settings) => {
    setFormSettings(settings);
    toast.success("Form settings updated!");
  };

  const handleSaveForm = async (formName) => {
    if (fields.length === 0) {
      toast.error("Cannot save empty form");
      return;
    }

    try {
      await localStorageService.saveForm({
        name: formName || formSettings.title,
        formSettings,
        fields
      });
      toast.success("Form saved successfully!");
    } catch (error) {
      toast.error("Failed to save form");
      console.error('Save form error:', error);
    }
  };

  const handleLoadFormModal = async () => {
    setManagementLoading(true);
    try {
      const forms = await localStorageService.getSavedForms();
      setSavedForms(forms);
      setIsManagementModalOpen(true);
    } catch (error) {
      toast.error("Failed to load saved forms");
      console.error('Load forms error:', error);
    } finally {
      setManagementLoading(false);
    }
  };

  const handleLoadForm = async (form) => {
    try {
      setFields(form.fields);
      setFormSettings(form.formSettings);
      setSelectedFieldId(null);
      setIsManagementModalOpen(false);
      toast.success(`Form "${form.name}" loaded successfully!`);
    } catch (error) {
      toast.error("Failed to load form");
      console.error('Load form error:', error);
    }
  };

  const handleRenameForm = async (formId, newName) => {
    try {
      await localStorageService.renameForm(formId, newName);
      const updatedForms = await localStorageService.getSavedForms();
      setSavedForms(updatedForms);
      toast.success("Form renamed successfully!");
    } catch (error) {
      toast.error("Failed to rename form");
      console.error('Rename form error:', error);
    }
  };

  const handleDeleteForm = async (formId) => {
    try {
      await localStorageService.deleteForm(formId);
      const updatedForms = await localStorageService.getSavedForms();
      setSavedForms(updatedForms);
      toast.success("Form deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete form");
      console.error('Delete form error:', error);
    }
  };

  const handleNewForm = () => {
    if (fields.length > 0) {
      if (window.confirm("Are you sure you want to start a new form? All unsaved changes will be lost.")) {
        setFields([]);
        setSelectedFieldId(null);
        setFormSettings({
          title: "Untitled Form",
          description: "",
          submitButtonText: "Submit Form",
          successMessage: "Thank you! Your form has been submitted successfully.",
          redirectAfterSubmission: false,
          redirectUrl: "",
          enableValidation: true,
          requireAllFields: false,
          showProgressBar: false,
          allowSaveDraft: false
        });
        toast.info("Started new form");
}
    }
  };

  // Handle preview mode toggle
  const handlePreviewModeToggle = () => {
    setIsPreviewMode(!isPreviewMode);
    setSelectedFieldId(null); // Clear field selection when entering preview mode
  };
  return (
<div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
<Header 
        onExport={handleExport} 
        onFormSettings={handleFormSettingsOpen}
        onSaveForm={handleSaveForm}
        onLoadForm={handleLoadFormModal}
        onNewForm={handleNewForm}
        fieldCount={fields.length} 
        formTitle={formSettings.title}
        hasFields={fields.length > 0}
        selectedTheme={selectedFormTheme}
        availableThemes={availableThemes}
        onThemeSelect={handleThemeSelect}
        isPreviewMode={isPreviewMode}
        onPreviewModeToggle={handlePreviewModeToggle}
      />
      
<div className="flex h-[calc(100vh-80px)]">
        {!isPreviewMode && (
          <>
            {/* Left Panel - Field Toolbar */}
            <motion.div 
className="w-80 p-6 bg-background dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-colors duration-200"
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <FieldToolbar onDragStart={handleDragStart} />
            </motion.div>
          </>
        )}

        {/* Center Panel - Form Canvas or Preview */}
        <motion.div 
          className={isPreviewMode ? "flex-1 p-6" : "flex-1 p-6"}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          {isPreviewMode ? (
            <FormPreview
              fields={fields}
              formSettings={formSettings}
              selectedTheme={selectedFormTheme}
              isPreviewMode={true}
              onBackToEditor={handlePreviewModeToggle}
            />
          ) : (
<FormCanvas
              fields={fields}
              selectedFieldId={selectedFieldId}
              onFieldSelect={setSelectedFieldId}
              onFieldUpdate={handleFieldUpdate}
              onFieldDelete={handleFieldDelete}
              onFieldAdd={handleFieldAdd}
              onFieldReorder={handleFieldReorder}
              formSettings={formSettings}
              selectedTheme={selectedFormTheme}
            />
          )}
        </motion.div>

        {!isPreviewMode && (
          <>
{/* Right Panel - Field Configuration */}
            <FieldConfigurationPanel
              selectedField={fields.find(f => f.id === selectedFieldId)}
              onFieldUpdate={handleFieldUpdate}
              onFieldDelete={handleFieldDelete}
            />
          </>
        )}
      </div>
<FormSettingsModal
        isOpen={isSettingsModalOpen}
        onClose={handleFormSettingsClose}
        settings={formSettings}
        onSave={handleFormSettingsSave}
      />
    </div>
  );
};

export default FormBuilder;