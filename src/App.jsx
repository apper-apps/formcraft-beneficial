import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import PublicFormViewer from "@/components/pages/PublicFormViewer";
import { ThemeProvider, useTheme } from "@/contexts/ThemeContext";
import FormBuilder from "@/components/pages/FormBuilder";
import AdminPanel from "@/components/pages/AdminPanel";

const AppContent = () => {
  const { isDark } = useTheme();
  
return (
    <BrowserRouter>
<div className="min-h-screen bg-background dark:bg-gradient-to-br dark:from-dark-900 dark:via-dark-800 dark:to-dark-900 transition-colors duration-300 relative z-10" style={{ 
  backgroundImage: 'linear-gradient(rgba(59, 130, 246, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(59, 130, 246, 0.03) 1px, transparent 1px), radial-gradient(circle at 25% 25%, rgba(59, 130, 246, 0.3) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(6, 182, 212, 0.3) 0%, transparent 50%)',
  backgroundSize: '50px 50px, 50px 50px, 100% 100%, 100% 100%'
}}>
        <Routes>
<Route path="/" element={<FormBuilder />} />
          <Route path="/admin" element={<AdminPanel />} />
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