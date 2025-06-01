import {
  Product,
  ProductCategory,
  SocialMedia,
  PhoneNumber,
  BusinessHours,
  BannerSlide,
  MenuItem,
  CompanyInfo,
  TimelineEvent,
  MapLocation,
  SiteSettingsPayload,
  ContactInfo,
} from '../types';

const API_URL = 'http://localhost:3001/api';

interface UploadedImageResponse {
  message: string;
  filePath: string;
  publicUrl: string;
}




interface UploadedFileResponse {
  message: string;
  filePath: string;
  publicUrl: string;
}

interface SiteSettingsResponse {
  mapLocation: MapLocation;
  logo: string;
}

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

  async updateMenuItem(id: string, itemData: Partial<MenuItem>): Promise<MenuItem> {
    const response = await fetch(`<span class="math-inline">\{API\_URL\}/menu\-items/</span>{id}`, { // <--- ASEGÚRATE DE ESTA LÍNEA
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(itemData),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Error al actualizar el ítem de menú.' }));
      throw new Error(errorData.message || `Error del servidor: ${response.status}`);
    }
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
  },

  async updateCompanyInfo(data: Partial<CompanyInfo>): Promise<CompanyInfo> {
    const response = await fetch(`${API_URL}/company-info`, { // API_URL debe estar definido en este archivo
      method: 'PUT', // O 'PATCH', según cómo diseñes tu API de backend
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      // Podrías querer leer el cuerpo del error si el backend lo envía
      // const errorData = await response.json().catch(() => ({ message: 'Error updating company info' }));
      // throw new Error(errorData.message || 'Error updating company info');
      throw new Error('Error updating company info');
    }
    return response.json();
  },

  async uploadCompanyImageFile(file: File): Promise<UploadedImageResponse> {
    const formData = new FormData();
    formData.append('companyImage', file); // 'companyImage' debe coincidir con el nombre esperado por multer.single() en el backend

    const response = await fetch(`${API_URL}/upload/company-image`, {
      method: 'POST',
      body: formData,
      // NO establezcas el header 'Content-Type' manualmente cuando uses FormData con fetch,
      // el navegador lo hará automáticamente con el boundary correcto.
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Error al subir la imagen.' }));
      throw new Error(errorData.message || `Error del servidor: ${response.status}`);
    }
    return response.json();
  },

  // --> FUNCIÓN PARA SUBIR LOGOS DE PRODUCTOS <--
  async uploadProductLogoFile(file: File): Promise<UploadedFileResponse> {
    const formData = new FormData();
    formData.append('productLogo', file); // 'productLogo' debe coincidir con multer.single() en el backend

    const response = await fetch(`${API_URL}/upload/product-logo`, { // Nuevo endpoint
      method: 'POST',
      body: formData,
      // El navegador establece el Content-Type automáticamente para FormData
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Error al subir el logo del producto.' }));
      throw new Error(errorData.message || `Error del servidor: ${response.status}`);
    }
    return response.json();
  },

  async getSiteSettings(): Promise<SiteSettingsResponse> {
    const response = await fetch(`${API_URL}/site-settings`);
    if (!response.ok) {
      console.warn('Error fetching site settings, returning defaults.');
      // Devuelve valores por defecto para que el store no falle completamente
      return { mapLocation: { embedUrl: '' }, logo: '' };
    }
    return response.json();
  },

  async updateSiteSettings(data: SiteSettingsPayload): Promise<SiteSettingsResponse> {
    const response = await fetch(`${API_URL}/site-settings`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Error al actualizar la configuración del sitio.' }));
      throw new Error(errorData.message || `Error del servidor: ${response.status}`);
    }
    return response.json();
  },
  async getContactInfo(): Promise<ContactInfo[]> {
    const response = await fetch(`${API_URL}/contact-info`);
    if (!response.ok) {
      console.error('Error fetching contact info, returning empty array.');
      return []; // Devolver array vacío en caso de error para no romper el store
    }
    return response.json();
  },
  async addContactInfoItem(itemData: Omit<ContactInfo, 'id'>): Promise<ContactInfo> {
    const response = await fetch(`${API_URL}/contact-info`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(itemData),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Error al agregar el ítem de contacto.' }));
      throw new Error(errorData.message || `Error del servidor: ${response.status}`);
    }
    return response.json();
  },

  async updateContactInfoItem(id: string, itemData: Partial<ContactInfo>): Promise<ContactInfo> {
    const response = await fetch(`${API_URL}/contact-info/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(itemData),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Error al actualizar el ítem de contacto.' }));
      throw new Error(errorData.message || `Error del servidor: ${response.status}`);
    }
    return response.json();
  },

  async deleteContactInfoItem(id: string): Promise<void> {
    const response = await fetch(`${API_URL}/contact-info/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Error al eliminar el ítem de contacto.' }));
      throw new Error(errorData.message || `Error del servidor: ${response.status}`);
    }
    // DELETE usualmente no devuelve contenido, o devuelve un mensaje de éxito que no necesitamos procesar aquí.
  }

};

