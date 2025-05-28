import { Product, ProductCategory, SocialMedia, PhoneNumber, BusinessHours } from '../types';

const API_URL = 'http://localhost:3001/api';

export const databaseService = {
  // Productos
  async getProducts(): Promise<Product[]> {
    const response = await fetch(`${API_URL}/products`);
    return response.json();
  },

  async addProduct(product: Omit<Product, 'id'>): Promise<Product> {
    const response = await fetch(`${API_URL}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product)
    });
    return response.json();
  },

  async updateProduct(id: string, product: Product): Promise<Product> {
    const response = await fetch(`${API_URL}/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product)
    });
    return response.json();
  },

  async deleteProduct(id: string): Promise<void> {
    await fetch(`${API_URL}/products/${id}`, { method: 'DELETE' });
  },

  // Categorías de Productos
  async getProductCategories(): Promise<ProductCategory[]> {
    const response = await fetch(`${API_URL}/product-categories`);
    return response.json();
  },

  async addProductCategory(category: Omit<ProductCategory, 'id'>): Promise<ProductCategory> {
    const response = await fetch(`${API_URL}/product-categories`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(category)
    });
    return response.json();
  },

  async deleteProductCategory(id: string): Promise<void> {
    await fetch(`${API_URL}/product-categories/${id}`, { method: 'DELETE' });
  },

  // Redes Sociales
  async getSocialMedia(): Promise<SocialMedia[]> {
    const response = await fetch(`${API_URL}/social-media`);
    return response.json();
  },

  async updateSocialMedia(id: string, socialMedia: SocialMedia): Promise<SocialMedia> {
    const response = await fetch(`${API_URL}/social-media/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(socialMedia)
    });
    return response.json();
  },

  // Teléfonos
  async getPhoneNumbers(): Promise<PhoneNumber[]> {
    const response = await fetch(`${API_URL}/phone-numbers`);
    return response.json();
  },

  async addPhoneNumber(phone: Omit<PhoneNumber, 'id'>): Promise<PhoneNumber> {
    const response = await fetch(`${API_URL}/phone-numbers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(phone)
    });
    return response.json();
  },

  async updatePhoneNumber(id: string, phone: PhoneNumber): Promise<PhoneNumber> {
    const response = await fetch(`${API_URL}/phone-numbers/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(phone)
    });
    return response.json();
  },

  async deletePhoneNumber(id: string): Promise<void> {
    await fetch(`${API_URL}/phone-numbers/${id}`, { method: 'DELETE' });
  },

  // Horario de Atención
  async getBusinessHours(): Promise<BusinessHours> {
    const response = await fetch(`${API_URL}/business-hours`);
    return response.json();
  },

  async updateBusinessHours(hours: BusinessHours): Promise<BusinessHours> {
    const response = await fetch(`${API_URL}/business-hours/${hours.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(hours)
    });
    return response.json();
  }
};