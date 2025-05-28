import React from 'react';
import { useWebsiteStore } from '../store/useWebsiteStore';
import { Phone, Facebook, Instagram, Clock, LogIn } from 'lucide-react';

const Footer: React.FC = () => {
  const { menuItems, phoneNumbers, businessHours, socialMedia } = useWebsiteStore();

  return (
    <footer id="footer" className="bg-primary-500 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo and Company */}
          <div>
            <div className="flex items-center mb-4">
              <LogIn className="h-8 w-8" />
              <span className="ml-2 text-xl font-bold">CompanyName</span>
            </div>
            <p className="text-sm">
              Providing quality products and exceptional service since 2000.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {menuItems.map((item) => (
                <li key={item.id}>
                  <a 
                    href={item.url}
                    className="text-white hover:text-primary-100 transition-colors duration-200"
                  >
                    {item.text}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              {phoneNumbers.map((phone) => (
                <li key={phone.id} className="flex items-center">
                  <Phone className="h-4 w-4 mr-2" />
                  <a 
                    href={`tel:${phone.number.replace(/\s+/g, '')}`}
                    className="hover:text-primary-100 transition-colors duration-200"
                  >
                    {phone.number} {phone.label && `(${phone.label})`}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Business Hours and Social Media */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Hours & Social</h3>
            <div className="flex items-start mb-4">
              <Clock className="h-4 w-4 mr-2 mt-1" />
              <div>
                <p>{businessHours.days}</p>
                <p>{businessHours.hours}</p>
              </div>
            </div>
            
            <div className="flex space-x-4 mt-6">
              {socialMedia.map((social) => (
                <a 
                  key={social.id}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary-100 transition-colors duration-200"
                >
                  {social.icon === 'facebook' ? (
                    <Facebook className="h-6 w-6" />
                  ) : social.icon === 'instagram' ? (
                    <Instagram className="h-6 w-6" />
                  ) : null}
                </a>
              ))}
            </div>
          </div>
        </div>
        
        <div className="border-t border-primary-400 mt-8 pt-8 text-center">
          <p>&copy; {new Date().getFullYear()} CompanyName. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;