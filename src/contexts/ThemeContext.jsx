import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(false);

  // Load theme preference from localStorage on mount
  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem('formcraft_theme');
      if (savedTheme) {
        const isDarkSaved = savedTheme === 'dark';
        setIsDark(isDarkSaved);
        updateDocumentTheme(isDarkSaved);
      } else {
        // Check system preference
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setIsDark(prefersDark);
        updateDocumentTheme(prefersDark);
      }
    } catch (error) {
      console.error('Error loading theme preference:', error);
    }
  }, []);

  const updateDocumentTheme = (isDarkMode) => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const toggleTheme = async () => {
    try {
      const newIsDark = !isDark;
      setIsDark(newIsDark);
      updateDocumentTheme(newIsDark);
      
      // Save to localStorage
      localStorage.setItem('formcraft_theme', newIsDark ? 'dark' : 'light');
    } catch (error) {
      console.error('Error saving theme preference:', error);
    }
  };

  const value = {
    isDark,
    toggleTheme,
    theme: isDark ? 'dark' : 'light'
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContext;