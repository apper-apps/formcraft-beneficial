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
}

export default new FormService();