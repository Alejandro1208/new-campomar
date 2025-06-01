import React, { useEffect, useRef } from 'react';
import { useWebsiteStore } from '../store/useWebsiteStore';
import { register } from 'swiper/element/bundle'; // Importación para Swiper Web Components

// Declarar los elementos personalizados para TypeScript
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'swiper-container': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & { ref?: React.Ref<any>; init?: string; class?: string };
      'swiper-slide': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
    }
  }
}

// Registrar los Web Components de Swiper una sola vez
register();

const Banner: React.FC = () => {
  const bannerSlides = useWebsiteStore((state) => state.bannerSlides);
  const swiperRef = useRef<any>(null); // Usar 'any' o un tipo más específico si Swiper Element lo proporciona

  useEffect(() => {
    const swiperContainer = swiperRef.current;

    if (swiperContainer && bannerSlides.length > 0) { // Añadir condición para bannerSlides.length
      const params = {
        slidesPerView: 1,
        spaceBetween: 0,
        loop: bannerSlides.length > 1, // Habilitar loop solo si hay más de 1 slide
        autoplay: {
          delay: 5000,
          disableOnInteraction: false,
        },
        pagination: { // La paginación puede ser opcional o configurada como necesites
          el: '.swiper-pagination', // Si usas un elemento externo para la paginación
          clickable: true,
        },
        // navigation: { // Opcional: si quieres botones de siguiente/anterior
        //   nextEl: '.swiper-button-next',
        //   prevEl: '.swiper-button-prev',
        // },
        // Asegúrate de que todos los parámetros sean compatibles con Swiper Elements
      };

      Object.assign(swiperContainer, params);

      // Inicializar Swiper (con Swiper Elements, esto a veces se maneja automáticamente o con .initialize())
      if (typeof swiperContainer.initialize === 'function') {
        swiperContainer.initialize();
      }
    }
  }, [bannerSlides]); // Re-ejecutar el efecto si bannerSlides cambia

  // Si no hay slides, podrías mostrar un placeholder o nada
  if (!bannerSlides || bannerSlides.length === 0) {
    return (
      <section id="home" className="h-60vh pt-16 flex items-center justify-center bg-gray-200">
        <p className="text-gray-500">El banner se está cargando o no hay slides para mostrar.</p>
      </section>
    );
  }

  return (
    <section id="home" className="h-[calc(100vh-var(--topbar-height,0px)-var(--navbar-height,64px))] md:h-[calc(100vh-var(--topbar-height,0px)-var(--navbar-height,80px))] max-h-[800px] min-h-[400px] relative"> {/* Ajusta la altura según tus necesidades y la altura del TopBar/NavBar */}
      <swiper-container ref={swiperRef} init="false" class="h-full w-full">
        {bannerSlides.map((slide) => {
          // Construir la URL completa de la imagen
          const imageUrl = slide.image.startsWith('http') ? slide.image : `http://localhost:3001${slide.image}`;

          return (
            <swiper-slide key={slide.id}>
              <div
                className="h-full w-full bg-cover bg-center flex flex-col items-center justify-center relative text-center p-4"
                style={{ backgroundImage: `url(${imageUrl})` }}
              >
                <div className="absolute inset-0 bg-black bg-opacity-25"></div> 
                <div className="absolute inset-0 bg-primary-700 bg-opacity-60"></div> {/* Oscurecer un poco más */}
                <div className="relative z-10 text-white max-w-3xl"> {/* Contenedor para el texto */}
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 drop-shadow-md">{slide.title}</h1>
                  {slide.subtitle && (
                    <p className="text-lg md:text-2xl mb-8 drop-shadow-sm">{slide.subtitle}</p>
                  )}
                  {/* Botón CTA */}
                  {slide.cta_is_visible && slide.cta_text && slide.cta_url && (
                    <a
                      href={slide.cta_url}
                      target={slide.cta_url.startsWith('#') ? '_self' : '_blank'}
                      rel="noopener noreferrer"
                      className="mt-6 inline-block px-8 py-3 bg-primary-500 text-white text-lg font-semibold rounded-lg shadow-md hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-opacity-75 transition-all duration-200 ease-in-out transform hover:scale-105"
                    >
                      {slide.cta_text}
                    </a>
                  )}
                </div>
              </div>
            </swiper-slide>
          );
        })}
      </swiper-container>
    </section>
  );
};

export default Banner;