import formsData from "@/services/mockData/forms.json";

class FormService {
  constructor() {
    this.forms = [...formsData];
    this.delay = 300;
  }

  async delay() {
    return new Promise(resolve => setTimeout(resolve, this.delay));
  }

  async getAll() {
    await this.delay();
    return [...this.forms];
  }

  async getById(id) {
    await this.delay();
    const form = this.forms.find(form => form.Id === parseInt(id));
    return form ? { ...form } : null;
  }

async create(formData) {
    await this.delay();
    const newForm = {
      Id: Math.max(...this.forms.map(f => f.Id), 0) + 1,
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
      fields: formData.fields || [],
      createdAt: new Date().toISOString()
    };
    this.forms.push(newForm);
    return { ...newForm };
  }

  async update(id, formData) {
    await this.delay();
    const index = this.forms.findIndex(form => form.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Form not found");
    }
    
    this.forms[index] = {
      ...this.forms[index],
      ...formData,
      updatedAt: new Date().toISOString()
    };
    return { ...this.forms[index] };
  }

  async delete(id) {
    await this.delay();
    const index = this.forms.findIndex(form => form.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Form not found");
    }
    
    const deletedForm = this.forms.splice(index, 1)[0];
    return { ...deletedForm };
  }

async saveFormConfig(formConfig) {
    await this.delay();
    const savedForm = await this.create(formConfig);
    return savedForm;
  }

  async exportFormConfig(formId) {
    await this.delay();
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
      fields: form.fields,
      exportedAt: new Date().toISOString()
    };
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
      body { font-family: 'Inter', system-ui, sans-serif; margin: 0; background-color: #f9fafb; color: #111827; }
      .form-container { max-width: 42rem; margin: 0 auto; padding: 2rem 1rem; }
      .success-message { background-color: #dcfce7; color: #166534; padding: 1rem; border-radius: 0.5rem; margin-bottom: 1rem; border: 1px solid #bbf7d0; }
      .error-message { background-color: #fef2f2; color: #dc2626; padding: 0.5rem; border-radius: 0.375rem; margin-top: 0.25rem; border: 1px solid #fecaca; }
      .toast { position: fixed; top: 1rem; right: 1rem; background: #059669; color: white; padding: 1rem; border-radius: 0.5rem; z-index: 1000; }
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
              placeholder="${field.placeholder || 'Enter phone number...'}"
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
            <input
              type="file"
              id="${field.id}"
              name="${field.id}"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:border-blue-500 focus:outline-none transition-all"
              ${field.required ? 'required' : ''}
              ${field.accept ? `accept="${field.accept}"` : ''}
              ${field.multiple ? 'multiple' : ''}
            />
            ${field.maxSize ? `<p class="mt-1 text-xs text-gray-500">Maximum file size: ${field.maxSize}MB</p>` : ''}`;
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
        
        // Validation functions
        function validateField(field, value) {
            const errors = [];
            
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
                const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
                if (!emailRegex.test(value)) {
                    errors.push("Please enter a valid email address");
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
                inputElement.classList.add('border-red-500');
                inputElement.classList.remove('border-gray-300');
            } else {
                errorDiv.classList.add('hidden');
                inputElement.classList.remove('border-red-500');
                inputElement.classList.add('border-gray-300');
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
                formTitle: '${formTitle}',
                data: formData,
                timestamp: new Date().toISOString()
            });
            localStorage.setItem('formSubmissions', JSON.stringify(submissions));
            
            showToast('Form submitted successfully!');
            
            // Reset form
            this.reset();
            formData = {};
            
            // Clear all errors
            formConfig.fields.forEach(field => {
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
            if (element) {
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
}

export default new FormService();