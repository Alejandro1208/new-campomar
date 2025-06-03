// src/components/admin/AdminHeader.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { useWebsiteStore } from '../../store/useWebsiteStore'; // <--- IMPORTAR EL STORE DEL SITIO
import { LogOut, User } from 'lucide-react'; // LogIn ya no se usa aquí si lo reemplaza el logo

const AdminHeader: React.FC = () => {
  const { user, logout } = useAuthStore();
  const siteLogo = useWebsiteStore((state) => state.logo); // <--- OBTENER EL LOGO
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin');
  };

  const fullLogoUrl = siteLogo && siteLogo.startsWith('/') 
                      ? `http://localhost:3001${siteLogo}` 
                      : siteLogo;



  return (
    <header className="bg-primary-500 text-white py-4">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            {fullLogoUrl ? (
              <img src={fullLogoUrl} alt="Logo" className="h-8 md:h-10 mr-3" /> 
            ) : (
              null 
            )}
            <h1 className="text-xl font-bold">Panel de administración</h1>
          </div>
          
          {user && (
            <div className="flex items-center">
              <div className="flex items-center mr-6">
                <User className="h-5 w-5 mr-2" />
                <span>{user.name}</span>
              </div>
              
              <button
                onClick={handleLogout}
                className="flex items-center px-3 py-1 rounded-full border border-white text-white hover:bg-white hover:text-primary-500 transition-all duration-200"
              >
                <LogOut className="h-4 w-4 mr-1" />
                <span>Salir</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;