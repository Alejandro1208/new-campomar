import React, { useState, useEffect } from 'react';
import { useWebsiteStore } from '../store/useWebsiteStore';
import { Menu, X, LogIn, UserPlus } from 'lucide-react';
import { Link } from 'react-router-dom';

const Navigation: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { menuItems, logo } = useWebsiteStore();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className={`w-full z-50 transition-all duration-300 top-8 ${scrolled ? 'bg-white shadow-custom py-2' : 'bg-transparent py-4'}`}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex-shrink-0">
            <a href="#home" className="flex items-center">
              <LogIn className="h-8 w-8 text-primary-500" />
              <span className="ml-2 text-xl font-bold text-primary-500">NombreEmpresa</span>
            </a>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {menuItems.map((item) => (
              <a
                key={item.id}
                href={item.url}
                className="text-primary-500 hover:text-primary-300 transition-colors duration-200"
              >
                {item.text}
              </a>
            ))}
          </div>

          {/* Login/Register Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              to="/admin"
              className="flex items-center px-4 py-2 rounded-full border border-primary-500 text-primary-500 hover:bg-primary-500 hover:text-white transition-all duration-200"
            >
              <LogIn className="h-4 w-4 mr-2" />
              <span>Ingresar</span>
            </Link>
            <Link
              to="/register"
              className="flex items-center px-4 py-2 rounded-full bg-primary-500 text-white hover:bg-primary-400 transition-all duration-200"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              <span>Registrarse</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-primary-500 hover:text-primary-300 transition-colors duration-200"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white shadow-lg">
          <div className="container mx-auto px-4 py-4">
            <div className="flex flex-col space-y-4">
              {menuItems.map((item) => (
                <a
                  key={item.id}
                  href={item.url}
                  className="text-primary-500 hover:text-primary-300 transition-colors duration-200 py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.text}
                </a>
              ))}
              <div className="flex flex-col space-y-3 pt-4 border-t border-gray-200">
                <Link
                  to="/admin"
                  className="flex items-center justify-center px-4 py-2 rounded-full border border-primary-500 text-primary-500 hover:bg-primary-500 hover:text-white transition-all duration-200"
                >
                  <LogIn className="h-4 w-4 mr-2" />
                  <span>Ingresar</span>
                </Link>
                <Link
                  to="/register"
                  className="flex items-center justify-center px-4 py-2 rounded-full bg-primary-500 text-white hover:bg-primary-400 transition-all duration-200"
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  <span>Registrarse</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;