import React from 'react';
import { useWebsiteStore } from '../../store/useWebsiteStore';
import { Phone, Menu, Image, Info, Baseline as Timeline, ShoppingBag, MapPin, Settings, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const EditCard: React.FC<{
  title: string;
  description: string;
  icon: React.ReactNode;
  path: string;
}> = ({ title, description, icon, path }) => (
  <Link
    to={path}
    className="bg-white rounded-2xl shadow-custom hover:shadow-hover transition-all duration-200 p-6"
  >
    <div className="flex justify-between items-start">
      <div className="flex-1">
        <div className="flex items-center mb-3">
          <div className="mr-3 p-2 bg-primary-100 text-primary-500 rounded-lg">
            {icon}
          </div>
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        </div>
        <p className="text-gray-600">{description}</p>
      </div>
      <ChevronRight className="h-5 w-5 text-gray-400" />
    </div>
  </Link>
);

const Dashboard: React.FC = () => {
  const { products, bannerSlides, timelineEvents, phoneNumbers } = useWebsiteStore();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Panel Principal</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-2xl shadow-custom p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Productos</h3>
          <p className="text-3xl font-bold text-primary-500">{products.length}</p>
        </div>
        
        <div className="bg-white rounded-2xl shadow-custom p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Slides del Banner</h3>
          <p className="text-3xl font-bold text-primary-500">{bannerSlides.length}</p>
        </div>
        
        <div className="bg-white rounded-2xl shadow-custom p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Eventos en Línea de Tiempo</h3>
          <p className="text-3xl font-bold text-primary-500">{timelineEvents.length}</p>
        </div>
      </div>
      
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Editar Contenido</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <EditCard
          title="Barra Superior"
          description="Editar información de contacto mostrada en la barra superior"
          icon={<Phone className="h-5 w-5" />}
          path="/admin/topbar"
        />
        
        <EditCard
          title="Navegación"
          description="Editar elementos del menú y enlaces"
          icon={<Menu className="h-5 w-5" />}
          path="/admin/navigation"
        />
        
        <EditCard
          title="Banner"
          description="Editar slides y imágenes del banner"
          icon={<Image className="h-5 w-5" />}
          path="/admin/banner"
        />
        
        <EditCard
          title="Información de Empresa"
          description="Editar detalles e imágenes de la empresa"
          icon={<Info className="h-5 w-5" />}
          path="/admin/company"
        />
        
        <EditCard
          title="Línea de Tiempo"
          description="Editar eventos de la línea de tiempo"
          icon={<Timeline className="h-5 w-5" />}
          path="/admin/timeline"
        />
        
        <EditCard
          title="Productos"
          description="Gestionar catálogo y categorías de productos"
          icon={<ShoppingBag className="h-5 w-5" />}
          path="/admin/products"
        />
        
        <EditCard
          title="Ubicación"
          description="Actualizar ubicación en el mapa"
          icon={<MapPin className="h-5 w-5" />}
          path="/admin/location"
        />
        
        <EditCard
          title="Configuración"
          description="Configuración general del sitio web"
          icon={<Settings className="h-5 w-5" />}
          path="/admin/settings"
        />
      </div>
    </div>
  );
};

export default Dashboard;