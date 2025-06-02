export interface ContactInfo {
  id: string;
  icon: string;
  text: string;
  show_on_mobile: boolean;
  is_active: boolean; 
}

export interface MenuItem {
  id: string;
  text: string;
  url: string;
}


export interface BannerSlide {
  id: string;
  image: string;
  title: string;
  subtitle: string;
  cta_text?: string | null; 
  cta_url?: string | null;
  cta_is_visible?: boolean;
}

export interface CompanyInfo {
  title: string;
  description: string;
  images: {
    id: string;
    src: string;
    alt: string;
  }[];
}

export interface TimelineEvent {
  id: string;
  year: string;
  title: string;
  description?: string;
}

export interface ProductCategory {
  id: string;
  name: string;
}

export interface Product {
  id: string;
  name: string;
  logo: string;
  description: string;
  category_id: string;
}

export interface SocialMedia {
  id: string;
  name: string;
  icon: string;
  url: string;
}

export interface PhoneNumber {
  id: string;
  number: string;
  label?: string;
}

export interface BusinessHours {
  id: string;
  days: string;
  hours: string;
}

export interface SiteSettingsPayload { 
  mapLocation?: MapLocation;
  logo?: string;
}

export interface MapLocation {
  embedUrl: string;
}

export interface SiteSettingsResponse {
  mapLocation: MapLocation;
  logo: string; 
}

export interface SiteSettingsPayload {
  mapLocation?: MapLocation;
  logo?: string;
}

export interface User {
  id: string;
  username: string;
  password: string; 
  name: string;
}

// State Types
export interface WebsiteData {
  contactInfo: ContactInfo[];
  menuItems: MenuItem[];
  bannerSlides: BannerSlide[];
  companyInfo: CompanyInfo;
  timelineEvents: TimelineEvent[];
  productCategories: ProductCategory[];
  products: Product[];
  socialMedia: SocialMedia[];
  phoneNumbers: PhoneNumber[];
  businessHours: BusinessHours[];
  mapLocation: MapLocation;
  logo: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}
export interface Image { 
  id: string;
  src: string;
  alt: string;
}

export interface CompanyInfo {
  id?: string;
  title: string;
  description: string;
  images: Image[]; 
}

export interface MapLocation {
  embedUrl: string;
}


export interface SiteSettingsData { 
  mapLocation: MapLocation;
  logo: string;
  footerShortDescription?: string; 
  footerCopyright?: string;   
}

export interface SiteSettingsPayload {
  mapLocation?: MapLocation;
  logo?: string; // Esta será la ruta del archivo del logo
  footerShortDescription?: string; // Añadido
  footerCopyright?: string;      // Añadido
  // logoFile?: File | null; // Este campo es más para la lógica interna del store/componente, no necesariamente parte del tipo que va al backend
}

// Interfaz principal para los datos del sitio web en el store
export interface WebsiteData {
  // ... (tus otros campos: contactInfo, menuItems, bannerSlides, companyInfo, etc.)
  products: Product[];
  productCategories: ProductCategory[];
  socialMedia: SocialMedia[];
  phoneNumbers: PhoneNumber[];
  businessHours: BusinessHours[]; // Asegúrate de que esto sea un array si así lo manejas

  mapLocation: MapLocation;
  logo: string;
  footerShortDescription: string; // <-- AÑADE ESTA LÍNEA
  footerCopyright: string;      // <-- AÑADE ESTA LÍNEA
}

export interface MapLocation { embedUrl: string; } // Asegúrate que esté
export interface SiteSettingsResponse { mapLocation: MapLocation; logo: string; footerShortDescription?: string; footerCopyright?: string; }
export interface SiteSettingsPayload { mapLocation?: MapLocation; logo?: string; footerShortDescription?: string; footerCopyright?: string; }