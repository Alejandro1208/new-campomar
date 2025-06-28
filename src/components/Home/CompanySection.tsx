import { useSiteSettings } from '../../hooks/useData';

export default function CompanySection() {
  const { settings } = useSiteSettings();

  // Imágenes de ejemplo de Pexels para la empresa
  const companyImages = [
    'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/3184428/pexels-photo-3184428.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/3184406/pexels-photo-3184406.jpeg?auto=compress&cs=tinysrgb&w=400'
  ];

  return (
    <section id="empresa" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-primary mb-6">La Empresa</h2>
          <div className="w-24 h-1 bg-accent mx-auto mb-8"></div>
          <div className="max-w-4xl mx-auto">
            <p className="text-lg text-gray-700 leading-relaxed">
              {settings.company_description}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
          {companyImages.map((image, index) => (
            <div 
              key={index} 
              className="group overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              <img
                src={image}
                alt={`Empresa ${index + 1}`}
                className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
              />
            </div>
          ))}
        </div>

        <div className="mt-16 bg-white rounded-2xl p-8 shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="group">
              <div className="text-4xl font-bold text-accent mb-2 group-hover:scale-110 transition-transform duration-300">
                20+
              </div>
              <div className="text-gray-600">Años de Experiencia</div>
            </div>
            <div className="group">
              <div className="text-4xl font-bold text-accent mb-2 group-hover:scale-110 transition-transform duration-300">
                500+
              </div>
              <div className="text-gray-600">Clientes Satisfechos</div>
            </div>
            <div className="group">
              <div className="text-4xl font-bold text-accent mb-2 group-hover:scale-110 transition-transform duration-300">
                100+
              </div>
              <div className="text-gray-600">Proyectos Completados</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}