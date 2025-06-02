import React from 'react';
import { useWebsiteStore } from '../store/useWebsiteStore';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';

const iconMap: Record<string, React.ReactNode> = {
  phone: <Phone className="h-4 w-4" />, 
  mail: <Mail className="h-4 w-4" />,
  'map-pin': <MapPin className="h-4 w-4" />,
  clock: <Clock className="h-4 w-4" />,
};

const TopBar: React.FC = () => {
  const contactInfo = useWebsiteStore((state) => state.contactInfo);

  if (!Array.isArray(contactInfo)) {
    return null; 
  }

  const activeContactInfo = contactInfo.filter(item => item.is_active);

  const formatPhoneNumberForWhatsApp = (numberStr: string) => {
    return numberStr.replace(/\D/g, '');
  };

  return (
    <div className="bg-primary-500 text-white py-2">
      <div className="container mx-auto px-4">
        <div className="flex justify-end">
          <ul className="flex flex-wrap space-x-4 md:space-x-6">
            {activeContactInfo.map((item) => {
              let linkContent = <span>{item.text}</span>;
              let currentIconDisplay: React.ReactNode = null;

              if (item.icon === 'phone') {
                const whatsappNumber = formatPhoneNumberForWhatsApp(item.text);
                currentIconDisplay = (
                  <img 
                    src="/icons/whatsapp-logo.svg" 
                    alt="WhatsApp" 
                    className="h-4 w-4"
                  />
                );
                linkContent = (
                  <a 
                    href={`https://wa.me/${whatsappNumber}`} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="hover:underline"
                    aria-label={`Contactar por WhatsApp al número ${item.text}`}
                  >
                    {item.text}
                  </a>
                );
              } else if (item.icon === 'mail') {
                currentIconDisplay = iconMap.mail;
                linkContent = (
                  <a 
                    href={`mailto:${item.text}`} 
                    className="hover:underline"
                    aria-label={`Enviar correo a ${item.text}`}
                  >
                    {item.text}
                  </a>
                );
              } else {
                currentIconDisplay = iconMap[item.icon] || null;
              }

              return (
                <li 
                  key={item.id}
                  className={`flex items-center text-sm ${!item.show_on_mobile ? 'hidden md:flex' : 'flex'}`}
                >
                  {currentIconDisplay && <span className="mr-2">{currentIconDisplay}</span>}
                  {linkContent}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TopBar;