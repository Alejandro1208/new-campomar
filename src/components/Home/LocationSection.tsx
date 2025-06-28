import { useSiteSettings } from '../../hooks/useData';

export default function LocationSection() {
  const { settings } = useSiteSettings();

  return (
    <section id="contacto" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-primary mb-6">Nuestra Ubicación</h2>
          <div className="w-24 h-1 bg-accent mx-auto mb-8"></div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Visítanos en nuestra oficina principal
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="bg-gray-100 rounded-2xl overflow-hidden shadow-lg">
            <iframe
              src={settings.maps_iframe_url}
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full"
              title="Ubicación de CAMPOMAR"
            ></iframe>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-primary text-white p-6 rounded-2xl text-center hover:scale-105 transition-transform duration-300">
              <h3 className="text-xl font-semibold mb-2">Dirección</h3>
              <p>{settings.topbar_address}</p>
            </div>
            <div className="bg-secondary text-white p-6 rounded-2xl text-center hover:scale-105 transition-transform duration-300">
              <h3 className="text-xl font-semibold mb-2">Teléfono</h3>
              <p>{settings.topbar_phone}</p>
            </div>
            <div className="bg-accent text-white p-6 rounded-2xl text-center hover:scale-105 transition-transform duration-300">
              <h3 className="text-xl font-semibold mb-2">Horario</h3>
              <p>{settings.topbar_schedule}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}