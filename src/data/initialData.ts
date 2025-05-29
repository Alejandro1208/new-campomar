import { WebsiteData, User } from '../types';

export const initialWebsiteData: WebsiteData = {
  businessHours: [
    {
      id: '1',
      days: 'Lun-Vie',
      hours: '9:00-18:00',
    },
    {
      id: '2',
      days: 'Sáb',
      hours: '10:00-14:00',
    },
    {
      id: '3',
      days: 'Dom',
      hours: 'Cerrado',
    },
  ],
  contactInfo: [
    {
      id: '1',
      icon: 'phone',
      text: '+1 234 567 890',
      showOnMobile: true,
    },
    {
      id: '2',
      icon: 'mail',
      text: 'info@empresa.com',
      showOnMobile: true,
    },
    {
      id: '3',
      icon: 'map-pin',
      text: 'Calle Comercial 123, Ciudad',
      showOnMobile: false,
    },
    {
      id: '4',
      icon: 'clock',
      text: 'Lun-Vie: 9:00-18:00',
      showOnMobile: false,
    },
  ],
  menuItems: [
    { id: '1', text: 'Inicio', url: '#home' },
    { id: '2', text: 'Nosotros', url: '#about' },
    { id: '3', text: 'Historia', url: '#timeline' },
    { id: '4', text: 'Productos', url: '#products' },
    { id: '5', text: 'Ubicación', url: '#location' },
    { id: '6', text: 'Contacto', url: '#footer' },
  ],
  bannerSlides: [
    {
      id: '1',
      image: 'https://images.pexels.com/photos/3183197/pexels-photo-3183197.jpeg',
      title: 'Bienvenidos a Nuestra Empresa',
      subtitle: 'Brindando Soluciones de Calidad desde 2000',
    },
    {
      id: '2',
      image: 'https://images.pexels.com/photos/3182812/pexels-photo-3182812.jpeg',
      title: 'Soluciones Innovadoras',
      subtitle: 'Para Empresas Modernas',
    },
    {
      id: '3',
      image: 'https://images.pexels.com/photos/3182774/pexels-photo-3182774.jpeg',
      title: 'Equipo Experto',
      subtitle: 'Dedicados a Tu Éxito',
    },
    {
      id: '4',
      image: 'https://images.pexels.com/photos/3182781/pexels-photo-3182781.jpeg',
      title: 'Productos de Calidad',
      subtitle: 'De los Mejores Fabricantes',
    },
    {
      id: '5',
      image: 'https://images.pexels.com/photos/3182812/pexels-photo-3182812.jpeg',
      title: 'Satisfacción del Cliente',
      subtitle: 'Nuestra Prioridad',
    },
  ],
  companyInfo: {
    title: 'Nuestra Empresa',
    description: 'Somos una empresa líder en el mercado con más de 20 años de experiencia brindando soluciones innovadoras y productos de alta calidad. Nuestro compromiso con la excelencia y la satisfacción del cliente nos ha permitido crecer y establecernos como referentes en la industria. Contamos con un equipo de profesionales altamente capacitados y la tecnología más avanzada para garantizar los mejores resultados en cada proyecto.',
    images: [
      {
        id: '1',
        src: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg',
        alt: 'Oficina de la empresa',
      },
      {
        id: '2',
        src: 'https://images.pexels.com/photos/3184296/pexels-photo-3184296.jpeg',
        alt: 'Reunión de equipo',
      },
      {
        id: '3',
        src: 'https://images.pexels.com/photos/3182746/pexels-photo-3182746.jpeg',
        alt: 'Exhibición de productos',
      },
      {
        id: '4',
        src: 'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg',
        alt: 'Servicio al cliente',
      },
    ],
  },
  timelineEvents: [
    {
      id: '1',
      year: '2000',
      title: 'Fundación',
      description: 'Comenzamos nuestro viaje con la visión de ofrecer los mejores productos y servicios.',
    },
    {
      id: '2',
      year: '2005',
      title: 'Expansión',
      description: 'Ampliamos nuestra línea de productos y abrimos nuestra primera oficina regional.',
    },
    {
      id: '3',
      year: '2010',
      title: 'Alcance Internacional',
      description: 'Nuestros productos llegaron a mercados internacionales y obtuvieron reconocimiento global.',
    },
    {
      id: '4',
      year: '2020',
      title: 'Centro de Innovación',
      description: 'Establecimos nuestro centro de innovación para desarrollar nuevas soluciones de vanguardia.',
    },
  ],
  productCategories: [
    { id: '1', name: 'Todos' },
    { id: '2', name: 'Categoría A' },
    { id: '3', name: 'Categoría B' },
    { id: '4', name: 'Categoría C' },
    { id: '5', name: 'Categoría D' },
    { id: '6', name: 'Categoría E' },
    { id: '7', name: 'Categoría F' },
    { id: '8', name: 'Categoría G' },
  ],
  products: Array.from({ length: 20 }, (_, i) => ({
    id: `${i + 1}`,
    name: `Producto ${i + 1}`,
    logo: `https://via.placeholder.com/150x150.png?text=Logo+${i + 1}`,
    description: `Descripción del Producto ${i + 1}`,
    categoryId: `${(i % 7) + 2}`,
  })),
  socialMedia: [
    {
      id: '1',
      name: 'Facebook',
      icon: 'facebook',
      url: 'https://facebook.com',
    },
    {
      id: '2',
      name: 'Instagram',
      icon: 'instagram',
      url: 'https://instagram.com',
    },
  ],
  phoneNumbers: [
    {
      id: '1',
      number: '+1 234 567 890',
      label: 'Ventas',
    },
    {
      id: '2',
      number: '+1 234 567 891',
      label: 'Soporte',
    },
    {
      id: '3',
      number: '+1 234 567 892',
      label: 'Administración',
    },
    {
      id: '4',
      number: '+1 234 567 893',
      label: 'RRHH',
    },
    {
      id: '5',
      number: '+1 234 567 894',
      label: 'General',
    },
  ],
  mapLocation: {
    embedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3024.2219901290355!2d-74.00369368400567!3d40.71312937933185!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25a23e28c1191%3A0x49f75d3281df052a!2s150%20Park%20Row%2C%20New%20York%2C%20NY%2010007%2C%20USA!5e0!3m2!1sen!2sbg!4v1579767901424!5m2!1sen!2sbg',
  },
  logo: '/logo.svg',
};

export const users: User[] = [
  {
    id: '1',
    username: 'admin',
    password: 'admin123', // En una app real, esto estaría hasheado
    name: 'Administrador',
  },
  {
    id: '2',
    username: 'manager',
    password: 'manager123', // En una app real, esto estaría hasheado
    name: 'Gestor de Contenido',
  },
];