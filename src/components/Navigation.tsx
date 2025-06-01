import React, { useState, useEffect } from 'react';
import { Link as ScrollLink } from 'react-scroll';
import { useWebsiteStore } from '../store/useWebsiteStore';
import { Menu, X, LogIn } from 'lucide-react';

const Navigation: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const logoUrl = useWebsiteStore((state) => state.logo);
  const menuItems = useWebsiteStore((state) => state.menuItems);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50); // O el umbral que prefieras
    };
    window.addEventListener('scroll', handleScroll);
    // Ejecuta handleScroll una vez al montar para establecer el estado inicial correcto
    handleScroll(); 
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const fullLogoUrl = logoUrl && logoUrl.startsWith('/') 
                      ? `http://localhost:3001${logoUrl}` 
                      : logoUrl;

  // Colores fijos para texto y hover, visibles contra fondo blanco
  const textColorClass = "primary-500"; // Color del texto
  const hoverTextColorClass = "hover:text-white"; // Color al pasar el mouse
  const activeTextColorClass = "text-primary-500";
  const hoverBgClass = "hover:bg-primary-500"; // Fondo al pasar el mouse
  const activeBgClass = "bg-gray-100";
  const logoFallbackColorClass = "text-primary-500"; // Color para el texto/icono del logo si no hay imagen

  return (
    <nav 
      className={`fixed w-full z-30 transition-all duration-300 ease-in-out bg-white ${
        // La sombra y el padding vertical pueden seguir cambiando con el scroll si quieres
        isScrolled ? 'shadow-lg py-4' : 'shadow-md py-6' 
      }`}
      style={{ 
        // --- CAMBIO PRINCIPAL AQUÍ ---
        top: isScrolled ? '0px' : 'var(--topbar-height, 40px)', 
        // -----------------------------
        '--navbar-height': isScrolled ? '64px' : '80px' // Variable para uso interno o por otros componentes
      } as React.CSSProperties} 
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex-shrink-0">
            <a href="#home" className="flex items-center" onClick={() => setIsOpen(false)}>
              {fullLogoUrl ? (
                <img src={fullLogoUrl} alt="Logo de la Empresa" className="h-10 md:h-12 w-auto" />
              ) : (
                <>
                  <LogIn className={`h-8 w-8 ${logoFallbackColorClass}`} /> 
                  <span className={`ml-2 text-xl font-bold ${logoFallbackColorClass}`}>NombreEmpresa</span>
                </>
              )}
            </a>
          </div>

          {/* Botón del Menú Móvil */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              type="button"
              className={`p-2 rounded-md ${textColorClass} ${hoverBgClass} focus:outline-none focus:ring-2 focus:ring-inset focus:ring-gray-500`}
              aria-controls="mobile-menu"
              aria-expanded={isOpen}
            >
              <span className="sr-only">Abrir menú principal</span>
              {isOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>

          {/* Links de Navegación - Escritorio */}
          <div className="hidden md:flex md:items-center md:space-x-2 lg:space-x-4">
            {(menuItems || []).map((item) => (
              <ScrollLink
                key={item.id}
                to={item.url.startsWith('#') ? item.url.substring(1) : item.url}
                spy={true}
                smooth={true}
                offset={isScrolled ? -60 : -(60 + parseInt(getComputedStyle(document.documentElement).getPropertyValue('--topbar-height') || '40'))} // Ajustar offset dinámicamente
                duration={500}
                className={`px-3 py-2 rounded-md text-sm font-medium cursor-pointer transition-colors duration-200
                  ${textColorClass} ${hoverBgClass} ${hoverTextColorClass}
                `}
                activeClass={`${activeTextColorClass} ${activeBgClass} font-semibold`}
              >
                {item.text}
              </ScrollLink>
            ))}
          </div>
        </div>
      </div>

      {/* Menú Móvil */}
      {isOpen && (
        <div 
            className="md:hidden absolute left-0 w-full bg-white shadow-lg" 
            // El 'top' del menú móvil debe ser la altura actual del navbar
            style={{ top: isScrolled ? '64px' : '80px' }} 
            id="mobile-menu"
        >
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {(menuItems || []).map((item) => (
              <ScrollLink
                key={item.id}
                to={item.url.startsWith('#') ? item.url.substring(1) : item.url}
                spy={true}
                smooth={true}
                offset={isScrolled ? -60 : -(60 + parseInt(getComputedStyle(document.documentElement).getPropertyValue('--topbar-height') || '40'))}
                duration={500}
                className={`block px-3 py-2 rounded-md text-base font-medium ${textColorClass} ${hoverBgClass} ${hoverTextColorClass}`}
                activeClass={`${activeTextColorClass} ${activeBgClass} font-semibold`}
                onClick={toggleMenu} 
              >
                {item.text}
              </ScrollLink>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;