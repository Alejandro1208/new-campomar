// src/components/FloatingElements.tsx
import React, { useState } from 'react';
import { useWebsiteStore } from '../store/useWebsiteStore';
// IMPORTA TODOS LOS ÍCONOS QUE NECESITES PARA LAS REDES SOCIALES
import { MessageCircle, Facebook, Instagram, Twitter, Linkedin, Youtube, Link as LinkIcon } from 'lucide-react';

// Mapeo de los valores de social.icon a los componentes de ícono
const socialIconComponents: { [key: string]: React.ElementType } = {
  facebook: Facebook,
  instagram: Instagram,
  twitter: Twitter,
  linkedin: Linkedin,
  youtube: Youtube,
  // Puedes añadir más aquí si tienes otros tipos de redes sociales
  default: LinkIcon, // Un ícono por defecto si no se encuentra uno específico
};

const FloatingElements: React.FC = () => {
  const socialMedia = useWebsiteStore((state) => state.socialMedia);
  const phoneNumbers = useWebsiteStore((state) => state.phoneNumbers);
  const [socialExpanded, setSocialExpanded] = useState(false);

  const whatsappNumber = phoneNumbers[0]?.number.replace(/\s+/g, '') || '';

  const toggleSocial = () => {
    setSocialExpanded(!socialExpanded);
  };

  return (
    <div className="fixed right-6 bottom-6 z-40 flex flex-col items-end space-y-4">
      {/* Social Media */}
      <div className="flex flex-col items-end space-y-2">
        {socialExpanded && socialMedia.map((social) => {
          // Obtiene el componente de ícono correspondiente, o el por defecto
          const IconComponent = socialIconComponents[social.icon.toLowerCase()] || socialIconComponents.default;
          return (
            <a
              key={social.id}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-10 h-10 rounded-full bg-primary-500 text-white shadow-custom hover:bg-primary-400 transition-all duration-200 animate-float"
              style={{ animationDelay: `${parseInt(social.id) * 0.1}s` }}
              aria-label={social.name} // Es bueno para la accesibilidad
            >
              <IconComponent className="h-5 w-5" />
            </a>
          );
        })}
        
        <button
          onClick={toggleSocial}
          className="flex items-center justify-center w-12 h-12 rounded-full bg-primary-400 text-white shadow-custom hover:bg-primary-300 transition-all duration-200"
          aria-expanded={socialExpanded} // Para accesibilidad
          aria-label={socialExpanded ? "Cerrar redes sociales" : "Abrir redes sociales"}
        >
          {socialExpanded ? (
            <span className="text-lg font-bold" aria-hidden="true">×</span>
          ) : (
            <span className="text-lg font-bold" aria-hidden="true">+</span>
          )}
        </button>
      </div>
      
      {/* WhatsApp Button */}
      <a
        href={`https://wa.me/${whatsappNumber}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center w-14 h-14 rounded-full bg-green-500 text-white shadow-custom hover:bg-green-600 transition-all duration-200"
        aria-label="Contactar por WhatsApp"
      >
        <MessageCircle className="h-6 w-6" />
      </a>
    </div>
  );
};

export default FloatingElements;