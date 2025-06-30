import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useBanners } from '../../hooks/useData';

export default function HeroBanner() {
  const { banners, loading } = useBanners();
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (banners.length < 2) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [banners.length]);

  if (loading || banners.length === 0) {
    return (
      <div id="inicio" className="h-[60vh] bg-gradient-to-r from-primary to-secondary flex items-center justify-center">
        <div className="text-white text-center">
          <h2 className="text-4xl font-bold mb-4">CAMPOMAR</h2>
          <p className="text-xl">Cargando...</p>
        </div>
      </div>
    );
  }

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % banners.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length);

  // Obtenemos el banner actual para fácil acceso
  const activeBanner = banners[currentSlide];

  return (
    <section id="inicio" className="relative h-[60vh] overflow-hidden">
      {/* Fondo de la imagen */}
      <div className="relative w-full h-full">
        {banners.map((banner, index) => (
          <div key={banner.id} className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}>
            <img src={`https://alejandrosabater.com.ar${banner.image_url}`} alt={banner.alt_text} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black bg-opacity-40" />
          </div>
        ))}
      </div>
      
      {/* Controles del carrusel (solo si hay más de 1 banner) */}
      {banners.length > 1 && (
        <>
          <button onClick={prevSlide} className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 text-white p-2 rounded-full hover:bg-opacity-40 transition-all">
            <ChevronLeft size={24} />
          </button>
          <button onClick={nextSlide} className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 text-white p-2 rounded-full hover:bg-opacity-40 transition-all">
            <ChevronRight size={24} />
          </button>
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {banners.map((_, index) => (
              <button key={index} onClick={() => setCurrentSlide(index)} className={`w-3 h-3 rounded-full transition-all ${index === currentSlide ? 'bg-white' : 'bg-white bg-opacity-50'}`} />
            ))}
          </div>
        </>
      )}

      {/* Contenido superpuesto DINÁMICO */}
      <div className="absolute inset-0 flex items-center justify-center text-center text-white p-4">
        <div className="max-w-4xl">
          {activeBanner?.headline && (
            <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
              {activeBanner.headline}
            </h1>
          )}
          {activeBanner?.subheadline && (
            <p className="text-xl md:text-2xl mb-8 animate-fade-in">
              {activeBanner.subheadline}
            </p>
          )}
          {activeBanner?.cta_text && activeBanner?.cta_link && (
            <a href={activeBanner.cta_link} className="bg-accent text-white px-8 py-3 rounded-lg hover:bg-blue-600 transition-all duration-300 hover:scale-105 animate-fade-in inline-block">
              {activeBanner.cta_text}
            </a>
          )}
        </div>
      </div>
    </section>
  );
}