// src/components/admin/AdminLayout.tsx (CORREGIDO)

import { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Home, ShoppingBag, Image, Clock, Settings, LogOut, Tag, Phone, Building2 } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useSiteSettings } from '../../hooks/useData'; // <-- 1. IMPORTAR HOOK

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const { settings } = useSiteSettings(); // <-- 2. LLAMAR AL HOOK

  const menuItems = [
    { icon: Home, label: 'Dashboard', path: '/admin' },
    { icon: ShoppingBag, label: 'Productos', path: '/admin/products' },
    { icon: Tag, label: 'Categorías', path: '/admin/categories' },
    { icon: Image, label: 'Banners', path: '/admin/banners' },
    { icon: Building2, label: 'La Empresa', path: '/admin/company' },
    { icon: Clock, label: 'Línea de Tiempo', path: '/admin/timeline' },
    { icon: Settings, label: 'Configuraciones', path: '/admin/settings' },
    { icon: Phone, label: 'Teléfonos Footer', path: '/admin/phones' },
  ];

  const handleSignOut = async () => {
    await signOut();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          {/* 3. LÓGICA DEL LOGO CORREGIDA */}
          <Link to="/" className="flex items-center">
            {settings.site_logo_url ? (
              <img src={`https://alejandrosabater.com.ar${settings.site_logo_url}`} alt="Logo Campomar" className="h-8" />
            ) : (
              <h2 className="text-xl font-bold text-primary">CAMPOMAR</h2>
            )}
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>
        
        <nav className="mt-8">
          {/* ... (el resto del menú no cambia) ... */}
          {menuItems.map((item) => (
            <Link key={item.path} to={item.path} className={`flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100 hover:text-primary transition-colors duration-200 ${location.pathname === item.path ? 'bg-primary bg-opacity-10 text-primary border-r-4 border-primary' : ''}`} onClick={() => setSidebarOpen(false)}>
              <item.icon size={20} className="mr-3" />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-0 w-full p-6 border-t border-gray-200">
          {/* ... (el botón de logout no cambia) ... */}
          <button onClick={handleSignOut} className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors duration-200">
            <LogOut size={20} className="mr-3" />
            Cerrar Sesión
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* ... (el resto del layout no cambia) ... */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between h-16 px-6">
            <button onClick={() => setSidebarOpen(true)} className="text-gray-500 hover:text-gray-700 lg:hidden">
              <Menu size={24} />
            </button>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Panel de Administración</span>
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
      
      {sidebarOpen && <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />}
    </div>
  );
}