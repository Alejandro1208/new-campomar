// src/components/Footer.tsx
import React from 'react';
import { useWebsiteStore } from '../store/useWebsiteStore';
import { Facebook, Instagram, Linkedin, Twitter, Youtube, Phone, Clock, Mail, MapPin } from 'lucide-react'; // Asegúrate de tener todos los íconos que necesites

// Mapeo de iconos para redes sociales y otros
const iconComponents: { [key: string]: React.ElementType } = {
  facebook: Facebook,
  instagram: Instagram,
  linkedin: Linkedin,
  twitter: Twitter,
  youtube: Youtube,
  // Puedes añadir más iconos de redes aquí si los usas
  phone: Phone,    // Para los números de teléfono
  clock: Clock,    // Para el horario de atención
  // mail: Mail,   // Descomenta si tienes un email específico para el footer en otro estado
  // 'map-pin': MapPin, // Descomenta si tienes una dirección específica para el footer
};

const Footer: React.FC = () => {
  const { 
    phoneNumbers,      // Para los números de teléfono del footer
    businessHours,     // Para el horario de atención del footer (espera un array)
    socialMedia,       // Para las redes sociales
    logo,
    menuItems,
    footerShortDescription, // Para el texto bajo el logo en el footer
    footerCopyright    // Para el texto de copyright
  } = useWebsiteStore((state) => ({
    phoneNumbers: state.phoneNumbers,
    businessHours: state.businessHours,
    socialMedia: state.socialMedia,
    logo: state.logo,
    menuItems: state.menuItems,
    footerShortDescription: state.footerShortDescription,
    footerCopyright: state.footerCopyright,
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
            {fullLogoUrl ? (
              <a href="#home" className="inline-block">
                <img src={fullLogoUrl} alt="Logo de la Empresa" className="h-10 w-auto" />
              </a>
            ) : (
              <h3 className="text-xl font-semibold text-white">TuEmpresa</h3> 
            )}
            {/* Mostrar la descripción corta del footer */}
            {footerShortDescription && (
              <p className="text-sm">{footerShortDescription}</p>
            )}
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

          {/* Columna 3: Contacto (Usando phoneNumbers y businessHours) */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Contacto</h4>
            <ul className="space-y-3">
              {/* Renderizar Números de Teléfono */}
              {(phoneNumbers || []).map(phone => (
                <li key={phone.id} className="flex items-start text-sm">
                  <Phone className="h-5 w-5 mr-3 mt-0.5 text-primary-400 flex-shrink-0" />
                  <span>{phone.number}{phone.label && ` (${phone.label})`}</span>
                </li>
              ))}
              {/* Renderizar Horario de Atención */}
              {(businessHours || []).map(bh => ( // Asumiendo que businessHours es un array
                <li key={bh.id} className="flex items-start text-sm">
                  <Clock className="h-5 w-5 mr-3 mt-0.5 text-primary-400 flex-shrink-0" />
                  <span>{bh.days}: {bh.hours}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Columna 4: Redes Sociales */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Síguenos</h4>
            <div className="flex space-x-4">
              {(socialMedia || []).map(social => {
                const Icon = iconComponents[social.icon.toLowerCase()];
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
            &copy; {currentYear} {footerCopyright || 'Tu Nombre de Empresa. Todos los derechos reservados.'}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;