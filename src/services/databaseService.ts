import { 
  Product, 
  ProductCategory, 
  SocialMedia, 
  PhoneNumber, 
  BusinessHours,
  BannerSlide,
  MenuItem,
  CompanyInfo,
  TimelineEvent 
} from '../types';

const API_URL = 'http://localhost:3001/api';

export const databaseService = {
  // Productos
  async getProducts(): Promise<Product[]> {
    const response = await fetch(`${API_URL}/products`);
    if (!response.ok) throw new Error('Error fetching products');
    return response.json();
  },

  async addProduct(product: Omit<Product, 'id'>): Promise<Product> {
    const response = await fetch(`${API_URL}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product)
    });
    if (!response.ok) throw new Error('Error adding product');
    return response.json();
  },

  async updateProduct(id: string, product: Product): Promise<Product> {
    const response = await fetch(`${API_URL}/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product)
    });
    if (!response.ok) throw new Error('Error updating product');
    return response.json();
  },

  async deleteProduct(id: string): Promise<void> {
    const response = await fetch(`${API_URL}/products/${id}`, { method: 'DELETE' });
    if (!response.ok) throw new Error('Error deleting product');
  },

  // Categorías de Productos
  async getProductCategories(): Promise<ProductCategory[]> {
    const response = await fetch(`${API_URL}/product-categories`);
    if (!response.ok) throw new Error('Error fetching product categories');
    return response.json();
  },

  async addProductCategory(category: Omit<ProductCategory, 'id'>): Promise<ProductCategory> {
    const response = await fetch(`${API_URL}/product-categories`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(category)
    });
    if (!response.ok) throw new Error('Error adding product category');
    return response.json();
  },

  async deleteProductCategory(id: string): Promise<void> {
    const response = await fetch(`${API_URL}/product-categories/${id}`, { method: 'DELETE' });
    if (!response.ok) throw new Error('Error deleting product category');
  },

  // Redes Sociales
  async getSocialMedia(): Promise<SocialMedia[]> {
    const response = await fetch(`${API_URL}/social-media`);
    if (!response.ok) throw new Error('Error fetching social media');
    return response.json();
  },

  async updateSocialMedia(id: string, socialMedia: SocialMedia): Promise<SocialMedia> {
    const response = await fetch(`${API_URL}/social-media/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(socialMedia)
    });
    if (!response.ok) throw new Error('Error updating social media');
    return response.json();
  },

  // Teléfonos
  async getPhoneNumbers(): Promise<PhoneNumber[]> {
    const response = await fetch(`${API_URL}/phone-numbers`);
    if (!response.ok) throw new Error('Error fetching phone numbers');
    return response.json();
  },

  async addPhoneNumber(phone: Omit<PhoneNumber, 'id'>): Promise<PhoneNumber> {
    const response = await fetch(`${API_URL}/phone-numbers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(phone)
    });
    if (!response.ok) throw new Error('Error adding phone number');
    return response.json();
  },

  async updatePhoneNumber(id: string, phone: PhoneNumber): Promise<PhoneNumber> {
    const response = await fetch(`${API_URL}/phone-numbers/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(phone)
    });
    if (!response.ok) throw new Error('Error updating phone number');
    return response.json();
  },

  async deletePhoneNumber(id: string): Promise<void> {
    const response = await fetch(`${API_URL}/phone-numbers/${id}`, { method: 'DELETE' });
    if (!response.ok) throw new Error('Error deleting phone number');
  },

  // Horario de Atención
  async getBusinessHours(): Promise<BusinessHours> {
    const response = await fetch(`${API_URL}/business-hours`);
    if (!response.ok) throw new Error('Error fetching business hours');
    return response.json();
  },

  async updateBusinessHours(hours: BusinessHours): Promise<BusinessHours> {
    const response = await fetch(`${API_URL}/business-hours/${hours.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(hours)
    });
    if (!response.ok) throw new Error('Error updating business hours');
    return response.json();
  },

  // Banner Slides
  async getBannerSlides(): Promise<BannerSlide[]> {
    const response = await fetch(`${API_URL}/banner-slides`);
    if (!response.ok) throw new Error('Error fetching banner slides');
    return response.json();
  },

  // Menu Items
  async getMenuItems(): Promise<MenuItem[]> {
    const response = await fetch(`${API_URL}/menu-items`);
    if (!response.ok) throw new Error('Error fetching menu items');
    return response.json();
  },

  // Company Info
  async getCompanyInfo(): Promise<CompanyInfo> {
    const response = await fetch(`${API_URL}/company-info`);
    if (!response.ok) throw new Error('Error fetching company info');
    return response.json();
  },

  // Timeline Events
  async getTimelineEvents(): Promise<TimelineEvent[]> {
    const response = await fetch(`${API_URL}/timeline-events`);
    if (!response.ok) throw new Error('Error fetching timeline events');
    return response.json();
  }
};