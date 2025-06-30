// src/components/Layout/Footer.tsx (CORREGIDO)

import { Facebook, Instagram, Phone } from 'lucide-react';
import { useSiteSettings } from '../../hooks/useData';
import { useContactPhones } from '../../hooks/useData'; // <-- LÍNEA 1 AÑADIDA
import { ContactPhone } from '../../lib/supabase'; // <-- LÍNEA 2 AÑADIDA (OPCIONAL PERO BUENA PRÁCTICA)


export default function Footer() {
  const { settings } = useSiteSettings();
  const { phones } = useContactPhones(); // <-- LÍNEA 3 AÑADIDA (LA MÁS IMPORTANTE)

  const navLinks = [
    { href: '#inicio', label: 'Inicio' },
    { href: '#empresa', label: 'La Empresa' },
    { href: '#historia', label: 'Historia' },
    { href: '#productos', label: 'Productos' },
    { href: '#contacto', label: 'Contacto' },
  ];

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo y descripción */}
          <div className="lg:col-span-1">
            <div> {settings.site_logo_url ? ( <img src={`https://alejandrosabater.com.ar${settings.site_logo_url}`} alt="Logo Campomar" className="h-10 mb-4" /> ) : ( <h3 className="text-2xl font-bold text-accent mb-4">CAMPOMAR</h3> )}     </div>  
            <p className="text-gray-300 text-sm leading-relaxed">
              {settings.footer_description}
            </p>
          </div>

          {/* Enlaces de navegación */}
          <div>
            <h4 className="font-semibold mb-4 text-accent">Navegación</h4>
            <ul className="space-y-2">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <button
                    onClick={() => scrollToSection(link.href)}
                    className="text-gray-300 hover:text-accent transition-colors duration-300 text-sm"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Teléfonos WhatsApp */}
          <div>
            <h4 className="font-semibold mb-4 text-accent">WhatsApp</h4>
            <div className="space-y-2">
              {phones.map((phone: ContactPhone) => (
                <a
                  key={phone.id}
                  href={`https://wa.me/${phone.whatsapp_number}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 text-gray-300 hover:text-green-400 transition-colors duration-300 text-sm"
                >
                  <Phone size={14} />
                  <span>{phone.display_number}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Horario y redes sociales */}
          <div>
            <h4 className="font-semibold mb-4 text-accent">Contacto</h4>
            <div className="space-y-3">
              <p className="text-gray-300 text-sm">
                {settings.footer_schedule}
              </p>
              <div className="flex space-x-4">
                <a
                  href={settings.facebook_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-blue-500 transition-colors duration-300"
                >
                  <Facebook size={24} />
                </a>
                <a
                  href={settings.instagram_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-pink-500 transition-colors duration-300"
                >
                  <Instagram size={24} />
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            © 2025 CAMPOMAR. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}