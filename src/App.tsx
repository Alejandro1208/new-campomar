import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginForm from './components/admin/LoginForm';
import AdminLayout from './pages/AdminLayout';
import Dashboard from './components/admin/Dashboard';
import EditProducts from './components/admin/EditProducts';
import EditTopBar from './components/admin/EditTopBar';
import EditNavigation from './components/admin/EditNavigation';
import EditBanner from './components/admin/EditBanner';
import EditCompany from './components/admin/EditCompany';
import EditTimeline from './components/admin/EditTimeline';
import EditLocation from './components/admin/EditLocation';
import EditContact from './components/admin/EditContact';
import EditSettings from './components/admin/EditSettings';
import { useAuthStore } from './store/useAuthStore';

// Componente de Ruta Protegida
const ProtectedRoute: React.FC<{ element: React.ReactNode }> = ({ element }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return isAuthenticated ? element : <Navigate to="/admin" />;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Rutas Públicas */}
        <Route path="/" element={<HomePage />} />
        <Route path="/admin" element={<LoginForm />} />
        
        {/* Rutas de Administración */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<ProtectedRoute element={<Dashboard />} />} />
          <Route path="topbar" element={<ProtectedRoute element={<EditTopBar />} />} />
          <Route path="navigation" element={<ProtectedRoute element={<EditNavigation />} />} />
          <Route path="banner" element={<ProtectedRoute element={<EditBanner />} />} />
          <Route path="company" element={<ProtectedRoute element={<EditCompany />} />} />
          <Route path="timeline" element={<ProtectedRoute element={<EditTimeline />} />} />
          <Route path="products" element={<ProtectedRoute element={<EditProducts />} />} />
          <Route path="location" element={<ProtectedRoute element={<EditLocation />} />} />
          <Route path="contact" element={<ProtectedRoute element={<EditContact />} />} />
          <Route path="settings" element={<ProtectedRoute element={<EditSettings />} />} />
        </Route>
        
        {/* Ruta por defecto */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;