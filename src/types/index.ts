// Data Types
export interface ContactInfo {
  id: string;
  icon: string;
  text: string;
  showOnMobile: boolean;
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
  subtitle?: string;
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
  password: string; // In a real app, this would be hashed
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
export interface Image { // <--- AÑADE ESTA INTERFAZ Y EXPÓRTALA
  id: string;
  src: string;
  alt: string;
}

export interface CompanyInfo {
  id?: string;
  title: string;
  description: string;
  images: Image[]; // <--- USA EL TIPO Image AQUÍ
}
