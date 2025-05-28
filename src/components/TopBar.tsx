import React from 'react';
import { useWebsiteStore } from '../store/useWebsiteStore';
import { Phone, Mail, MapPin, Clock, DivideIcon as LucideIcon } from 'lucide-react';

const iconMap: Record<string, React.ReactNode> = {
  phone: <Phone className="h-4 w-4" />,
  mail: <Mail className="h-4 w-4" />,
  'map-pin': <MapPin className="h-4 w-4" />,
  clock: <Clock className="h-4 w-4" />,
};

const TopBar: React.FC = () => {
  const contactInfo = useWebsiteStore((state) => state.contactInfo);

  return (
    <div className="bg-primary-500 text-white py-2">
      <div className="container mx-auto px-4">
        <div className="flex justify-end">
          <ul className="flex flex-wrap space-x-4 md:space-x-6">
            {contactInfo.map((item) => (
              <li 
                key={item.id}
                className={`flex items-center text-sm ${!item.showOnMobile ? 'hidden md:flex' : 'flex'}`}
              >
                <span className="mr-2">{iconMap[item.icon]}</span>
                <span>{item.text}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TopBar;