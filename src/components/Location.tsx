import React from 'react';
import { useWebsiteStore } from '../store/useWebsiteStore';

const Location: React.FC = () => {
  const mapLocation = useWebsiteStore((state) => state.mapLocation);

  return (
    <section id="location" className="py-16 bg-gray-100">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-primary-500 mb-12">Visit Us</h2>
        
        <div className="rounded-2xl overflow-hidden shadow-custom">
          <iframe
            src={mapLocation.embedUrl}
            width="100%"
            height="450"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Company Location"
          ></iframe>
        </div>
      </div>
    </section>
  );
};

export default Location;