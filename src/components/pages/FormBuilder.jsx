import React, { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { toast } from 'react-toastify'
import JSZip from 'jszip'
import FormCanvas from '@/components/organisms/FormCanvas'
import Header from '@/components/organisms/Header'
import FormSettingsModal from '@/components/organisms/FormSettingsModal'
import FieldToolbar from '@/components/organisms/FieldToolbar'
import FieldConfigurationPanel from '@/components/organisms/FieldConfigurationPanel'
import FormPreview from '@/components/organisms/FormPreview'
import ShareFormModal from '@/components/organisms/ShareFormModal'
import fieldTypesData from '@/services/mockData/fieldTypes.json'
import formsData from '@/services/mockData/forms.json'
import themeTemplateService from "@/services/api/themeTemplateService";
import localStorageService from "@/services/api/localStorageService";
import formService from "@/services/api/formService";

const FormBuilder = () => {
const [fields, setFields] = useState([]);
  const [selectedFieldId, setSelectedFieldId] = useState(null);
  const [draggedField, setDraggedField] = useState(null);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isMobileDragging, setIsMobileDragging] = useState(false);
  const [touchStartPos, setTouchStartPos] = useState(null);
  const [selectedFormTheme, setSelectedFormTheme] = useState(themeTemplateService.getDefaultTheme());
  const [formSettings, setFormSettings] = useState({
    title: "My New Form",
    description: "Please fill out this form completely and accurately.",
    submitButtonText: "Submit Form",
    successMessage: "Thank you! Your form has been submitted successfully. We'll get back to you soon.",
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
  const [fileStorage, setFileStorage] = useState(new Map());
  const [fileUploads, setFileUploads] = useState(new Map());
  const [uploadProgress, setUploadProgress] = useState(new Map());
  const [formTemplates] = useState(formsData);
  const handleThemeSelect = (theme) => {
    setSelectedFormTheme(theme);
    toast.success(`Theme changed to ${theme.name}!`);
  };

const handleDragStart = (fieldType) => {
    setDraggedField(fieldType);
  };
  const handleTouchStart = (fieldType, e) => {
    setIsMobileDragging(true);
    setDraggedField(fieldType);
    const touch = e.touches[0];
    setTouchStartPos({ x: touch.clientX, y: touch.clientY });
  };

  const handleTouchEnd = () => {
    setIsMobileDragging(false);
    setDraggedField(null);
    setTouchStartPos(null);
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
    link.download = `${formSettings.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}-config.json`;
    link.click();
    
    URL.revokeObjectURL(url);
    toast.success(`Form configuration "${formSettings.title}" exported successfully!`);
  };

const handleDownloadForm = async () => {
    if (fields.length === 0) {
      toast.error("Please add at least one field before downloading the form.");
      return;
    }

    try {
      toast.info("Preparing your form download...");
      
      const formConfig = {
        ...formSettings,
        fields: fields,
        selectedTheme: selectedFormTheme
      };

      const htmlContent = await formService.generateStandaloneHTML(formConfig);
      const zip = new JSZip();
      zip.file("form.html", htmlContent);
      
      // Add a comprehensive readme file with instructions
      const readmeContent = `# ${formSettings.title}

This package contains a fully functional HTML form that works completely offline.

## What's Included:
- form.html: Your complete form with embedded CSS and JavaScript
- All ${fields.length} form field${fields.length !== 1 ? 's' : ''} with validation
- ${selectedFormTheme.name} theme styling
- Responsive design for mobile and desktop

## How to Use:
1. Extract this ZIP file to any folder
2. Double-click "form.html" to open in your web browser
3. The form works completely offline - no internet required!
4. Form submissions are automatically saved in the browser's localStorage
5. Share the HTML file with anyone - it's completely self-contained

## Form Details:
- Title: ${formSettings.title}
- Description: ${formSettings.description || 'No description provided'}
- Fields: ${fields.length} total
- Theme: ${selectedFormTheme.name}
- Generated: ${new Date().toLocaleString()}

## Technical Notes:
- No server required - runs entirely in the browser
- All validation and styling are embedded
- Compatible with all modern web browsers
- Responsive design adapts to any screen size

Enjoy your new form!
`;
      
      zip.file("README.txt", readmeContent);
      
      const zipBlob = await zip.generateAsync({ type: "blob" });
      
      const url = URL.createObjectURL(zipBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${(formSettings.title || 'form').toLowerCase().replace(/[^a-z0-9]/g, '-')}.zip`;
      link.click();
      
      URL.revokeObjectURL(url);
      toast.success(`✅ "${formSettings.title}" downloaded successfully! Check your downloads folder.`);
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Failed to download form. Please try again or check your browser settings.");
    }
};

  // Share Form Modal State
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

const handleShareForm = async () => {
    if (fields.length === 0) {
      toast.error('Please add at least one field before sharing the form');
      return;
    }

    try {
      toast.info("Preparing your form for sharing...");
      setIsShareModalOpen(true);
    } catch (error) {
      console.error('Error preparing form for sharing:', error);
      toast.error('Failed to prepare form for sharing');
    }
  };

  const handleShareModalClose = () => {
    setIsShareModalOpen(false);
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
      toast.error("Cannot save empty form - please add at least one field first");
      return;
    }

    try {
      await localStorageService.saveForm({
        name: formName || formSettings.title,
        formSettings,
        fields
      });
      toast.success(`✅ "${formName || formSettings.title}" saved successfully!`);
    } catch (error) {
      toast.error("Failed to save form - please try again");
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
      toast.error("Failed to load saved forms - please try again");
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
          title: "My New Form",
          description: "Please fill out this form completely and accurately.",
          submitButtonText: "Submit Form",
          successMessage: "Thank you! Your form has been submitted successfully. We'll get back to you soon.",
          redirectAfterSubmission: false,
          redirectUrl: "",
          enableValidation: true,
          requireAllFields: false,
          showProgressBar: false,
          allowSaveDraft: false
        });
        toast.info("✨ Started new form - ready for your creativity!");
      }
    } else {
      // If no fields, just reset settings
      setFormSettings({
        title: "My New Form",
        description: "Please fill out this form completely and accurately.",
        submitButtonText: "Submit Form",
        successMessage: "Thank you! Your form has been submitted successfully. We'll get back to you soon.",
        redirectAfterSubmission: false,
        redirectUrl: "",
        enableValidation: true,
        requireAllFields: false,
        showProgressBar: false,
        allowSaveDraft: false
      });
      toast.info("✨ Form reset - ready to build!");
    }
  };

  const handleUseTemplate = (template) => {
    if (fields.length > 0) {
      if (!window.confirm("This will replace your current form. Continue?")) {
        return;
      }
    }
    
    setFormSettings({
      title: template.title,
      description: template.description || "Please fill out this form completely and accurately.",
      submitButtonText: "Submit Form",
      successMessage: "Thank you! Your form has been submitted successfully. We'll get back to you soon.",
      redirectAfterSubmission: false,
      redirectUrl: "",
      enableValidation: true,
      requireAllFields: false,
      showProgressBar: false,
      allowSaveDraft: false
    });
    
    const templateFields = template.fields.map(field => ({
      ...field,
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    }));
    
    setFields(templateFields);
    setSelectedFieldId(null);
    toast.success(`✨ "${template.title}" template loaded! Customize as needed.`);
  };

// Handle preview mode toggle
  
  // File upload handlers
  const handleFileUpload = async (fieldId, files) => {
    const fileArray = Array.from(files);
    const field = fields.find(f => f.id === fieldId);
    
    if (!field) return;
    
    // Validate file types
    if (field.accept) {
      const acceptedTypes = field.accept.split(',').map(type => type.trim());
      const invalidFiles = fileArray.filter(file => {
        return !acceptedTypes.some(acceptedType => {
          if (acceptedType.startsWith('.')) {
            return file.name.toLowerCase().endsWith(acceptedType.toLowerCase());
          }
          return file.type.match(acceptedType.replace('*', '.*'));
        });
      });
      
      if (invalidFiles.length > 0) {
        toast.error(`Invalid file type(s): ${invalidFiles.map(f => f.name).join(', ')}`);
        return;
      }
    }
    
    // Validate file sizes
    if (field.maxSize) {
      const maxSizeBytes = field.maxSize * 1024 * 1024; // Convert MB to bytes
      const oversizedFiles = fileArray.filter(file => file.size > maxSizeBytes);
      
      if (oversizedFiles.length > 0) {
        toast.error(`File(s) too large: ${oversizedFiles.map(f => f.name).join(', ')}. Max size: ${field.maxSize}MB`);
        return;
      }
    }
    
    // Validate multiple files setting
    if (!field.multiple && fileArray.length > 1) {
      toast.error('Only one file allowed for this field');
      return;
    }
    
    try {
      const uploadPromises = fileArray.map(async (file, index) => {
        const fileId = `${fieldId}_${Date.now()}_${index}`;
        
        // Update progress
        setUploadProgress(prev => new Map(prev.set(fileId, 0)));
        
        // Simulate upload progress
        for (let progress = 0; progress <= 100; progress += 20) {
          await new Promise(resolve => setTimeout(resolve, 100));
          setUploadProgress(prev => new Map(prev.set(fileId, progress)));
        }
        
        // Store file data
        const fileData = {
          id: fileId,
          name: file.name,
          size: file.size,
          type: file.type,
          lastModified: file.lastModified,
          fieldId: fieldId,
          data: await file.arrayBuffer()
        };
        
        setFileStorage(prev => new Map(prev.set(fileId, fileData)));
        setUploadProgress(prev => {
          const newMap = new Map(prev);
          newMap.delete(fileId);
          return newMap;
        });
        
        return fileData;
      });
      
      const uploadedFiles = await Promise.all(uploadPromises);
      
      // Update field uploads
      setFileUploads(prev => {
        const newMap = new Map(prev);
        const existingFiles = newMap.get(fieldId) || [];
        const updatedFiles = field.multiple 
          ? [...existingFiles, ...uploadedFiles]
          : uploadedFiles;
        newMap.set(fieldId, updatedFiles);
        return newMap;
      });
      
      toast.success(`Successfully uploaded ${uploadedFiles.length} file(s)`);
      
    } catch (error) {
      toast.error(`Failed to upload files: ${error.message}`);
    }
  };
  
  const handleFileDelete = (fieldId, fileId) => {
    // Remove from storage
    setFileStorage(prev => {
      const newMap = new Map(prev);
      newMap.delete(fileId);
      return newMap;
    });
    
    // Remove from uploads
    setFileUploads(prev => {
      const newMap = new Map(prev);
      const existingFiles = newMap.get(fieldId) || [];
      const updatedFiles = existingFiles.filter(file => file.id !== fileId);
      newMap.set(fieldId, updatedFiles);
      return newMap;
    });
    
    toast.success('File deleted successfully');
  };
  
  const handleFileDownload = (fileId) => {
    const fileData = fileStorage.get(fileId);
    if (!fileData) {
      toast.error('File not found');
      return;
    }
    
    const blob = new Blob([fileData.data], { type: fileData.type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileData.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast.success('File downloaded successfully');
  };
const handlePreviewModeToggle = () => {
    setIsPreviewMode(!isPreviewMode);
    setSelectedFieldId(null); // Clear field selection when entering preview mode
    setIsMobileDragging(false); // Clear mobile drag state
  };
  return (
<div className="min-h-screen bg-gray-50 dark:bg-gradient-to-br dark:from-purple-900 dark:via-purple-800 dark:to-indigo-900 transition-colors duration-200">
      <Header 
        onExport={handleExport} 
        onFormSettings={handleFormSettingsOpen}
        onSaveForm={handleSaveForm}
        onLoadForm={handleLoadFormModal}
        onNewForm={handleNewForm}
        onShareForm={handleShareForm}
        onDownloadForm={handleDownloadForm}
        fieldCount={fields.length} 
        formTitle={formSettings.title}
        hasFields={fields.length > 0}
        selectedTheme={selectedFormTheme}
        availableThemes={availableThemes}
        onThemeSelect={handleThemeSelect}
        isPreviewMode={isPreviewMode}
        onPreviewModeToggle={handlePreviewModeToggle}
      />

      {/* Share Form Modal */}
      <ShareFormModal
        isOpen={isShareModalOpen}
        onClose={handleShareModalClose}
        formData={{
          fields,
          settings: formSettings,
          theme: selectedFormTheme
        }}
      />
      
      <div className="flex flex-col md:flex-row h-[calc(100vh-80px)]">
        <AnimatePresence mode="wait">
          {!isPreviewMode && (
            <motion.div 
              key="toolbar"
className="w-full md:w-80 p-4 md:p-6 bg-background dark:bg-purple-900/40 border-b md:border-b-0 md:border-r border-gray-200 dark:border-purple-600/30 transition-colors duration-300 overflow-y-auto max-h-60 md:max-h-none"
              initial={{ x: -80, opacity: 0, scale: 0.95 }}
              animate={{ x: 0, opacity: 1, scale: 1 }}
              exit={{ x: -80, opacity: 0, scale: 0.95 }}
              transition={{ 
                duration: 0.4,
                type: "spring",
                stiffness: 300,
                damping: 30
              }}
            >
              <FieldToolbar 
                onDragStart={handleDragStart}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
                isMobileDragging={isMobileDragging}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Center Panel - Form Canvas or Preview */}
        <AnimatePresence mode="wait">
          <motion.div 
            key={isPreviewMode ? "preview" : "canvas"}
            className="flex-1 p-4 md:p-6 min-h-0"
            initial={{ y: 20, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -20, opacity: 0, scale: 0.98 }}
            transition={{ 
              duration: 0.5,
              type: "spring",
              stiffness: 260,
              damping: 20
            }}
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
                fileUploads={fileUploads}
                uploadProgress={uploadProgress}
                onFileUpload={handleFileUpload}
                onFileDelete={handleFileDelete}
                onFileDownload={handleFileDownload}
                isMobileDragging={isMobileDragging}
                draggedField={draggedField}
                formTemplates={formTemplates}
                onUseTemplate={handleUseTemplate}
              />
            )}
          </motion.div>
        </AnimatePresence>

        <AnimatePresence>
          {!isPreviewMode && selectedFieldId && (
            <motion.div 
              key="config-panel"
className="w-full md:w-80 p-4 md:p-6 bg-background dark:bg-purple-900/40 border-t md:border-t-0 md:border-l border-gray-200 dark:border-purple-600/30 transition-colors duration-300 order-last md:order-none overflow-y-auto"
              initial={{ x: 80, opacity: 0, scale: 0.95 }}
              animate={{ x: 0, opacity: 1, scale: 1 }}
              exit={{ x: 80, opacity: 0, scale: 0.95 }}
              transition={{ 
                duration: 0.4,
                type: "spring",
                stiffness: 300,
                damping: 30
              }}
            >
              <FieldConfigurationPanel
                selectedField={fields.find(f => f.id === selectedFieldId)}
                onFieldUpdate={handleFieldUpdate}
                onFieldDelete={handleFieldDelete}
              />
            </motion.div>
          )}
        </AnimatePresence>
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