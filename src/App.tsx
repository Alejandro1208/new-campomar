import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import Categories from './pages/admin/Categories';
import AdminLayout from './components/admin/AdminLayout';
import ProtectedRoute from './components/admin/ProtectedRoute';

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
          <Route path="products" element={<div className="text-center py-12"><p className="text-gray-600">Sección de Productos - En desarrollo</p></div>} />
          <Route path="banners" element={<div className="text-center py-12"><p className="text-gray-600">Sección de Banners - En desarrollo</p></div>} />
          <Route path="timeline" element={<div className="text-center py-12"><p className="text-gray-600">Sección de Línea de Tiempo - En desarrollo</p></div>} />
          <Route path="settings" element={<div className="text-center py-12"><p className="text-gray-600">Sección de Configuraciones - En desarrollo</p></div>} />
          <Route path="stats" element={<div className="text-center py-12"><p className="text-gray-600">Sección de Estadísticas - En desarrollo</p></div>} />
        </Route>

        {/* Redirigir rutas no encontradas */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;