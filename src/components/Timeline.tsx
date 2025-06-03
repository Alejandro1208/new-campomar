import React, { useEffect, useRef, useState } from 'react';
import { useWebsiteStore } from '../store/useWebsiteStore';

const Timeline: React.FC = () => {
  const timelineEvents = useWebsiteStore((state) => state.timelineEvents);
  const sectionRef = useRef<HTMLDivElement>(null);
  const [startAnimation, setStartAnimation] = useState(false);

  useEffect(() => {
    let observer: IntersectionObserver;
    if (sectionRef.current && timelineEvents && timelineEvents.length > 0) {
      observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setStartAnimation(true);
            if (sectionRef.current) {
              observer.unobserve(sectionRef.current);
            }
          }
        },
        { threshold: 0.1 } 
      );
      observer.observe(sectionRef.current);
    }
    return () => {
      if (observer && sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, [timelineEvents]);

  const colorPalette = [
    { bg: 'bg-timeline-1', text: 'text-timeline-1', line: 'bg-timeline-1' },
    { bg: 'bg-indigo-500', text: 'text-indigo-700', line: 'bg-indigo-500' }, 
    { bg: 'bg-blue-500',   text: 'text-blue-700',   line: 'bg-blue-500' },
    { bg: 'bg-sky-500',    text: 'text-sky-700',    line: 'bg-sky-500' },
  ];

  if (!timelineEvents || timelineEvents.length === 0) {
    return (
      <section id="timeline" ref={sectionRef} className="py-16 bg-gray-100">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-primary-500 mb-12">Historia</h2>
          <p className="text-center text-gray-500">No hay eventos en la línea de tiempo para mostrar.</p>
        </div>
      </section>
    );
  }

  const lineHeightClass = "h-3 md:h-3";
  const pointSizeClasses = "w-5 h-5";
  const pointBorderStyle = "border-4 border-gray-100";

  return (
    <section id="timeline" ref={sectionRef} className="py-16 bg-gray-100 overflow-hidden">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-primary-500 mb-12 md:mb-20">
          Nuestra Historia
        </h2>

        <div className="relative flex flex-col md:flex-row md:justify-center">
          <div className="absolute left-6 md:left-1/2 w-1 md:w-0 h-full md:h-0 bg-gray-300 md:hidden transform -translate-x-1/2"></div>

          <div className={`hidden md:block absolute top-1/2 left-0 w-full ${lineHeightClass} bg-gray-300 transform -translate-y-1/2 rounded-full`}
               style={{ marginTop: '-1.125rem' }}>
          </div>


          {timelineEvents.map((event, index) => {
            const colors = colorPalette[index % colorPalette.length];
            const animationDelay = startAnimation ? `${index * 200}ms` : '0ms';
            const isEven = index % 2 === 0;

            return (
              <div 
                key={event.id}
                className={`relative md:flex-shrink-0 md:${timelineEvents.length <= 4 ? `w-1/${timelineEvents.length}` : 'w-64'} 
                            group opacity-0 transform transition-all duration-700 ease-out
                            ${startAnimation ? 'opacity-100 translate-y-0 md:translate-x-0' : 'opacity-0 translate-y-10 md:translate-x-0 md:translate-y-0'}`}
                style={{ 
                  transitionDelay: animationDelay,
                  paddingLeft: '2.5rem',
                  paddingTop: '0',
                  paddingBottom: '2rem',
                }}
              >
                <div
                    className={`hidden md:block absolute left-0 w-full ${lineHeightClass} ${colors.line} opacity-0 transform -translate-y-1/2 transition-all duration-500 ease-out ${
                        startAnimation ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'
                      } ${index === 0 ? 'rounded-l-full' : ''} ${index === timelineEvents.length - 1 ? 'rounded-r-full' : ''}`}
                    style={{
                      top: '50%',
                      zIndex: 1, 
                      transformOrigin: 'left center', 
                      transitionDelay: animationDelay,
                      marginTop: '-1.125rem' 
                    }}
                ></div>
                <div className={`relative z-10 md:text-center 
                                md:py-8  /* Padding vertical para desktop para separar de la línea */
                                `}>
                  {/* -- Layout Móvil (Vertical) -- */}
                  <div className="md:hidden flex">
                    {/* Punto y Línea Vertical Conectora para Móvil */}
                    <div className="absolute flex flex-col items-center" style={{left: '-0.625rem', top: '0.5rem', bottom: '0'}}> {/* Ajusta 'left' y 'top' */}
                      <div className={` ${pointSizeClasses} rounded-full ${colors.bg} ${pointBorderStyle} shadow-lg z-20`}></div>
                      <div className={`w-0.5 ${colors.bg} flex-grow`}></div>
                    </div>
                    {/* Contenido textual */}
                    <div className="pl-6 pb-8"> {/* Padding para separar del punto y la línea */}
                      <p className={`text-lg font-bold ${colors.text} mb-1`}>{event.year}</p>
                      <h3 className={`text-xl font-semibold ${colors.text} mb-1`}>
                        {event.title}
                      </h3>
                      {event.description && (
                        <p className="text-sm text-gray-700">
                          {event.description}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* -- Layout Desktop (Horizontal) -- */}
                  <div className="hidden md:block">
                    {/* Título/Descripción Arriba */}
                    <div className="mb-3 min-h-[6rem] flex flex-col justify-end items-center">
                      <h3 className={`text-lg font-semibold ${colors.text}`}>
                        {event.title}
                      </h3>
                      {event.description && (
                        <p className="text-xs text-gray-700 mt-1 max-w-xs mx-auto">
                          {event.description}
                        </p>
                      )}
                    </div>
                    {/* Punto y Línea Vertical */}
                    <div className="relative flex flex-col items-center h-20 md:h-24">
                       <div className={`w-0.5 ${colors.bg} h-1/2`}></div> {/* Mitad superior */}
                      <div 
                        className={`absolute ${pointSizeClasses} rounded-full ${colors.bg} ${pointBorderStyle} shadow-lg z-20`}
                        style={{ top: '50%', transform: 'translateY(-50%)'}} 
                      ></div>
                       <div className={`w-0.5 ${colors.bg} h-1/2`}></div> {/* Mitad inferior */}
                    </div>
                    {/* Año Abajo */}
                    <div className="mt-2">
                      <p className={`text-xl font-bold ${colors.text}`}>
                        {event.year}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Timeline;