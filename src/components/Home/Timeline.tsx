// src/components/Home/Timeline.tsx (VERSIÓN FINAL CON ANIMACIONES)
import { useTimelineEvents, useSiteSettings } from '../../hooks/useData';
import { useInView } from 'react-intersection-observer';

const colors = ['#00619e', '#2484c4', '#47a6e9', '#3595d6', '#1272b1'];

const TimelineItem = ({ event, index }: { event: any, index: number }) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.5,
    delay: 100,
  });

  const isLeft = index % 2 === 0;
  const color = colors[index % colors.length]; // Cicla a través de los colores

  return (
    <div ref={ref} className="relative flex justify-center">
      {/* Contenido */}
      <div className={`w-full md:w-5/12 p-4 transition-all duration-700 ease-out ${inView ? 'opacity-100' : 'opacity-0'} ${isLeft ? `md:mr-auto md:pr-8 md:text-right ${inView ? 'md:translate-x-0' : 'md:-translate-x-4'}` : `md:ml-auto md:pl-8 ${inView ? 'md:translate-x-0' : 'md:translate-x-4'}`}`}>
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <p className="text-2xl font-bold mb-2" style={{ color: color }}>{event.year}</p>
          <h3 className="text-lg font-semibold text-gray-800">{event.title}</h3>
        </div>
      </div>
      {/* Punto en la línea */}
      <div className={`absolute top-1/2 -translate-y-1/2 w-6 h-6 rounded-full border-4 border-white shadow-md transition-transform duration-500 z-10 ${inView ? 'scale-100' : 'scale-0'}`} style={{ backgroundColor: color }}></div>
    </div>
  );
};


export default function Timeline() {
  const { events, loading } = useTimelineEvents();
  const { settings } = useSiteSettings();

  return (
    <section id="historia" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-primary mb-4">Nuestra Historia</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {settings.timeline_description}
          </p>
          <div className="w-24 h-1 bg-accent mx-auto mt-4"></div>
        </div>
        
        <div className="relative">
          {/* La línea vertical */}
          <div className="absolute left-1/2 -translate-x-1/2 w-1 h-full bg-gray-200"></div>
          <div className="space-y-12 md:space-y-0">
            {loading ? <p>Cargando...</p> : events.map((event, index) => (
              <TimelineItem key={event.id} event={event} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}