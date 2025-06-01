import React from 'react';
import { useWebsiteStore } from '../store/useWebsiteStore'; // Importa el store
import { Facebook, Twitter, Instagram, Linkedin, Youtube, Phone, Mail, MapPin, Clock } from 'lucide-react'; // Asumo que sigues usando estos íconos

const iconComponents: { [key: string]: React.ElementType } = {
  facebook: Facebook,
  twitter: Twitter,
  instagram: Instagram,
  linkedin: Linkedin,
  youtube: Youtube,
  phone: Phone,
  mail: Mail,
  'map-pin': MapPin, // Como lo usas en TopBar
  clock: Clock,      // Como lo usas en TopBar
};

const Footer: React.FC = () => {
  const { 
    contactInfo, 
    menuItems, 
    socialMedia, 
    logo // <--- Obtener el logo del store
  } = useWebsiteStore((state) => ({
    contactInfo: state.contactInfo,
    menuItems: state.menuItems,
    socialMedia: state.socialMedia,
    logo: state.logo, // <--- Añade esto
  }));

  // Construir la URL completa para el logo
  const fullLogoUrl = logo && logo.startsWith('/') 
                      ? `http://localhost:3001${logo}` 
                      : logo;

  const currentYear = new Date().getFullYear();

  return (
    <footer id="footer" className="bg-gray-900 text-gray-300 pt-12 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Columna 1: Logo y Descripción Corta */}
          <div className="space-y-4">
            {/* --- LOGO AQUÍ --- */}
            {fullLogoUrl ? (
              <a href="#home" className="inline-block">
                <img src={fullLogoUrl} alt="Logo de la Empresa" className="h-10 w-auto" /> {/* Ajusta la altura */}
              </a>
            ) : (
              <h3 className="text-xl font-semibold text-white">CompanyName</h3> // Fallback si no hay logo
            )}
            {/* --- FIN LOGO --- */}
            <p className="text-sm">
              Ofreciendo soluciones de calidad para nuestros clientes desde hace más de 20 años.
              Comprometidos con la excelencia y la innovación.
            </p>
          </div>

          {/* Columna 2: Enlaces Rápidos (Menú) */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Enlaces Rápidos</h4>
            <ul className="space-y-2">
              {(menuItems || []).map(item => (
                <li key={item.id}>
                  <a 
                    href={item.url} 
                    className="hover:text-primary-400 transition-colors duration-200 text-sm"
                  >
                    {item.text}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Columna 3: Contacto */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Contacto</h4>
            <ul className="space-y-3">
              {(contactInfo || []).filter(info => info.is_active).map(info => { // Filtra por is_active
                const Icon = iconComponents[info.icon];
                return (
                  <li key={info.id} className="flex items-start text-sm">
                    {Icon && <Icon className="h-5 w-5 mr-3 mt-0.5 text-primary-400 flex-shrink-0" />}
                    <span>{info.text}</span>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Columna 4: Redes Sociales */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Síguenos</h4>
            <div className="flex space-x-4">
              {(socialMedia || []).map(social => {
                const Icon = iconComponents[social.icon.toLowerCase()]; // Asumiendo que social.icon es 'facebook', 'twitter', etc.
                return (
                  <a 
                    key={social.id} 
                    href={social.url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-gray-400 hover:text-primary-400 transition-colors duration-200"
                    aria-label={social.name}
                  >
                    {Icon ? <Icon size={20} /> : <span>{social.name}</span>}
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-8 text-center">
          <p className="text-sm">
            &copy; {currentYear} Tu Nombre de Empresa. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;