class FormSubmissionService {
  constructor() {
    this.submissions = [];
    this.delay = 300;
  }

  async delay() {
    return new Promise(resolve => setTimeout(resolve, this.delay));
  }

  async getAll() {
    await this.delay();
    return [...this.submissions];
  }

  async getById(id) {
    await this.delay();
    if (!Number.isInteger(id)) {
      throw new Error("ID must be an integer");
    }
    const submission = this.submissions.find(sub => sub.Id === id);
    return submission ? { ...submission } : null;
  }

  async create(submissionData) {
    await this.delay();
    
    if (!submissionData.formId) {
      throw new Error("Form ID is required for submission");
    }

    const newSubmission = {
      Id: Math.max(...this.submissions.map(s => s.Id), 0) + 1,
      formId: submissionData.formId,
      formTitle: submissionData.formTitle || "Untitled Form",
      data: submissionData.data || {},
      submittedAt: new Date().toISOString(),
      ipAddress: submissionData.ipAddress || null,
      userAgent: submissionData.userAgent || null,
      referrer: submissionData.referrer || null,
      metadata: {
        fieldCount: Object.keys(submissionData.data || {}).length,
        hasFileUploads: submissionData.hasFileUploads || false,
        submissionSource: submissionData.submissionSource || "public_form",
        ...submissionData.metadata
      }
    };

    this.submissions.push(newSubmission);
    return { ...newSubmission };
  }

  async update(id, submissionData) {
    await this.delay();
    
    if (!Number.isInteger(id)) {
      throw new Error("ID must be an integer");
    }

    const index = this.submissions.findIndex(sub => sub.Id === id);
    if (index === -1) {
      throw new Error("Submission not found");
    }
    
    this.submissions[index] = {
      ...this.submissions[index],
      ...submissionData,
      updatedAt: new Date().toISOString()
    };
    
    return { ...this.submissions[index] };
  }

  async delete(id) {
    await this.delay();
    
    if (!Number.isInteger(id)) {
      throw new Error("ID must be an integer");
    }

    const index = this.submissions.findIndex(sub => sub.Id === id);
    if (index === -1) {
      throw new Error("Submission not found");
    }
    
    const deletedSubmission = this.submissions.splice(index, 1)[0];
    return { ...deletedSubmission };
  }

  async getByFormId(formId) {
    await this.delay();
    
    if (!formId) {
      throw new Error("Form ID is required");
    }

    const formSubmissions = this.submissions.filter(sub => sub.formId === formId);
    return formSubmissions.map(sub => ({ ...sub }));
  }

  async getSubmissionStats(formId = null) {
    await this.delay();
    
    let targetSubmissions = this.submissions;
    
    if (formId) {
      targetSubmissions = this.submissions.filter(sub => sub.formId === formId);
    }

    const totalSubmissions = targetSubmissions.length;
    const today = new Date().toDateString();
    const todaySubmissions = targetSubmissions.filter(sub => 
      new Date(sub.submittedAt).toDateString() === today
    ).length;

    const last30Days = new Date();
    last30Days.setDate(last30Days.getDate() - 30);
    const monthlySubmissions = targetSubmissions.filter(sub => 
      new Date(sub.submittedAt) >= last30Days
    ).length;

    return {
      total: totalSubmissions,
      today: todaySubmissions,
      lastMonth: monthlySubmissions,
      averagePerDay: monthlySubmissions / 30
    };
  }

  async exportSubmissions(formId = null, format = 'json') {
    await this.delay();
    
    let submissions = this.submissions;
    
    if (formId) {
      submissions = this.submissions.filter(sub => sub.formId === formId);
    }

    const exportData = submissions.map(sub => ({
      id: sub.Id,
      formId: sub.formId,
      formTitle: sub.formTitle,
      submittedAt: sub.submittedAt,
      data: sub.data,
      metadata: sub.metadata
    }));

    return {
      data: exportData,
      format,
      exportedAt: new Date().toISOString(),
      totalRecords: exportData.length
    };
  }
}

export default new FormSubmissionService();