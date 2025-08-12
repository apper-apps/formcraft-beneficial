import formsData from "@/services/mockData/forms.json";

class FormService {
  constructor() {
    this.forms = [...formsData];
    this.delay = 200;
    this.isInitialized = false;
    this.initialize();
  }

  async initialize() {
    try {
      // Ensure forms data is valid
      if (!Array.isArray(this.forms)) {
        this.forms = [];
      }
      
      // Validate and fix form data
      this.forms = this.forms.map(form => ({
        ...form,
        Id: form.Id || this.generateId(),
        title: form.title || 'Untitled Form',
        description: form.description || '',
        fields: form.fields || [],
        createdAt: form.createdAt || new Date().toISOString()
      }));
      
      this.isInitialized = true;
    } catch (error) {
      console.warn('FormService initialization warning:', error);
      this.forms = [];
      this.isInitialized = true;
    }
  }

  generateId() {
    return Math.max(...this.forms.map(f => f.Id || 0), 0) + 1;
  }

  async delay() {
    return new Promise(resolve => setTimeout(resolve, this.delay));
  }

  async ensureInitialized() {
    if (!this.isInitialized) {
      await new Promise(resolve => {
        const checkInit = () => {
          if (this.isInitialized) {
            resolve();
          } else {
            setTimeout(checkInit, 10);
          }
        };
        checkInit();
      });
    }
  }

async getAll() {
    await this.ensureInitialized();
    await this.delay();
    
    try {
      return [...this.forms];
    } catch (error) {
      console.error('FormService.getAll error:', error);
      return [];
    }
  }

async getById(id) {
    await this.ensureInitialized();
    await this.delay();
    
    try {
      if (!id) {
        throw new Error('Form ID is required');
      }
      
      const form = this.forms.find(form => form.Id === parseInt(id));
      return form ? { ...form } : null;
    } catch (error) {
      console.error('FormService.getById error:', error);
      return null;
    }
  }

async create(formData) {
    await this.ensureInitialized();
    await this.delay();
    
    try {
      // Validate required data
      if (!formData || typeof formData !== 'object') {
        throw new Error('Invalid form data provided');
      }

      // Check if we can store the form (simulate storage limits)
      if (this.forms.length >= 1000) {
        const error = new Error('Storage quota exceeded. Maximum number of forms reached.');
        error.name = 'QuotaExceededError';
        throw error;
      }

      const newForm = {
        Id: this.generateId(),
        title: formData.title || "Untitled Form",
        description: formData.description || "",
        submitButtonText: formData.submitButtonText || "Submit Form",
        successMessage: formData.successMessage || "Thank you! Your form has been submitted successfully.",
        redirectAfterSubmission: formData.redirectAfterSubmission || false,
        redirectUrl: formData.redirectUrl || "",
        enableValidation: formData.enableValidation !== undefined ? formData.enableValidation : true,
        requireAllFields: formData.requireAllFields || false,
        showProgressBar: formData.showProgressBar || false,
        allowSaveDraft: formData.allowSaveDraft || false,
        fields: Array.isArray(formData.fields) ? formData.fields : [],
        createdAt: new Date().toISOString(),
        version: 1
      };
      
      this.forms.push(newForm);
      return { ...newForm };
      
    } catch (error) {
      console.error('FormService.create error:', error);
      
      // Re-throw with more context
      if (error.name === 'QuotaExceededError') {
        throw error;
      }
      
      const serviceError = new Error(`Failed to create form: ${error.message}`);
      serviceError.originalError = error;
      throw serviceError;
    }
  }

async update(id, formData) {
    await this.ensureInitialized();
    await this.delay();
    
    try {
      // Validate inputs
      if (!id || (!formData || typeof formData !== 'object')) {
        throw new Error("Invalid parameters provided");
      }

      const index = this.forms.findIndex(form => form.Id === parseInt(id));
      if (index === -1) {
        const error = new Error("Form not found");
        error.status = 404;
        throw error;
      }
      
      // Simulate potential update conflicts
      const existingForm = this.forms[index];
      if (formData.version && existingForm.version && formData.version < existingForm.version) {
        const error = new Error("Form has been modified by another user. Please refresh and try again.");
        error.status = 409;
        error.code = 'CONFLICT';
        throw error;
      }
      
      this.forms[index] = {
        ...this.forms[index],
        ...formData,
        updatedAt: new Date().toISOString(),
        version: (existingForm.version || 1) + 1
      };
      
      return { ...this.forms[index] };
      
    } catch (error) {
      console.error('FormService.update error:', error);
      
      // Re-throw with preserved status codes
      if (error.status) {
        throw error;
      }
      
      const serviceError = new Error(`Failed to update form: ${error.message}`);
      serviceError.originalError = error;
      throw serviceError;
    }
  }

async delete(id) {
    await this.ensureInitialized();
    await this.delay();
    
    try {
      if (!id) {
        throw new Error("Form ID is required");
      }
      
      const index = this.forms.findIndex(form => form.Id === parseInt(id));
      if (index === -1) {
        const error = new Error("Form not found");
        error.status = 404;
        throw error;
      }
      
      const deletedForm = this.forms.splice(index, 1)[0];
      return { ...deletedForm };
      
    } catch (error) {
      console.error('FormService.delete error:', error);
      
      if (error.status) {
        throw error;
      }
      
      const serviceError = new Error(`Failed to delete form: ${error.message}`);
      serviceError.originalError = error;
      throw serviceError;
    }
  }

async saveFormConfig(formConfig) {
    await this.ensureInitialized();
    await this.delay();
    
    try {
      // Validate form configuration
      if (!formConfig) {
        throw new Error("Form configuration is required");
      }

      if (!formConfig.fields || !Array.isArray(formConfig.fields)) {
        throw new Error("Form must contain valid fields array");
      }

      if (formConfig.fields.length === 0) {
        console.warn('Saving empty form - this is allowed but not recommended');
      }

      // Validate field configurations
      const invalidFields = formConfig.fields.filter(field => 
        !field.id || !field.type || !field.label
      );

      if (invalidFields.length > 0) {
        throw new Error(`Invalid field configuration found. All fields must have id, type, and label.`);
      }

      const savedForm = await this.create(formConfig);
      return savedForm;
      
    } catch (error) {
      console.error('FormService.saveFormConfig error:', error);
      
      // Enhanced error for form configuration issues
      if (error.message.includes('field') || error.message.includes('configuration')) {
        error.status = 400;
      }
      
      throw error;
    }
  }

async exportFormConfig(formId) {
    await this.ensureInitialized();
    await this.delay();
    
    try {
      const form = await this.getById(formId);
      if (!form) {
        throw new Error("Form not found for export");
      }
      
      return {
        title: form.title,
        description: form.description,
        submitButtonText: form.submitButtonText,
        successMessage: form.successMessage,
        redirectAfterSubmission: form.redirectAfterSubmission,
        redirectUrl: form.redirectUrl,
        enableValidation: form.enableValidation,
        requireAllFields: form.requireAllFields,
        showProgressBar: form.showProgressBar,
        allowSaveDraft: form.allowSaveDraft,
        fields: form.fields || [],
        exportedAt: new Date().toISOString(),
        version: form.version || 1
      };
      
    } catch (error) {
      console.error('FormService.exportFormConfig error:', error);
      throw new Error(`Failed to export form configuration: ${error.message}`);
    }
  }

  async generateStandaloneHTML(formConfig) {
    await this.delay();
    
    const { title, description, submitButtonText, successMessage, fields, selectedTheme } = formConfig;
    const formTitle = title || "Untitled Form";
    const formDescription = description || "Please fill out the form below.";
    const submitText = submitButtonText || "Submit Form";
    const successMsg = successMessage || "Thank you! Your form has been submitted successfully.";

// Generate Tailwind CSS (embedded)
    const tailwindCSS = `
      * { box-sizing: border-box; }
      .w-full { width: 100%; }
      .h-full { height: 100%; }
      .max-w-2xl { max-width: 42rem; }
      .mx-auto { margin-left: auto; margin-right: auto; }
      .p-6 { padding: 1.5rem; }
      .p-8 { padding: 2rem; }
      .py-2 { padding-top: 0.5rem; padding-bottom: 0.5rem; }
      .px-3 { padding-left: 0.75rem; padding-right: 0.75rem; }
      .px-4 { padding-left: 1rem; padding-right: 1rem; }
      .py-3 { padding-top: 0.75rem; padding-bottom: 0.75rem; }
      .mb-2 { margin-bottom: 0.5rem; }
      .mb-4 { margin-bottom: 1rem; }
      .mb-8 { margin-bottom: 2rem; }
      .mt-1 { margin-top: 0.25rem; }
      .mt-4 { margin-top: 1rem; }
      .space-y-2 > * + * { margin-top: 0.5rem; }
      .space-y-4 > * + * { margin-top: 1rem; }
      .space-y-6 > * + * { margin-top: 1.5rem; }
      .bg-white { background-color: #ffffff; }
      .bg-gray-50 { background-color: #f9fafb; }
      .bg-gray-100 { background-color: #f3f4f6; }
      .bg-blue-600 { background-color: #2563eb; }
      .hover\\:bg-blue-700:hover { background-color: #1d4ed8; }
      .text-2xl { font-size: 1.5rem; line-height: 2rem; }
      .text-lg { font-size: 1.125rem; line-height: 1.75rem; }
      .text-sm { font-size: 0.875rem; line-height: 1.25rem; }
      .text-xs { font-size: 0.75rem; line-height: 1rem; }
      .font-bold { font-weight: 700; }
      .font-medium { font-weight: 500; }
      .text-gray-900 { color: #111827; }
      .text-gray-600 { color: #4b5563; }
      .text-gray-500 { color: #6b7280; }
      .text-gray-700 { color: #374151; }
      .text-white { color: #ffffff; }
      .text-red-600 { color: #dc2626; }
      .text-red-500 { color: #ef4444; }
      .text-green-600 { color: #059669; }
      .border { border-width: 1px; }
      .border-gray-300 { border-color: #d1d5db; }
      .border-red-500 { border-color: #ef4444; }
      .border-gray-200 { border-color: #e5e7eb; }
      .rounded { border-radius: 0.25rem; }
      .rounded-md { border-radius: 0.375rem; }
      .rounded-lg { border-radius: 0.5rem; }
      .shadow-lg { box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05); }
      .focus\\:ring-2:focus { box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.5); }
      .focus\\:border-blue-500:focus { border-color: #3b82f6; }
      .focus\\:outline-none:focus { outline: none; }
      .transition-all { transition-property: all; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); transition-duration: 150ms; }
      .resize-none { resize: none; }
      .block { display: block; }
      .hidden { display: none; }
      .flex { display: flex; }
      .items-center { align-items: center; }
      .justify-center { justify-content: center; }
      .min-h-screen { min-height: 100vh; }
      body { font-family: 'Inter', system-ui, sans-serif; margin: 0; background-color: #f9fafb; color: #111827; line-height: 1.6; }
      .form-container { max-width: 42rem; margin: 0 auto; padding: 2rem 1rem; }
      .form-header { text-align: center; margin-bottom: 2rem; }
      .form-title { font-size: 1.875rem; font-weight: 700; color: #111827; margin-bottom: 0.5rem; }
      .form-description { font-size: 1rem; color: #6b7280; }
      .success-message { background-color: #dcfce7; color: #166534; padding: 1rem; border-radius: 0.5rem; margin-bottom: 1rem; border: 1px solid #bbf7d0; }
      .error-message { background-color: #fef2f2; color: #dc2626; padding: 0.5rem; border-radius: 0.375rem; margin-top: 0.25rem; border: 1px solid #fecaca; font-size: 0.875rem; }
      .toast { position: fixed; top: 1rem; right: 1rem; background: #059669; color: white; padding: 1rem; border-radius: 0.5rem; z-index: 1000; }
      .field-description { color: #6b7280; font-size: 0.875rem; margin-top: 0.25rem; }
      @media (max-width: 768px) {
        .form-container { padding: 1rem 0.75rem; }
        .form-title { font-size: 1.5rem; }
        .px-3 { padding-left: 0.5rem; padding-right: 0.5rem; }
        .py-2 { padding-top: 0.375rem; padding-bottom: 0.375rem; }
      }
    `;

    // Generate field HTML
    const fieldsHTML = fields.map(field => {
      let fieldHTML = '';
      const hasDescription = field.description && field.description.trim();
      
      switch (field.type) {
        case "text":
          fieldHTML = `
            <input
              type="text"
              id="${field.id}"
              name="${field.id}"
              placeholder="${field.placeholder || 'Enter text...'}"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:border-blue-500 focus:outline-none transition-all"
              ${field.required ? 'required' : ''}
              ${field.minLength ? `minlength="${field.minLength}"` : ''}
              ${field.maxLength ? `maxlength="${field.maxLength}"` : ''}
              ${field.pattern ? `pattern="${field.pattern}"` : ''}
            />`;
          break;
        case "email":
          fieldHTML = `
            <input
              type="email"
              id="${field.id}"
              name="${field.id}"
              placeholder="${field.placeholder || 'Enter email address...'}"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:border-blue-500 focus:outline-none transition-all"
              ${field.required ? 'required' : ''}
            />`;
          break;
case "phone":
          fieldHTML = `
            <input
              type="tel"
              id="${field.id}"
              name="${field.id}"
              placeholder="${field.placeholder || '(555) 123-4567'}"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:border-blue-500 focus:outline-none transition-all"
              ${field.required ? 'required' : ''}
            />`;
          break;
        case "url":
          fieldHTML = `
            <input
              type="url"
              id="${field.id}"
              name="${field.id}"
              placeholder="${field.placeholder || 'https://example.com'}"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:border-blue-500 focus:outline-none transition-all"
              ${field.required ? 'required' : ''}
            />`;
          break;
        case "textarea":
          fieldHTML = `
            <textarea
              id="${field.id}"
              name="${field.id}"
              placeholder="${field.placeholder || 'Enter your text here...'}"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:border-blue-500 focus:outline-none transition-all resize-none"
              rows="${field.rows || 3}"
              ${field.required ? 'required' : ''}
              ${field.minLength ? `minlength="${field.minLength}"` : ''}
              ${field.maxLength ? `maxlength="${field.maxLength}"` : ''}
            ></textarea>`;
          break;
        case "number":
          fieldHTML = `
            <input
              type="number"
              id="${field.id}"
              name="${field.id}"
              placeholder="${field.placeholder || 'Enter a number...'}"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:border-blue-500 focus:outline-none transition-all"
              ${field.required ? 'required' : ''}
              ${field.min !== null && field.min !== undefined ? `min="${field.min}"` : ''}
              ${field.max !== null && field.max !== undefined ? `max="${field.max}"` : ''}
              step="${field.step || 1}"
            />`;
          break;
case "file":
          fieldHTML = `
            <div class="file-upload-container">
              <input
                type="file"
                id="${field.id}"
                name="${field.id}"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:border-blue-500 focus:outline-none transition-all file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                ${field.required ? 'required' : ''}
                ${field.accept ? `accept="${field.accept}"` : ''}
                ${field.multiple ? 'multiple' : ''}
                onchange="handleFileChange(this, '${field.id}')"
              />
              <div id="${field.id}-upload-progress" class="mt-2 hidden">
                <div class="bg-gray-200 rounded-full h-2">
                  <div class="bg-blue-600 h-2 rounded-full" style="width: 0%"></div>
                </div>
                <p class="text-sm text-gray-600 mt-1">Uploading...</p>
              </div>
              <div id="${field.id}-files" class="mt-2 space-y-2"></div>
              ${field.maxSize ? `<p class="mt-1 text-xs text-gray-500">Maximum file size: ${field.maxSize}MB per file</p>` : ''}
              ${field.accept ? `<p class="mt-1 text-xs text-gray-500">Accepted types: ${field.accept}</p>` : ''}
            </div>`;
          break;
        case "dropdown":
          fieldHTML = `
            <select
              id="${field.id}"
              name="${field.id}"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:border-blue-500 focus:outline-none transition-all"
              ${field.required ? 'required' : ''}
            >
              <option value="">Select an option...</option>
              ${field.options?.map(option => `<option value="${option}">${option}</option>`).join('') || ''}
            </select>`;
          break;
        case "multiselect":
          fieldHTML = `
            <select
              id="${field.id}"
              name="${field.id}"
              multiple
              size="4"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:border-blue-500 focus:outline-none transition-all"
              ${field.required ? 'required' : ''}
            >
              ${field.options?.map(option => `<option value="${option}">${option}</option>`).join('') || ''}
            </select>
            ${field.maxSelections ? `<p class="mt-1 text-xs text-gray-500">Maximum ${field.maxSelections} selections</p>` : ''}`;
          break;
        default:
          fieldHTML = '<div>Unsupported field type</div>';
      }

      return `
        <div class="space-y-2">
          <label for="${field.id}" class="block text-sm font-medium text-gray-700">
            ${field.label || 'Untitled Field'}
            ${field.required ? '<span class="text-red-500 ml-1">*</span>' : ''}
          </label>
          ${fieldHTML}
          ${hasDescription ? `<p class="text-sm text-gray-600 mt-1">${field.description}</p>` : ''}
          <div id="${field.id}-error" class="error-message hidden"></div>
        </div>
      `;
    }).join('');

    // Generate complete HTML
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${formTitle}</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    <style>
        ${tailwindCSS}
    </style>
</head>
<body class="bg-gray-50 min-h-screen">
    <div class="form-container">
        <div class="bg-white rounded-lg shadow-lg p-8">
            <div id="success-message" class="success-message hidden"></div>
            
            <div class="mb-8">
                <h1 class="text-2xl font-bold text-gray-900 mb-2">${formTitle}</h1>
                <p class="text-gray-600">${formDescription}</p>
            </div>
            
            <form id="standaloneForm" class="space-y-6">
                ${fieldsHTML}
                
                <div class="pt-6 border-t border-gray-200">
                    <button
                        type="submit"
                        class="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-md focus:ring-2 focus:outline-none transition-all"
                    >
                        ${submitText}
                    </button>
                </div>
            </form>
        </div>
    </div>
    
<script>
        // Form configuration
        const formConfig = ${JSON.stringify({ fields, successMessage: successMsg })};
        let formData = {};
        let validationErrors = {};
        let uploadedFiles = {};
        
        // File handling functions
        function handleFileChange(input, fieldId) {
            const files = Array.from(input.files);
            const field = formConfig.fields.find(f => f.id === fieldId);
            
            if (!field) return;
            
            // Validate files
            const errors = validateFiles(field, files);
            if (errors.length > 0) {
                showToast(errors.join(', '), 'error');
                input.value = '';
                return;
            }
            
            // Process files
            processFiles(field, files, fieldId);
        }
        
        function validateFiles(field, files) {
            const errors = [];
            
            // Check file count for non-multiple fields
            if (!field.multiple && files.length > 1) {
                errors.push('Only one file allowed');
            }
            
            // Check file sizes
            if (field.maxSize) {
                const maxSizeBytes = field.maxSize * 1024 * 1024;
                files.forEach(file => {
                    if (file.size > maxSizeBytes) {
                        errors.push(file.name + ' exceeds size limit of ' + field.maxSize + 'MB');
                    }
                });
            }
            
            // Check file types
            if (field.accept) {
                const acceptedTypes = field.accept.split(',').map(type => type.trim());
                files.forEach(file => {
                    const isValidType = acceptedTypes.some(acceptedType => {
                        if (acceptedType.startsWith('.')) {
                            return file.name.toLowerCase().endsWith(acceptedType.toLowerCase());
                        }
                        return file.type.match(acceptedType.replace('*', '.*'));
                    });
                    if (!isValidType) {
                        errors.push(file.name + ' is not an accepted file type');
                    }
                });
            }
            
            return errors;
        }
        
        function processFiles(field, files, fieldId) {
            const progressContainer = document.getElementById(fieldId + '-upload-progress');
            const filesContainer = document.getElementById(fieldId + '-files');
            
            if (!uploadedFiles[fieldId]) {
                uploadedFiles[fieldId] = [];
            }
            
            files.forEach((file, index) => {
                // Show progress
                progressContainer.classList.remove('hidden');
                
                // Simulate upload progress
                let progress = 0;
                const progressBar = progressContainer.querySelector('.bg-blue-600');
                const progressInterval = setInterval(() => {
                    progress += 20;
                    progressBar.style.width = progress + '%';
                    
                    if (progress >= 100) {
                        clearInterval(progressInterval);
                        setTimeout(() => {
                            progressContainer.classList.add('hidden');
                        }, 500);
                        
                        // Add file to storage
                        const fileData = {
                            id: fieldId + '_' + Date.now() + '_' + index,
                            name: file.name,
                            size: file.size,
                            type: file.type,
                            fieldId: fieldId
                        };
                        
                        uploadedFiles[fieldId].push(fileData);
                        displayUploadedFile(filesContainer, fileData, fieldId);
                    }
                }, 100);
            });
            
            showToast(files.length + ' file(s) uploaded successfully');
        }
        

function displayUploadedFile(container, fileData, fieldId) {
            const fileDiv = document.createElement('div');
            fileDiv.innerHTML = \`
                <div class="flex items-center space-x-2">
                    <div class="w-4 h-4 bg-blue-500 rounded"></div>
                    <span class="text-sm font-medium">\${fileData.name}</span>
                    <span class="text-xs text-gray-500">(\${formatFileSize(fileData.size)})</span>
                </div>
                <div class="flex space-x-1">
                    <button onclick="downloadFile('\${fileData.id}')" class="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600">
                        Download
                    </button>
                    <button onclick="deleteFile('\${fileData.id}', '\${fieldId}', this.parentElement.parentElement)" class="px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600">
                        Delete
                    </button>
                </div>
            \`;
            container.appendChild(fileDiv);
        }
        
        function formatFileSize(bytes) {
            if (bytes === 0) return '0 Bytes';
            const k = 1024;
            const sizes = ['Bytes', 'KB', 'MB', 'GB'];
            const i = Math.floor(Math.log(bytes) / Math.log(k));
            return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
        }
        
        function downloadFile(fileId) {
            // In a real application, this would download the actual file
            showToast('File download initiated', 'success');
        }
        
        function deleteFile(fileId, fieldId, element) {
            if (uploadedFiles[fieldId]) {
                uploadedFiles[fieldId] = uploadedFiles[fieldId].filter(f => f.id !== fileId);
            }
            element.remove();
            showToast('File deleted successfully');
        }
        
        // Validation functions
        function validateField(field, value) {
            const errors = [];
            
            if (field.type === 'file') {
                // File validation is handled separately in handleFileChange
                if (field.required && (!uploadedFiles[field.id] || uploadedFiles[field.id].length === 0)) {
                    errors.push(field.label + ' is required');
                }
                return errors;
            }
            
            if (field.required && (!value || value.toString().trim() === '')) {
                errors.push(field.errorMessage || field.label + ' is required');
                return errors;
            }
            
            if (!value || value.toString().trim() === '') {
                return errors;
            }
            
            // Length validation
            if ((field.type === "text" || field.type === "textarea" || field.type === "email" || field.type === "url") && value) {
                if (field.minLength && value.length < field.minLength) {
                    errors.push(field.label + ' must be at least ' + field.minLength + ' characters');
                }
                if (field.maxLength && value.length > field.maxLength) {
                    errors.push(field.label + ' must not exceed ' + field.maxLength + ' characters');
                }
            }
            
// Email validation
            if (field.type === "email" && value) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) {
                    errors.push("Please enter a valid email address (e.g., name@example.com)");
                }
            }

            // Phone validation
            if (field.type === "phone" && value) {
                const phoneRegex = /^[\+]?[(]?[\d\s\-\(\)]{10,}$/;
                if (!phoneRegex.test(value)) {
                    errors.push("Please enter a valid phone number (e.g., (555) 123-4567)");
                }
            }

            // URL validation  
            if (field.type === "url" && value) {
                try {
                    new URL(value);
                } catch {
                    errors.push("Please enter a valid URL starting with http:// or https://");
                }
            }
            
            // URL validation
            if (field.type === "url" && value) {
                try {
                    new URL(value);
                } catch (e) {
                    errors.push("Please enter a valid URL");
                }
            }
            
            // Number validation
            if (field.type === "number" && value) {
                const numValue = parseFloat(value);
                if (field.min !== null && numValue < field.min) {
                    errors.push(field.label + ' must be at least ' + field.min);
                }
                if (field.max !== null && numValue > field.max) {
                    errors.push(field.label + ' must not exceed ' + field.max);
                }
            }
            
            return errors;
        }
        
        function showToast(message, type = 'success') {
            const toast = document.createElement('div');
            toast.className = 'toast';
            toast.style.backgroundColor = type === 'success' ? '#059669' : '#dc2626';
            toast.textContent = message;
            document.body.appendChild(toast);
            
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 3000);
        }
        
        function updateFieldError(fieldId, errors) {
            const errorDiv = document.getElementById(fieldId + '-error');
            const inputElement = document.getElementById(fieldId);
            
            if (errors && errors.length > 0) {
                errorDiv.innerHTML = errors.join('<br>');
                errorDiv.classList.remove('hidden');
                if (inputElement) {
                    inputElement.classList.add('border-red-500');
                    inputElement.classList.remove('border-gray-300');
                }
            } else {
                errorDiv.classList.add('hidden');
                if (inputElement) {
                    inputElement.classList.remove('border-red-500');
                    inputElement.classList.add('border-gray-300');
                }
            }
        }
        
        // Form submission handler
        document.getElementById('standaloneForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formDataObj = new FormData(this);
            const allErrors = {};
            let hasErrors = false;
            
            // Validate all fields
            formConfig.fields.forEach(field => {
                const value = formDataObj.get(field.id);
                const errors = validateField(field, value);
                
                if (errors.length > 0) {
                    allErrors[field.id] = errors;
                    hasErrors = true;
                }
                
                updateFieldError(field.id, errors.length > 0 ? errors : null);
                
                // Store form data
                if (field.type === 'multiselect') {
                    const selectElement = document.getElementById(field.id);
                    const selectedValues = Array.from(selectElement.selectedOptions).map(option => option.value);
                    formData[field.id] = selectedValues;
                } else if (field.type === 'file') {
                    formData[field.id] = uploadedFiles[field.id] || [];
                } else {
                    formData[field.id] = value;
                }
            });
            
            if (hasErrors) {
                showToast('Please fix the validation errors before submitting', 'error');
                return;
            }
            
            // Success handling
            const successDiv = document.getElementById('success-message');
            successDiv.textContent = formConfig.successMessage;
            successDiv.classList.remove('hidden');
            
            // Store in localStorage
            const submissions = JSON.parse(localStorage.getItem('formSubmissions') || '[]');
            submissions.push({
formTitle: \`\${formTitle}\`,
                data: formData,
                files: uploadedFiles,
                timestamp: new Date().toISOString()
            });
            localStorage.setItem('formSubmissions', JSON.stringify(submissions));
            
            showToast('Form submitted successfully!');
            
            // Reset form
            this.reset();
            formData = {};
            uploadedFiles = {};
            
            // Clear file displays
            formConfig.fields.forEach(field => {
                if (field.type === 'file') {
                    const filesContainer = document.getElementById(field.id + '-files');
                    if (filesContainer) {
                        filesContainer.innerHTML = '';
                    }
                }
                updateFieldError(field.id, null);
            });
            
            // Hide success message after 5 seconds
            setTimeout(() => {
                successDiv.classList.add('hidden');
            }, 5000);
        });
        
        // Real-time validation
        formConfig.fields.forEach(field => {
            const element = document.getElementById(field.id);
            if (element && field.type !== 'file') {
                element.addEventListener('blur', function() {
                    const errors = validateField(field, this.value);
                    updateFieldError(field.id, errors.length > 0 ? errors : null);
                });
            }
        });
        
        console.log('Standalone form initialized with', formConfig.fields.length, 'fields');
    </script>
</body>
</html>`;

    return html;
}

// Generate a shareable public link for a form
async generateShareableLink(formConfig) {
    await this.ensureInitialized();
    await this.delay();
    
    try {
      // Validate form config
      if (!formConfig || !formConfig.fields) {
        throw new Error('Valid form configuration is required');
      }

      // Generate a unique share ID
      const shareId = 'form_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      
      // Create shared form data
      const sharedForm = {
        shareId,
        title: formConfig.settings?.title || formConfig.title || 'Untitled Form',
        description: formConfig.settings?.description || formConfig.description || '',
        fields: formConfig.fields || [],
        settings: formConfig.settings || {},
        theme: formConfig.theme || null,
        createdAt: new Date().toISOString(),
        isPublic: true,
        version: 1
      };

      // Store in localStorage (in real app, would be database)
      try {
        const existingSharedForms = JSON.parse(localStorage.getItem('sharedForms') || '[]');
        existingSharedForms.push(sharedForm);
        localStorage.setItem('sharedForms', JSON.stringify(existingSharedForms));
      } catch (storageError) {
        console.warn('LocalStorage error, using memory storage:', storageError);
        // In production, this would fallback to server storage
      }

      // Generate public URL
      const baseUrl = window.location.origin;
      const shareUrl = `${baseUrl}/form/${shareId}`;

      return {
        success: true,
        shareUrl,
        shareId,
        message: 'Shareable link generated successfully',
        form: sharedForm
      };

    } catch (error) {
      console.error('Error generating shareable link:', error);
      throw new Error(`Failed to generate shareable link: ${error.message}`);
    }
  }

  // Get shared form by share ID
  async getSharedForm(shareId) {
    await this.ensureInitialized();
    await this.delay();
    
    try {
      if (!shareId) {
        throw new Error('Share ID is required');
      }

      const sharedForms = JSON.parse(localStorage.getItem('sharedForms') || '[]');
      const sharedForm = sharedForms.find(form => form.shareId === shareId);

      if (!sharedForm) {
        throw new Error('Shared form not found or may have expired');
      }

      return {
        success: true,
        form: sharedForm
      };

    } catch (error) {
      console.error('Error fetching shared form:', error);
      throw new Error(error.message || 'Shared form not found or expired');
    }
  }

// Get submissions for a specific form
  async getSubmissionsByFormId(formId) {
    await this.ensureInitialized();
    await this.delay();
    
    try {
      if (!formId) {
        throw new Error('Form ID is required');
      }

      const { default: formSubmissionService } = await import('./formSubmissionService');
      const submissions = await formSubmissionService.getByFormId(formId);
      return submissions || [];
    } catch (error) {
      console.error('Error fetching form submissions:', error);
      return []; // Return empty array instead of throwing
    }
  }

  // Get submission statistics for a form
  async getFormSubmissionStats(formId) {
    await this.ensureInitialized();
    await this.delay();
    
    try {
      if (!formId) {
        throw new Error('Form ID is required');
      }

      const { default: formSubmissionService } = await import('./formSubmissionService');
      const stats = await formSubmissionService.getSubmissionStats(formId);
      return stats || { total: 0, today: 0, thisWeek: 0, thisMonth: 0 };
    } catch (error) {
      console.error('Error fetching submission stats:', error);
      return { total: 0, today: 0, thisWeek: 0, thisMonth: 0 };
    }
  }
}

export default new FormService();