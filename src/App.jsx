import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import FormBuilder from "@/components/pages/FormBuilder";
import { ThemeProvider, useTheme } from "@/contexts/ThemeContext";

const AppContent = () => {
  const { isDark } = useTheme();
  
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background dark:bg-gray-900 transition-colors duration-200">
        <Routes>
          <Route path="/" element={<FormBuilder />} />
        </Routes>
        
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme={isDark ? "dark" : "light"}
          style={{ zIndex: 9999 }}
        />
      </div>
    </BrowserRouter>
  );
};
function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;