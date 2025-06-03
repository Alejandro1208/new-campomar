// src/components/Navigation.tsx
import React, { useState, useEffect } from 'react';
import { Link as ScrollLink } from 'react-scroll';
import { useWebsiteStore } from '../store/useWebsiteStore';
import { Menu, X, LogIn, UserPlus } from 'lucide-react'; // LogIn y UserPlus para los iconos de los botones

const Navigation: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const logoUrl = useWebsiteStore((state) => state.logo);
  const menuItems = useWebsiteStore((state) => state.menuItems);
  // Asegúrate de que loadInitialData se llame en App.tsx para que menuItems y logo estén disponibles
  // const initialDataLoaded = useWebsiteStore((state) => state.initialDataLoaded); // Si tienes este flag

  useEffect(() => {
    const handleScroll = () => {
      const topbar = document.getElementById('top-bar'); // Asume que tu TopBar tiene id="top-bar"
      const topbarHeight = topbar ? topbar.offsetHeight : 0;
      setIsScrolled(window.scrollY > topbarHeight + 10); // Activa cuando se scrollea más allá del topbar
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll(); 
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  const fullLogoUrl = logoUrl && logoUrl.startsWith('/') 
                      ? `http://localhost:3001${logoUrl}` 
                      : logoUrl;

  // Clases de estilo para los botones
  const baseButtonClass = "flex items-center px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200";
  
  // Estilos para el botón "Ingresar" (borde azul, texto azul, hover fondo azul texto blanco)
  const loginButtonDesktopClass = `${baseButtonClass} border border-primary-500 text-primary-500 hover:bg-primary-500 hover:text-white`;
  const loginButtonMobileClass = `block w-full text-left px-3 py-3 rounded-md text-base font-medium text-primary-500 hover:bg-primary-500 hover:text-white flex items-center`;
  
  // Estilos para el botón "Registrarse" (fondo azul, texto blanco)
  const registerButtonDesktopClass = `${baseButtonClass} bg-primary-500 text-white hover:bg-primary-400`;
  const registerButtonMobileClass = `block w-full text-left px-3 py-3 rounded-md text-base font-medium bg-primary-500 text-white hover:bg-primary-400 flex items-center`;

  // URLs
  const loginUrl = "http://accesoclientes.centum.com.ar/PL1/BL1/DistribuidoraCampomarSA/";
  const registerUrl = "https://forms.gle/hAmfoSmwfBbGF32s5";

  // Offset para ScrollLink dinámico
  const scrollOffset = () => {
    const topbar = document.getElementById('top-bar');
    const topbarHeight = topbar ? topbar.offsetHeight : 0; // Altura del TopBar
    const navbarBaseHeight = isScrolled ? 64 : 80; // Altura base del Navbar
    return -(navbarBaseHeight + (isScrolled ? 0 : topbarHeight) + 20); // +20 de margen extra
  };


  return (
    <nav 
      className={`fixed w-full z-30 transition-all duration-300 ease-in-out bg-white ${
        isScrolled ? 'shadow-lg py-3' : 'shadow-md py-4' // Ajustado padding vertical
      }`}
      style={{ 
        top: isScrolled ? '0px' : 'var(--topbar-height, 40px)', 
        '--navbar-height': isScrolled ? '64px' : '80px'
      } as React.CSSProperties} 
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-full"> {/* Asegurar altura completa para alineación */}
          {/* Logo */}
          <div className="flex-shrink-0">
            <ScrollLink to="home" smooth={true} duration={500} offset={scrollOffset()} onClick={closeMenu} className="cursor-pointer flex items-center">
              {fullLogoUrl ? (
                <img src={fullLogoUrl} alt="Logo de la Empresa" className="h-10 md:h-12 w-auto" />
              ) : (
                <>
                  {/* Fallback si no hay logo, puedes poner un ícono genérico de empresa o el texto */}
                  <span className={`text-xl font-bold text-primary-500`}>NombreEmpresa</span>
                </>
              )}
            </ScrollLink>
          </div>

          {/* Links de Navegación y Botones para Escritorio */}
          <div className="hidden md:flex items-center">
            <div className="flex items-center space-x-1 lg:space-x-2"> {/* Espacio entre links */}
              {(menuItems || []).map((item) => (
                <ScrollLink
                  key={item.id}
                  to={item.url.startsWith('#') ? item.url.substring(1) : item.url}
                  spy={true}
                  smooth={true}
                  offset={scrollOffset()}
                  duration={500}
                  className="px-3 py-2 rounded-md text-sm font-medium text-primary-500 hover:bg-primary-500 hover:text-white cursor-pointer transition-colors duration-200"
                  activeClass="bg-gray-100 text-primary-500 font-semibold" // Ajusta activeClass
                  onClick={closeMenu}
                >
                  {item.text}
                </ScrollLink>
              ))}
            </div>
            {/* Botones para Escritorio */}
            <div className="ml-6 flex items-center space-x-3"> {/* Aumentado margen y espacio */}
              <a
                href={loginUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={loginButtonDesktopClass}
              >
                <LogIn className="h-4 w-4 mr-2" />
                Ingresar
              </a>
              <a
                href={registerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={registerButtonDesktopClass}
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Registrarse
              </a>
            </div>
          </div>

          {/* Botón del Menú Móvil (Asegurarse que esté a la derecha) */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              type="button"
              className="p-2 rounded-md text-primary-500 hover:bg-primary-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-gray-500"
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
        </div>
      </div>

      {/* Menú Móvil */}
      {isOpen && (
        <div 
            className="md:hidden absolute left-0 top-full w-full bg-white shadow-lg rounded-b-md" // top-full para que empiece justo debajo del nav
            id="mobile-menu"
        >
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {(menuItems || []).map((item) => (
              <ScrollLink
                key={item.id}
                to={item.url.startsWith('#') ? item.url.substring(1) : item.url}
                spy={true}
                smooth={true}
                offset={scrollOffset()}
                duration={500}
                className="block px-3 py-3 rounded-md text-base font-medium text-primary-500 hover:bg-primary-500 hover:text-white"
                activeClass="bg-gray-100 text-primary-500 font-semibold"
                onClick={toggleMenu} // Cierra el menú al hacer clic
              >
                {item.text}
              </ScrollLink>
            ))}
            {/* Separador y Botones en Móvil */}
            <div className="pt-3 mt-2 border-t border-gray-200 space-y-2">
              <a
                href={loginUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={loginButtonMobileClass}
                onClick={toggleMenu}
              >
                <LogIn className="h-5 w-5 mr-2" />
                Ingresar
              </a>
              <a
                href={registerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={registerButtonMobileClass}
                onClick={toggleMenu}
              >
                <UserPlus className="h-5 w-5 mr-2" />
                Registrarse
              </a>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;