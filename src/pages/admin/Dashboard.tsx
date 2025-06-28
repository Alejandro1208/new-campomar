import { 
  ShoppingBag, 
  Image, 
  Clock, 
  Settings, 
  BarChart3, 
  Users,
  FileText,
  Tag
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const menuItems = [
    {
      title: 'Productos',
      description: 'Gestionar productos y marcas',
      icon: ShoppingBag,
      link: '/admin/products',
      color: 'bg-blue-500 hover:bg-blue-600'
    },
    {
      title: 'Categorías',
      description: 'Administrar categorías de productos',
      icon: Tag,
      link: '/admin/categories',
      color: 'bg-green-500 hover:bg-green-600'
    },
    {
      title: 'Banners',
      description: 'Carrusel de imágenes principal',
      icon: Image,
      link: '/admin/banners',
      color: 'bg-purple-500 hover:bg-purple-600'
    },
    {
      title: 'Línea de Tiempo',
      description: 'Historia de la empresa',
      icon: Clock,
      link: '/admin/timeline',
      color: 'bg-orange-500 hover:bg-orange-600'
    },
    {
      title: 'Configuraciones',
      description: 'Ajustes generales del sitio',
      icon: Settings,
      link: '/admin/settings',
      color: 'bg-gray-500 hover:bg-gray-600'
    },
    {
      title: 'Estadísticas',
      description: 'Ver métricas del sitio',
      icon: BarChart3,
      link: '/admin/stats',
      color: 'bg-indigo-500 hover:bg-indigo-600'
    }
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Panel de Control</h1>
        <p className="text-gray-600">Gestiona todo el contenido de tu sitio web desde aquí</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {menuItems.map((item) => (
          <Link
            key={item.title}
            to={item.link}
            className="block bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 overflow-hidden group"
          >
            <div className="p-6">
              <div className={`${item.color} text-white p-4 rounded-xl w-16 h-16 mb-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                <item.icon size={28} />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2 group-hover:text-primary transition-colors duration-300">
                {item.title}
              </h3>
              <p className="text-gray-600 text-sm">
                {item.description}
              </p>
            </div>
          </Link>
        ))}
      </div>

      {/* Resumen rápido */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-2xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Total Productos</p>
              <p className="text-2xl font-bold">--</p>
            </div>
            <ShoppingBag size={32} className="text-blue-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-2xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Categorías</p>
              <p className="text-2xl font-bold">--</p>
            </div>
            <Tag size={32} className="text-green-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-2xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Banners</p>
              <p className="text-2xl font-bold">--</p>
            </div>
            <Image size={32} className="text-purple-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6 rounded-2xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm">Eventos</p>
              <p className="text-2xl font-bold">--</p>
            </div>
            <Clock size={32} className="text-orange-200" />
          </div>
        </div>
      </div>
    </div>
  );
}