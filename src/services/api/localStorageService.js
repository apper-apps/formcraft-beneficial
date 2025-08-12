class LocalStorageService {
  constructor() {
    this.storageKey = 'formcraft_saved_forms';
    this.delay = 100;
  }

  async delay() {
    return new Promise(resolve => setTimeout(resolve, this.delay));
  }

  async getSavedForms() {
    await this.delay();
    try {
      const data = localStorage.getItem(this.storageKey);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return [];
    }
  }

  async saveForm(formData) {
    await this.delay();
    try {
      const savedForms = await this.getSavedForms();
      const formId = Date.now();
      const newForm = {
        id: formId,
        name: formData.name || 'Untitled Form',
        formSettings: formData.formSettings,
        fields: formData.fields,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      savedForms.push(newForm);
      localStorage.setItem(this.storageKey, JSON.stringify(savedForms));
      return newForm;
    } catch (error) {
      console.error('Error saving to localStorage:', error);
      throw new Error('Failed to save form to local storage');
    }
  }

  async loadForm(formId) {
    await this.delay();
    try {
      const savedForms = await this.getSavedForms();
      const form = savedForms.find(f => f.id === formId);
      return form || null;
    } catch (error) {
      console.error('Error loading from localStorage:', error);
      throw new Error('Failed to load form from local storage');
    }
  }

  async renameForm(formId, newName) {
    await this.delay();
    try {
      const savedForms = await this.getSavedForms();
      const formIndex = savedForms.findIndex(f => f.id === formId);
      
      if (formIndex === -1) {
        throw new Error('Form not found');
      }

      savedForms[formIndex].name = newName;
      savedForms[formIndex].updatedAt = new Date().toISOString();
      
      localStorage.setItem(this.storageKey, JSON.stringify(savedForms));
      return savedForms[formIndex];
    } catch (error) {
      console.error('Error renaming form:', error);
      throw new Error('Failed to rename form');
    }
  }

  async deleteForm(formId) {
    await this.delay();
    try {
      const savedForms = await this.getSavedForms();
      const filteredForms = savedForms.filter(f => f.id !== formId);
      
      if (filteredForms.length === savedForms.length) {
        throw new Error('Form not found');
      }

      localStorage.setItem(this.storageKey, JSON.stringify(filteredForms));
      return true;
    } catch (error) {
      console.error('Error deleting form:', error);
      throw new Error('Failed to delete form');
    }
  }

  async clearAllForms() {
    await this.delay();
    try {
      localStorage.removeItem(this.storageKey);
      return true;
    } catch (error) {
      console.error('Error clearing localStorage:', error);
      throw new Error('Failed to clear saved forms');
}
  }

  async getTheme() {
    try {
      return localStorage.getItem('formcraft_theme') || 'light';
    } catch (error) {
      console.error('Error reading theme preference:', error);
      return 'light';
    }
  }

  async saveTheme(theme) {
    try {
      localStorage.setItem('formcraft_theme', theme);
      return true;
    } catch (error) {
      console.error('Error saving theme preference:', error);
      throw new Error('Failed to save theme preference');
    }
  }
}

export default new LocalStorageService();