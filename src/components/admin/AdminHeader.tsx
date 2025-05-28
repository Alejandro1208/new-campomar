import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { LogOut, User, LogIn } from 'lucide-react';

const AdminHeader: React.FC = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin');
  };

  return (
    <header className="bg-primary-500 text-white py-4">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <LogIn className="h-6 w-6 mr-2" />
            <h1 className="text-xl font-bold">Admin Dashboard</h1>
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
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;