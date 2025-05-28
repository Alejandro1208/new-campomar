import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Menu, Image, Info, Baseline as Timeline, ShoppingBag, MapPin, Phone, Settings } from 'lucide-react';

const sidebarItems = [
  { 
    id: 'dashboard', 
    path: '/admin/dashboard', 
    label: 'Panel Principal', 
    icon: <LayoutDashboard className="h-5 w-5" /> 
  },
  { 
    id: 'topbar', 
    path: '/admin/topbar', 
    label: 'Barra Superior', 
    icon: <Menu className="h-5 w-5" /> 
  },
  { 
    id: 'navigation', 
    path: '/admin/navigation', 
    label: 'Navegación', 
    icon: <Menu className="h-5 w-5" /> 
  },
  { 
    id: 'banner', 
    path: '/admin/banner', 
    label: 'Banner', 
    icon: <Image className="h-5 w-5" /> 
  },
  { 
    id: 'company', 
    path: '/admin/company', 
    label: 'Información de Empresa', 
    icon: <Info className="h-5 w-5" /> 
  },
  { 
    id: 'timeline', 
    path: '/admin/timeline', 
    label: 'Línea de Tiempo', 
    icon: <Timeline className="h-5 w-5" /> 
  },
  { 
    id: 'products', 
    path: '/admin/products', 
    label: 'Productos', 
    icon: <ShoppingBag className="h-5 w-5" /> 
  },
  { 
    id: 'location', 
    path: '/admin/location', 
    label: 'Ubicación', 
    icon: <MapPin className="h-5 w-5" /> 
  },
  { 
    id: 'contact', 
    path: '/admin/contact', 
    label: 'Información de Contacto', 
    icon: <Phone className="h-5 w-5" /> 
  },
  { 
    id: 'settings', 
    path: '/admin/settings', 
    label: 'Configuración', 
    icon: <Settings className="h-5 w-5" /> 
  },
];

const Sidebar: React.FC = () => {
  const location = useLocation();

  return (
    <aside className="bg-white w-64 shadow-md min-h-screen">
      <div className="py-6">
        <div className="px-6 mb-6">
          <h2 className="text-xl font-bold text-primary-500">Panel de Admin</h2>
        </div>
        
        <nav>
          <ul className="space-y-1">
            {sidebarItems.map((item) => (
              <li key={item.id}>
                <Link
                  to={item.path}
                  className={`flex items-center px-6 py-3 text-gray-700 hover:bg-primary-100 hover:text-primary-500 transition-colors duration-200 ${
                    location.pathname === item.path ? 'bg-primary-100 text-primary-500' : ''
                  }`}
                >
                  <span className="mr-3">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;