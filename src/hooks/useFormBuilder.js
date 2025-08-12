import { useCallback, useState } from "react";
import { toast } from "react-toastify";
import Error from "@/components/ui/Error";
import formService from "@/services/api/formService";
import fieldTypeService from "@/services/api/fieldTypeService";

export const useFormBuilder = () => {
  const [fields, setFields] = useState([]);
  const [selectedFieldId, setSelectedFieldId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fileStorage, setFileStorage] = useState(new Map());
  const [uploadProgress, setUploadProgress] = useState(new Map());

  // File storage utilities
const initializeFileStorage = useCallback(() => {
    if (typeof window !== 'undefined' && 'indexedDB' in window) {
      const request = window.indexedDB.open('FormBuilderFiles', 1);
      
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains('files')) {
          const store = db.createObjectStore('files', { keyPath: 'id' });
          store.createIndex('fieldId', 'fieldId', { unique: false });
        }
      };
      
      return request;
    }
    return null;
  }, []);

  const storeFile = useCallback(async (fileData) => {
    return new Promise((resolve, reject) => {
      const request = initializeFileStorage();
      if (!request) {
        // Fallback to memory storage
        setFileStorage(prev => new Map(prev.set(fileData.id, fileData)));
        resolve(fileData);
        return;
      }

      request.onsuccess = (event) => {
        const db = event.target.result;
        const transaction = db.transaction(['files'], 'readwrite');
        const store = transaction.objectStore('files');
        
        const addRequest = store.add(fileData);
        addRequest.onsuccess = () => {
          setFileStorage(prev => new Map(prev.set(fileData.id, fileData)));
          resolve(fileData);
        };
        addRequest.onerror = () => reject(addRequest.error);
      };
      
      request.onerror = () => {
        // Fallback to memory storage
        setFileStorage(prev => new Map(prev.set(fileData.id, fileData)));
        resolve(fileData);
      };
    });
  }, [initializeFileStorage]);

  const deleteStoredFile = useCallback(async (fileId) => {
    return new Promise((resolve) => {
      const request = initializeFileStorage();
      if (!request) {
        // Fallback to memory storage
        setFileStorage(prev => {
          const newMap = new Map(prev);
          newMap.delete(fileId);
          return newMap;
        });
        resolve();
        return;
      }

      request.onsuccess = (event) => {
        const db = event.target.result;
        const transaction = db.transaction(['files'], 'readwrite');
        const store = transaction.objectStore('files');
        
        store.delete(fileId);
        setFileStorage(prev => {
          const newMap = new Map(prev);
          newMap.delete(fileId);
          return newMap;
        });
        resolve();
      };
      
      request.onerror = () => {
        // Fallback to memory storage
        setFileStorage(prev => {
          const newMap = new Map(prev);
          newMap.delete(fileId);
          return newMap;
        });
        resolve();
      };
    });
  }, [initializeFileStorage]);

  const addField = useCallback((fieldType, targetIndex = fields.length) => {
    try {
      const newField = fieldTypeService.createFieldFromType(fieldType);
      const updatedFields = [...fields];
      updatedFields.splice(targetIndex, 0, newField);
      setFields(updatedFields);
      setSelectedFieldId(newField.id);
      toast.success(`${newField.type.charAt(0).toUpperCase() + newField.type.slice(1)} field added!`);
      return newField;
    } catch (err) {
      toast.error(`Failed to add field: ${err.message}`);
      throw err;
    }
  }, [fields]);

  const updateField = useCallback((fieldId, updates) => {
    setFields(prevFields =>
      prevFields.map(field =>
        field.id === fieldId ? { ...field, ...updates } : field
      )
    );
    toast.success("Field updated!");
  }, []);

  const deleteField = useCallback(async (fieldId) => {
    setFields(prevFields => prevFields.filter(field => field.id !== fieldId));
    
    // Clean up associated files
    const filesToDelete = Array.from(fileStorage.values())
      .filter(file => file.fieldId === fieldId);
    
    for (const file of filesToDelete) {
      await deleteStoredFile(file.id);
    }
    
    if (selectedFieldId === fieldId) {
      setSelectedFieldId(null);
    }
    toast.success("Field and associated files deleted!");
  }, [selectedFieldId, fileStorage, deleteStoredFile]);

  const reorderFields = useCallback((sourceIndex, targetIndex) => {
    if (sourceIndex === targetIndex) return;

    const updatedFields = [...fields];
    const [movedField] = updatedFields.splice(sourceIndex, 1);
    updatedFields.splice(targetIndex, 0, movedField);
    setFields(updatedFields);
    toast.success("Field reordered!");
  }, [fields]);

const saveForm = useCallback(async (formSettings) => {
    if (fields.length === 0) {
      toast.error("Cannot save empty form");
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const formConfig = {
        ...formSettings,
        fields: fields
      };

      const savedForm = await formService.saveFormConfig(formConfig);
      toast.success("Form saved successfully!");
      return savedForm;
    } catch (err) {
      const errorMessage = "Failed to save form";
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fields]);

const exportForm = useCallback((formSettings) => {
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
    const fileName = (formSettings.title || "Generated Form").toLowerCase().replace(/\s+/g, '-');
    link.download = `${fileName}-config.json`;
    link.click();
    
    URL.revokeObjectURL(url);
    toast.success("Form configuration exported!");
  }, [fields]);

  const clearForm = useCallback(async () => {
    // Clear all stored files
    const filesToDelete = Array.from(fileStorage.values());
    for (const file of filesToDelete) {
      await deleteStoredFile(file.id);
    }
    
    setFields([]);
    setSelectedFieldId(null);
    setError(null);
    setUploadProgress(new Map());
    toast.info("Form and all files cleared");
  }, [fileStorage, deleteStoredFile]);

// Local Storage Management Functions
const saveFormToStorage = useCallback(async (formName, formSettings) => {
    if (fields.length === 0) {
      toast.error("Cannot save empty form");
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const localStorageService = (await import('@/services/api/localStorageService')).default;
      const savedForm = await localStorageService.saveForm({
        name: formName,
        formSettings,
        fields
      });
      toast.success("Form saved successfully!");
      return savedForm;
    } catch (err) {
      const errorMessage = "Failed to save form";
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fields]);

  const loadFormFromStorage = useCallback(async (formId) => {
    setLoading(true);
    setError(null);

    try {
      const localStorageService = (await import('@/services/api/localStorageService')).default;
      const form = await localStorageService.loadForm(formId);
      if (form) {
        return form;
      } else {
        throw new Error("Form not found");
      }
    } catch (err) {
      const errorMessage = "Failed to load form";
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getSavedForms = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const localStorageService = (await import('@/services/api/localStorageService')).default;
      const forms = await localStorageService.getSavedForms();
      return forms;
    } catch (err) {
      const errorMessage = "Failed to load saved forms";
      setError(errorMessage);
      toast.error(errorMessage);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    fields,
    selectedFieldId,
    loading,
    error,
    fileStorage,
    uploadProgress,
    setSelectedFieldId,
    addField,
    updateField,
    deleteField,
    reorderFields,
    saveForm,
    exportForm,
    clearForm,
    saveFormToStorage,
    loadFormFromStorage,
    getSavedForms,
    storeFile,
    deleteStoredFile
  };
};