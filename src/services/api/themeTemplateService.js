const themeTemplates = [
  {
    id: 1,
    name: "Modern",
    description: "Clean and contemporary design",
    thumbnail: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    styles: {
      container: "bg-white rounded-xl shadow-xl border-0 p-8",
      title: "text-3xl font-bold text-gray-900 mb-3 tracking-tight",
      description: "text-gray-600 text-lg mb-6",
      fieldLabel: "text-sm font-semibold text-gray-700 mb-2 tracking-wide uppercase",
      input: "w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-300 text-gray-900 bg-white",
      submitButton: "w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-4 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1",
      formSpacing: "space-y-6"
    }
  },
  {
    id: 2,
    name: "Minimal",
    description: "Simple and clean aesthetic",
    thumbnail: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
    styles: {
      container: "bg-gray-50 rounded-none shadow-none border border-gray-200 p-12",
      title: "text-2xl font-light text-gray-800 mb-2 tracking-wide",
      description: "text-gray-500 text-base mb-8 font-light",
      fieldLabel: "text-xs font-medium text-gray-600 mb-1 uppercase tracking-wider",
      input: "w-full px-0 py-3 border-0 border-b border-gray-300 focus:ring-0 focus:border-gray-600 transition-colors duration-200 text-gray-800 bg-transparent placeholder-gray-400",
      submitButton: "w-full bg-gray-800 hover:bg-gray-900 text-white font-light py-3 px-8 rounded-none transition-colors duration-200",
      formSpacing: "space-y-8"
    }
  },
  {
    id: 3,
    name: "Corporate",
    description: "Professional business style",
    thumbnail: "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)",
    styles: {
      container: "bg-slate-50 rounded-lg shadow-md border border-slate-300 p-10",
      title: "text-3xl font-bold text-slate-800 mb-4 font-serif",
      description: "text-slate-600 text-base mb-6",
      fieldLabel: "text-sm font-medium text-slate-700 mb-2",
      input: "w-full px-4 py-3 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-slate-800 bg-white",
      submitButton: "w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-md shadow-sm hover:shadow-md transition-all duration-200",
      formSpacing: "space-y-5"
    }
  },
  {
    id: 4,
    name: "Playful",
    description: "Fun and vibrant design",
    thumbnail: "linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #fecfef 100%)",
    styles: {
      container: "bg-gradient-to-br from-pink-50 to-purple-50 rounded-2xl shadow-2xl border-4 border-pink-200 p-8",
      title: "text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600 mb-4",
      description: "text-purple-600 text-lg mb-6 font-medium",
      fieldLabel: "text-sm font-bold text-pink-600 mb-2",
      input: "w-full px-4 py-3 border-3 border-pink-300 rounded-xl focus:ring-4 focus:ring-pink-200 focus:border-pink-500 transition-all duration-300 text-gray-800 bg-white shadow-sm",
      submitButton: "w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105",
      formSpacing: "space-y-6"
    }
  }
];

export const themeTemplateService = {
  getAll: () => {
    return [...themeTemplates];
  },

  getById: (id) => {
    if (typeof id !== 'number') {
      console.warn('Theme ID must be a number');
      return null;
    }
    return themeTemplates.find(theme => theme.id === id) || null;
  },

  getDefaultTheme: () => {
    return themeTemplates[0]; // Modern theme as default
  }
};

export default themeTemplateService;