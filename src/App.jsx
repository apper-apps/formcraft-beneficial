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
<div className="min-h-screen transition-colors duration-300 relative z-10" style={{ 
  background: 'var(--bg-primary)',
  backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px), radial-gradient(circle at 30% 50%, rgba(59, 130, 246, 0.1) 0%, transparent 50%), radial-gradient(circle at 70% 80%, rgba(147, 51, 234, 0.1) 0%, transparent 50%)',
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
          theme="dark"
          style={{ zIndex: 'var(--z-modal-overlay)' }}
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