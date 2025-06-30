// src/components/Home/CompanySection.tsx (ACTUALIZADO)
import { useSiteSettings, useCompanyImages } from '../../hooks/useData';

export default function CompanySection() {
  const { settings } = useSiteSettings();
  const { images: companyImages } = useCompanyImages();

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
          {companyImages.slice(0, 4).map((image, index) => (
            <div key={index} className="group overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <img src={`https://alejandrosabater.com.ar${image.image_url}`} alt={image.alt_text} className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300" />
            </div>
          ))}
        </div>

        <div className="mt-16 bg-white rounded-2xl p-8 shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="group">
              <div className="text-4xl font-bold text-accent mb-2 group-hover:scale-110 transition-transform duration-300">
                {settings.metric_experience_value || '20+'}
              </div>
              <div className="text-gray-600">{settings.metric_experience_label || 'Años de Experiencia'}</div>
            </div>
            <div className="group">
              <div className="text-4xl font-bold text-accent mb-2 group-hover:scale-110 transition-transform duration-300">
                {settings.metric_clients_value || '500+'}
              </div>
              <div className="text-gray-600">{settings.metric_clients_label || 'Clientes Satisfechos'}</div>
            </div>
            <div className="group">
              <div className="text-4xl font-bold text-accent mb-2 group-hover:scale-110 transition-transform duration-300">
                {settings.metric_projects_value || '100+'}
              </div>
              <div className="text-gray-600">{settings.metric_projects_label || 'Proyectos Completados'}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}