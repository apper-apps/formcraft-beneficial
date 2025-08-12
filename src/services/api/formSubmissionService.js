class FormSubmissionService {
  constructor() {
    this.submissions = this.initializeMockData();
    this.delay = 300;
  }

  initializeMockData() {
    const now = new Date();
    const mockData = [];
    
    // Generate realistic mock submissions
    const forms = [
      { id: 1, title: "Customer Feedback Survey" },
      { id: 2, title: "Event Registration Form" },
      { id: 3, title: "Contact Us Form" },
      { id: 4, title: "Product Inquiry Form" }
    ];

    const names = ["John Doe", "Jane Smith", "Alice Johnson", "Bob Wilson", "Sarah Davis", "Mike Brown", "Emily Taylor", "David Lee"];
    const emails = ["john@example.com", "jane@example.com", "alice@example.com", "bob@example.com", "sarah@example.com", "mike@example.com", "emily@example.com", "david@example.com"];
    const companies = ["Acme Corp", "Tech Solutions", "Global Industries", "Creative Agency", "Digital Works", "Business Pro", "Innovation Lab", "Future Tech"];

    for (let i = 1; i <= 25; i++) {
      const form = forms[Math.floor(Math.random() * forms.length)];
      const randomDaysAgo = Math.floor(Math.random() * 30);
      const submissionDate = new Date(now);
      submissionDate.setDate(submissionDate.getDate() - randomDaysAgo);
      
      const name = names[Math.floor(Math.random() * names.length)];
      const email = emails[Math.floor(Math.random() * emails.length)];
      const company = companies[Math.floor(Math.random() * companies.length)];

      let submissionData = {};
      
      // Generate different data based on form type
      switch (form.id) {
        case 1: // Customer Feedback
          submissionData = {
            name: name,
            email: email,
            rating: Math.floor(Math.random() * 5) + 1,
            feedback: "Great service! Really satisfied with the experience. The team was professional and responsive.",
            recommend: Math.random() > 0.3 ? "Yes" : "No"
          };
          break;
        case 2: // Event Registration
          submissionData = {
            name: name,
            email: email,
            company: company,
            attendees: Math.floor(Math.random() * 5) + 1,
            dietary: Math.random() > 0.7 ? "Vegetarian" : "None",
            comments: "Looking forward to the event!"
          };
          break;
        case 3: // Contact Us
          submissionData = {
            name: name,
            email: email,
            phone: `+1-555-${String(Math.floor(Math.random() * 9000) + 1000)}`,
            subject: "General Inquiry",
            message: "Hi, I'm interested in learning more about your services. Could someone please get back to me?"
          };
          break;
        case 4: // Product Inquiry
          submissionData = {
            name: name,
            email: email,
            company: company,
            product: ["Software Solution", "Consulting Services", "Training Program"][Math.floor(Math.random() * 3)],
            budget: ["$1,000-$5,000", "$5,000-$10,000", "$10,000+"][Math.floor(Math.random() * 3)],
            timeline: ["Immediate", "1-3 months", "3-6 months"][Math.floor(Math.random() * 3)]
          };
          break;
      }

      mockData.push({
        Id: i,
        formId: form.id,
        formTitle: form.title,
        data: submissionData,
        submittedAt: submissionDate.toISOString(),
        ipAddress: `192.168.1.${Math.floor(Math.random() * 255)}`,
        userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        referrer: Math.random() > 0.5 ? "https://google.com" : null,
        metadata: {
          fieldCount: Object.keys(submissionData).length,
          hasFileUploads: Math.random() > 0.8,
          submissionSource: "public_form",
          processingTime: Math.floor(Math.random() * 500) + 100
        }
      });
    }

    return mockData;
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

    const last7Days = new Date();
    last7Days.setDate(last7Days.getDate() - 7);
    const weeklySubmissions = targetSubmissions.filter(sub => 
      new Date(sub.submittedAt) >= last7Days
    ).length;

    return {
      total: totalSubmissions,
      today: todaySubmissions,
      lastWeek: weeklySubmissions,
      lastMonth: monthlySubmissions,
      averagePerDay: monthlySubmissions / 30
    };
  }

  async searchSubmissions(searchTerm, filters = {}) {
    await this.delay();
    
    let filteredSubmissions = [...this.submissions];

    // Apply search term
    if (searchTerm && searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filteredSubmissions = filteredSubmissions.filter(sub => {
        // Search in form title
        if (sub.formTitle.toLowerCase().includes(term)) return true;
        
        // Search in submission data
        const dataString = JSON.stringify(sub.data).toLowerCase();
        if (dataString.includes(term)) return true;
        
        // Search in IP address
        if (sub.ipAddress && sub.ipAddress.includes(term)) return true;
        
        return false;
      });
    }

    // Apply form filter
    if (filters.formId) {
      filteredSubmissions = filteredSubmissions.filter(sub => sub.formId === parseInt(filters.formId));
    }

    // Apply date range filter
    if (filters.startDate) {
      const startDate = new Date(filters.startDate);
      filteredSubmissions = filteredSubmissions.filter(sub => new Date(sub.submittedAt) >= startDate);
    }

    if (filters.endDate) {
      const endDate = new Date(filters.endDate);
      endDate.setHours(23, 59, 59, 999);
      filteredSubmissions = filteredSubmissions.filter(sub => new Date(sub.submittedAt) <= endDate);
    }

    return filteredSubmissions.map(sub => ({ ...sub }));
  }

  async getFormSubmissionCounts() {
    await this.delay();
    
    const counts = {};
    this.submissions.forEach(sub => {
      if (!counts[sub.formId]) {
        counts[sub.formId] = {
          formId: sub.formId,
          formTitle: sub.formTitle,
          count: 0
        };
      }
      counts[sub.formId].count++;
    });

    return Object.values(counts);
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