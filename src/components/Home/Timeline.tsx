import { useTimelineEvents } from '../../hooks/useData';

export default function Timeline() {
  const { events, loading } = useTimelineEvents();

  if (loading) {
    return (
      <section id="historia" className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-primary mb-6">Nuestra Historia</h2>
          <p>Cargando...</p>
        </div>
      </section>
    );
  }

  return (
    <section id="historia" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-primary mb-6">Nuestra Historia</h2>
          <div className="w-24 h-1 bg-accent mx-auto mb-8"></div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Un recorrido por los momentos más importantes de nuestra trayectoria
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          {/* Línea central */}
          <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-accent"></div>

          {events.map((event, index) => (
            <div
              key={event.id}
              className={`relative flex items-center mb-8 ${
                index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'
              }`}
            >
              {/* Contenido del evento */}
              <div className={`w-5/12 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8 text-left'}`}>
                <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <div className="text-2xl font-bold text-accent mb-2">{event.year}</div>
                  <h3 className="text-lg font-semibold text-gray-800">{event.title}</h3>
                </div>
              </div>

              {/* Círculo central */}
              <div className="absolute left-1/2 transform -translate-x-1/2 w-6 h-6 bg-accent rounded-full border-4 border-white shadow-lg z-10"></div>

              {/* Espacio vacío del otro lado */}
              <div className="w-5/12"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}