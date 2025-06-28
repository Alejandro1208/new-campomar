import { MessageSquare, Facebook, Instagram, Youtube } from 'lucide-react';
import { useSiteSettings } from '../../hooks/useData';

export default function FloatingElements() {
  const { settings } = useSiteSettings();

  return (
    <>
      {/* Botón flotante de WhatsApp */}
      <a
        href={`https://wa.me/${settings.whatsapp_phone?.replace(/\D/g, '')}`}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 transition-all duration-300 hover:scale-110 z-40 animate-bounce-slow"
      >
        <MessageSquare size={24} />
      </a>

      {/* Barra vertical de redes sociales */}
      <div className="fixed right-0 top-1/2 transform -translate-y-1/2 bg-white shadow-lg rounded-l-lg p-2 space-y-3 z-30 hidden lg:block">
        <a
          href={settings.facebook_url}
          target="_blank"
          rel="noopener noreferrer"
          className="block p-3 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-300"
        >
          <Facebook size={20} />
        </a>
        <a
          href={settings.instagram_url}
          target="_blank"
          rel="noopener noreferrer"
          className="block p-3 text-pink-600 hover:bg-pink-50 rounded-lg transition-colors duration-300"
        >
          <Instagram size={20} />
        </a>
        <a
          href="#"
          target="_blank"
          rel="noopener noreferrer"
          className="block p-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-300"
        >
          <Youtube size={20} />
        </a>
      </div>
    </>
  );
}