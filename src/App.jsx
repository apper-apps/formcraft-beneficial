import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import PublicFormViewer from "@/components/pages/PublicFormViewer";
import { ThemeProvider, useTheme } from "@/contexts/ThemeContext";
import FormBuilder from "@/components/pages/FormBuilder";

const AppContent = () => {
  const { isDark } = useTheme();
  
  return (
    <BrowserRouter>
<div className="min-h-screen bg-background dark:bg-gray-900 transition-colors duration-200">
        <Routes>
          <Route path="/" element={<FormBuilder />} />
          <Route path="/form/:shareId" element={<PublicFormViewer />} />
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