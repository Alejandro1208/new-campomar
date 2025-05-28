import React, { useEffect, useRef } from 'react';
import { useWebsiteStore } from '../store/useWebsiteStore';
import { register } from 'swiper/element/bundle';

// Register Swiper web components
register();

const Banner: React.FC = () => {
  const bannerSlides = useWebsiteStore((state) => state.bannerSlides);
  const swiperRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    // Configure Swiper
    const swiperContainer = swiperRef.current;
    
    if (swiperContainer) {
      const params = {
        slidesPerView: 1,
        spaceBetween: 0,
        loop: true,
        autoplay: {
          delay: 5000,
          disableOnInteraction: false,
        },
        pagination: {
          clickable: true,
        },
      };

      Object.assign(swiperContainer, params);
      
      // Initialize Swiper
      swiperContainer.initialize();
    }
  }, []);

  return (
    <section id="home" className="h-60vh pt-16">
      <swiper-container ref={swiperRef} init="false" class="h-full w-full">
        {bannerSlides.map((slide) => (
          <swiper-slide key={slide.id}>
            <div 
              className="h-full w-full bg-cover bg-center flex items-center justify-center relative"
              style={{ backgroundImage: `url(${slide.image})` }}
            >
              <div className="absolute inset-0 bg-primary-500 bg-opacity-50"></div>
              <div className="relative z-10 text-white text-center px-4">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">{slide.title}</h1>
                {slide.subtitle && (
                  <p className="text-xl md:text-2xl">{slide.subtitle}</p>
                )}
              </div>
            </div>
          </swiper-slide>
        ))}
      </swiper-container>
    </section>
  );
};

export default Banner;