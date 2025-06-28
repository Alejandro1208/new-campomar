import { Phone, Mail, MapPin, Clock } from 'lucide-react';
import { useSiteSettings } from '../../hooks/useData';

export default function TopBar() {
  const { settings } = useSiteSettings();

  const topBarItems = [
    { icon: Phone, text: settings.topbar_phone, key: 'phone' },
    { icon: Mail, text: settings.topbar_email, key: 'email' },
    { icon: MapPin, text: settings.topbar_address, key: 'address' },
    { icon: Clock, text: settings.topbar_schedule, key: 'schedule' },
  ];

  return (
    <div className="bg-primary text-white py-2 px-4">
      <div className="container mx-auto">
        <div className="flex justify-center items-center space-x-8">
          {/* Desktop: mostrar todos los elementos */}
          <div className="hidden md:flex items-center space-x-8">
            {topBarItems.map(({ icon: Icon, text, key }) => (
              <div key={key} className="flex items-center space-x-2 text-sm">
                <Icon size={14} />
                <span>{text}</span>
              </div>
            ))}
          </div>
          
          {/* Mobile: mostrar solo teléfono y email */}
          <div className="md:hidden flex items-center justify-center space-x-6">
            {topBarItems.slice(0, 2).map(({ icon: Icon, text, key }) => (
              <div key={key} className="flex items-center space-x-2 text-sm">
                <Icon size={14} />
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}