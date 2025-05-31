import React from 'react';
import { useWebsiteStore } from '../store/useWebsiteStore';

const Company: React.FC = () => {
  const companyInfo = useWebsiteStore((state) => state.companyInfo);

  return (
    <section id="about" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-primary-500 mb-12">{companyInfo.title}</h2>
        
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-1/2">
            <p className="text-lg text-gray-700 leading-relaxed mb-8">{companyInfo.description}</p>
          </div>
          
          <div className="lg:w-1/2">
            <div className="grid grid-cols-2 gap-4">
              {companyInfo.images.map((image) => (
                <div key={image.id} className="overflow-hidden rounded-2xl shadow-custom hover:shadow-hover transition-shadow duration-300">
                  <img 
                    src={`http://localhost:3001${image.src}`}
                    alt={image.alt} 
                    className="w-full h-64 object-cover transform hover:scale-105 transition-transform duration-300"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Company;