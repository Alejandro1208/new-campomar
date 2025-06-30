import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import Categories from './pages/admin/Categories';
import AdminLayout from './components/admin/AdminLayout';
import ProtectedRoute from './components/admin/ProtectedRoute';
import Products from './pages/admin/Products';
import Banners from './pages/admin/Banners';
import Settings from './pages/admin/Settings';
import ContactPhones from './pages/admin/ContactPhones';
import Company from './pages/admin/Company';

function App() {
  return (
    <Router>
      <Routes>
        {/* Página pública */}
        <Route path="/" element={<Home />} />
        
        {/* Rutas de administración */}
        <Route path="/admin/login" element={<Login />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="categories" element={<Categories />} />
          <Route path="products" element={<Products />} />
          <Route path="banners" element={<Banners />} />
          <Route path="timeline" element={<div className="text-center py-12"><p className="text-gray-600">Sección de Línea de Tiempo - En desarrollo</p></div>} />
          <Route path="settings" element={<Settings />} />
          <Route path="company" element={<Company />} />
          <Route path="phones" element={<ContactPhones />} />


        </Route>

        {/* Redirigir rutas no encontradas */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;