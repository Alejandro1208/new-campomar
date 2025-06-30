// src/pages/admin/Dashboard.tsx (VERSIÓN FINAL)

import { 
  ShoppingBag, 
  Image, 
  Clock, 
  Settings, 
  Tag,
  Phone,
  Building2 // Importamos el nuevo ícono
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useDashboardStats } from '../../hooks/useData'; // Importamos el nuevo hook

export default function Dashboard() {
  const { stats, loading } = useDashboardStats();

  // El array de tarjetas ahora coincide con el menú lateral, sin "Estadísticas"
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
      title: 'La Empresa',
      description: 'Editar imágenes y métricas de la sección',
      icon: Building2,
      link: '/admin/company',
      color: 'bg-teal-500 hover:bg-teal-600'
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
      title: 'Teléfonos Footer',
      description: 'Gestionar la lista de teléfonos de contacto',
      icon: Phone,
      link: '/admin/phones',
      color: 'bg-sky-500 hover:bg-sky-600'
    },
  ];

  const summaryCards = [
      { title: 'Total Productos', value: stats.total_products, icon: ShoppingBag, color: 'from-blue-500 to-blue-600', iconColor: 'text-blue-200' },
      { title: 'Categorías', value: stats.total_categories, icon: Tag, color: 'from-green-500 to-green-600', iconColor: 'text-green-200' },
      { title: 'Banners', value: stats.total_banners, icon: Image, color: 'from-purple-500 to-purple-600', iconColor: 'text-purple-200' },
      { title: 'Eventos', value: stats.total_events, icon: Clock, color: 'from-orange-500 to-orange-600', iconColor: 'text-orange-200' }
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
      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {summaryCards.map(card => (
            <div key={card.title} className={`bg-gradient-to-r ${card.color} text-white p-6 rounded-2xl`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/80 text-sm">{card.title}</p>
                  <p className="text-3xl font-bold">{loading ? '...' : card.value}</p>
                </div>
                <card.icon size={32} className={card.iconColor} />
              </div>
            </div>
        ))}
      </div>
    </div>
  );
}