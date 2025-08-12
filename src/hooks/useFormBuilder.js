import { useState, useCallback } from "react";
import { toast } from "react-toastify";
import formService from "@/services/api/formService";
import fieldTypeService from "@/services/api/fieldTypeService";

export const useFormBuilder = () => {
  const [fields, setFields] = useState([]);
  const [selectedFieldId, setSelectedFieldId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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

  const deleteField = useCallback((fieldId) => {
    setFields(prevFields => prevFields.filter(field => field.id !== fieldId));
    if (selectedFieldId === fieldId) {
      setSelectedFieldId(null);
    }
    toast.success("Field deleted!");
  }, [selectedFieldId]);

  const reorderFields = useCallback((sourceIndex, targetIndex) => {
    if (sourceIndex === targetIndex) return;

    const updatedFields = [...fields];
    const [movedField] = updatedFields.splice(sourceIndex, 1);
    updatedFields.splice(targetIndex, 0, movedField);
    setFields(updatedFields);
    toast.success("Field reordered!");
  }, [fields]);

  const saveForm = useCallback(async (formTitle, formDescription) => {
    if (fields.length === 0) {
      toast.error("Cannot save empty form");
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const formConfig = {
        title: formTitle || "Untitled Form",
        description: formDescription || "",
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

  const exportForm = useCallback((formTitle = "Generated Form") => {
    const formConfig = {
      title: formTitle,
      fields: fields,
      timestamp: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(formConfig, null, 2)], {
      type: "application/json"
    });
    
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${formTitle.toLowerCase().replace(/\s+/g, '-')}-config.json`;
    link.click();
    
    URL.revokeObjectURL(url);
    toast.success("Form configuration exported!");
  }, [fields]);

  const clearForm = useCallback(() => {
    setFields([]);
    setSelectedFieldId(null);
    setError(null);
    toast.info("Form cleared");
  }, []);

  return {
    fields,
    selectedFieldId,
    loading,
    error,
    setSelectedFieldId,
    addField,
    updateField,
    deleteField,
    reorderFields,
    saveForm,
    exportForm,
    clearForm
  };
};