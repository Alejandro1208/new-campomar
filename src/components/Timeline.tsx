import React, { useEffect, useRef, useState } from 'react';
import { useWebsiteStore } from '../store/useWebsiteStore';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

const Timeline: React.FC = () => {
  const timelineEvents = useWebsiteStore((state) => state.timelineEvents);
  const [activeIndex, setActiveIndex] = useState(0);
  const timelineRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (timelineRef.current) {
      observer.observe(timelineRef.current);
    }

    return () => {
      if (timelineRef.current) {
        observer.unobserve(timelineRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (isVisible) {
      const interval = setInterval(() => {
        setActiveIndex((prevIndex) => (prevIndex + 1) % timelineEvents.length);
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [isVisible, timelineEvents.length]);

  return (
    <section id="timeline" className="py-16 bg-gray-100">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-primary-500 mb-12">Our Journey</h2>
        
        <div ref={timelineRef} className="relative">
          {/* Timeline Line */}
          <div className="absolute left-0 md:left-1/2 transform md:translate-x-[-50%] top-0 bottom-0 w-1 bg-primary-300"></div>
          
          {/* Timeline Events */}
          <div className="relative">
            {timelineEvents.map((event, index) => (
              <div 
                key={event.id}
                className={`mb-12 flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
              >
                {/* Event Content */}
                <div className="md:w-1/2 p-4">
                  <div 
                    className={`bg-white rounded-2xl shadow-custom p-6 transition-all duration-500 ${
                      activeIndex === index ? 'transform scale-105 shadow-hover' : ''
                    }`}
                  >
                    <div className="text-primary-500 font-bold text-2xl mb-2">{event.year}</div>
                    <h3 className="text-xl font-semibold mb-2">{event.title}</h3>
                    {event.description && <p className="text-gray-600">{event.description}</p>}
                  </div>
                </div>
                
                {/* Timeline Point */}
                <div className="md:w-1/2 flex justify-center relative">
                  <div 
                    className={`absolute left-0 md:left-auto md:top-8 h-6 w-6 rounded-full border-4 ${
                      activeIndex === index ? 'bg-primary-500 border-primary-300' : 'bg-white border-primary-500'
                    } transition-colors duration-300`}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Timeline;