import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import Header from "@/components/organisms/Header";
import FieldToolbar from "@/components/organisms/FieldToolbar";
import FormCanvas from "@/components/organisms/FormCanvas";
import FormPreview from "@/components/organisms/FormPreview";

const FormBuilder = () => {
  const [fields, setFields] = useState([]);
  const [selectedFieldId, setSelectedFieldId] = useState(null);
  const [draggedField, setDraggedField] = useState(null);

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
      title: "Generated Form",
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

  return (
    <div className="min-h-screen bg-background">
      <Header onExport={handleExport} fieldCount={fields.length} />
      
      <div className="flex h-[calc(100vh-80px)]">
        {/* Left Panel - Field Toolbar */}
        <motion.div 
          className="w-80 p-6 bg-background border-r border-gray-200"
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <FieldToolbar onDragStart={handleDragStart} />
        </motion.div>

        {/* Center Panel - Form Canvas */}
        <motion.div 
          className="flex-1 p-6"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <FormCanvas
            fields={fields}
            selectedFieldId={selectedFieldId}
            onFieldSelect={setSelectedFieldId}
            onFieldUpdate={handleFieldUpdate}
            onFieldDelete={handleFieldDelete}
            onFieldAdd={handleFieldAdd}
            onFieldReorder={handleFieldReorder}
          />
        </motion.div>

        {/* Right Panel - Form Preview */}
        <motion.div 
          className="w-96 p-6 bg-background border-l border-gray-200"
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <FormPreview fields={fields} />
        </motion.div>
      </div>
    </div>
  );
};

export default FormBuilder;