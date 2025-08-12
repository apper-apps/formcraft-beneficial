import fieldTypesData from "@/services/mockData/fieldTypes.json";

class FieldTypeService {
  constructor() {
    this.fieldTypes = [...fieldTypesData];
    this.delay = 200;
  }

  async delay() {
    return new Promise(resolve => setTimeout(resolve, this.delay));
  }

  async getAll() {
    await this.delay();
    return [...this.fieldTypes];
  }

  async getById(id) {
    await this.delay();
    const fieldType = this.fieldTypes.find(type => type.Id === parseInt(id));
    return fieldType ? { ...fieldType } : null;
  }

  async getByType(type) {
    await this.delay();
    const fieldType = this.fieldTypes.find(ft => ft.type === type);
    return fieldType ? { ...fieldType } : null;
  }

  async getSupportedTypes() {
    await this.delay();
    return this.fieldTypes.map(ft => ({
      type: ft.type,
      name: ft.name,
      icon: ft.icon,
      description: ft.description
    }));
  }

  createFieldFromType(type, customProperties = {}) {
    const fieldType = this.fieldTypes.find(ft => ft.type === type);
    if (!fieldType) {
      throw new Error(`Unsupported field type: ${type}`);
    }

    const baseField = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      type: fieldType.type,
      label: fieldType.defaultLabel || `${fieldType.name} Field`,
      required: false,
      ...customProperties
    };

    // Add type-specific properties
switch (type) {
      case "text":
      case "email":
      case "phone":
      case "url":
        baseField.placeholder = fieldType.defaultPlaceholder || "";
        break;
      case "textarea":
        baseField.placeholder = fieldType.defaultPlaceholder || "";
        baseField.rows = 3;
        baseField.maxLength = null;
        break;
      case "number":
        baseField.placeholder = fieldType.defaultPlaceholder || "";
        baseField.min = null;
        baseField.max = null;
        baseField.step = 1;
        break;
      case "file":
        baseField.accept = "";
        baseField.maxSize = null;
        baseField.multiple = false;
        break;
      case "dropdown":
      case "radio":
      case "multiselect":
        baseField.options = fieldType.defaultOptions || [];
        if (type === "multiselect") {
          baseField.maxSelections = null;
        }
        break;
      case "checkbox":
        baseField.defaultChecked = false;
        break;
      case "date":
        baseField.minDate = null;
        baseField.maxDate = null;
        break;
    }

    return baseField;
  }
}

export default new FieldTypeService();