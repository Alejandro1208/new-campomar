import { create } from 'zustand';
// Eliminar esta importación ya que no se usa
// import { api } from '../services/api';
import { WebsiteData, ContactInfo, BannerSlide, MenuItem, TimelineEvent, Product, ProductCategory, PhoneNumber, SocialMedia, BusinessHours, CompanyInfo, SiteSettingsPayload } from '../types';
import { databaseService,} from '../services/databaseService';

interface WebsiteStore extends WebsiteData {
  // Data Loading
  loadInitialData: () => Promise<void>;
  
  // Products
  updateProducts: (products: Product[]) => void;
  updateProduct: (id: string, data: Partial<Product>) => Promise<void>;
  addProduct: (product: Omit<Product, 'id'>) => Promise<void>;
  removeProduct: (id: string) => Promise<void>;
  
  // Product Categories
  updateProductCategories: (categories: ProductCategory[]) => void;
  addProductCategory: (category: Omit<ProductCategory, 'id'>) => Promise<void>;
  removeProductCategory: (id: string) => Promise<void>;
  
  // Footer
  updatePhoneNumbers: (numbers: PhoneNumber[]) => void;
  addPhoneNumber: (phone: Omit<PhoneNumber, 'id'>) => Promise<void>;
  updatePhoneNumber: (id: string, phone: PhoneNumber) => Promise<void>;
  deletePhoneNumber: (id: string) => Promise<void>;
  updateBusinessHours: (hours: BusinessHours) => Promise<void>;
  updateSocialMedia: (id: string, socialMedia: SocialMedia) => Promise<void>;

  updateCompanyInfo: (data: Partial<CompanyInfo>) => Promise<void>; 
  updateMapLocation: (newEmbedUrl: string) => Promise<void>; 

  addContactInfoItem: (itemData: Omit<ContactInfo, 'id'>) => Promise<void>;
  updateContactInfoItem: (id: string, itemData: Partial<ContactInfo>) => Promise<void>;
  deleteContactInfoItem: (id: string) => Promise<void>;

  updateMenuItem: (id: string, itemData: Partial<MenuItem>) => Promise<void>;
}

export const useWebsiteStore = create<WebsiteStore>((set) => ({
  // Initial state from WebsiteData interface
  contactInfo: [],
  menuItems: [],
  bannerSlides: [],
  companyInfo: {
    title: '',
    description: '',
    images: []
  },
  timelineEvents: [],
  productCategories: [],
  products: [],
  socialMedia: [],
  phoneNumbers: [],
  businessHours: [],
  mapLocation: { embedUrl: '' },
  logo: '',
  // Data Loading
  loadInitialData: async () => {
    try {
      const [
        products,
        categories,
        social,
        phones,
        hours,
        bannerSlides,
        menuItems,
        companyInfo,
        timelineEvents,
        siteSettings,
        contactInfoData,
      ] = await Promise.all([
        databaseService.getProducts(),
        databaseService.getProductCategories(),
        databaseService.getSocialMedia(),
        databaseService.getPhoneNumbers(),
        databaseService.getBusinessHours(),
        databaseService.getBannerSlides(),
        databaseService.getMenuItems(),
        databaseService.getCompanyInfo(),
        databaseService.getTimelineEvents(),
        databaseService.getSiteSettings(),
        databaseService.getContactInfo()
      ]);

      console.log('Datos recibidos de las APIs antes de setear en el store:', {
        products, categories, social, phones, hours,
        bannerSlides, menuItems, companyInfo, timelineEvents, siteSettings, contactInfoData 
      });
  
      set({
        products,
        productCategories: categories,
        socialMedia: social,
        phoneNumbers: phones,
        businessHours: hours ? [hours] : [], // Aseguramos que sea un array
        bannerSlides,
        menuItems,
        companyInfo: companyInfo ? { ...companyInfo, images: companyInfo.images || [] } : { title: '', description: '', images: [] },
        timelineEvents,
        mapLocation: siteSettings.mapLocation, // <--- ACTUALIZA EL ESTADO
        logo: siteSettings.logo,
        contactInfo: contactInfoData
      });
    } catch (error) {
      console.error('Error en loadInitialData del store:', error);

      set({
        contactInfo: [],
        mapLocation: { embedUrl: '' },
        logo: ''
      });
    }
  },
  
  // Products
  updateProducts: (products) => set({ products }),
  updateProduct: async (id, data) => {
    try {
      const updatedProduct = await databaseService.updateProduct(id, data as Product);
      set((state) => ({
        products: state.products.map((product) => 
          product.id === id ? updatedProduct : product
        ),
      }));
    } catch (error) {
      console.error('Error updating product:', error);
    }
  },
  addProduct: async (product) => {
    try {
      const newProduct = await databaseService.addProduct(product);
      set((state) => ({
        products: [...state.products, newProduct],
      }));
    } catch (error) {
      console.error('Error adding product:', error);
    }
  },
  removeProduct: async (id) => {
    try {
      await databaseService.deleteProduct(id);
      set((state) => ({
        products: state.products.filter((product) => product.id !== id),
      }));
    } catch (error) {
      console.error('Error removing product:', error);
    }
  },
  
  // Product Categories
  updateProductCategories: (productCategories) => set({ productCategories }),
  addProductCategory: async (category) => {
    try {
      const newCategory = await databaseService.addProductCategory(category);
      set((state) => ({
        productCategories: [...state.productCategories, newCategory],
      }));
    } catch (error) {
      console.error('Error adding product category:', error);
    }
  },
  removeProductCategory: async (id) => {
    try {
      await databaseService.deleteProductCategory(id);
      set((state) => ({
        productCategories: state.productCategories.filter((category) => category.id !== id),
      }));
    } catch (error) {
      console.error('Error removing product category:', error);
    }
  },
  
  // Footer
  updatePhoneNumbers: (phoneNumbers) => set({ phoneNumbers }),
  addPhoneNumber: async (phone) => {
    try {
      const newPhone = await databaseService.addPhoneNumber(phone);
      set((state) => ({
        phoneNumbers: [...state.phoneNumbers, newPhone],
      }));
    } catch (error) {
      console.error('Error adding phone number:', error);
    }
  },
  updatePhoneNumber: async (id, phone) => {
    try {
      const updatedPhone = await databaseService.updatePhoneNumber(id, phone);
      set((state) => ({
        phoneNumbers: state.phoneNumbers.map((p) => 
          p.id === id ? updatedPhone : p
        ),
      }));
    } catch (error) {
      console.error('Error updating phone number:', error);
    }
  },
  deletePhoneNumber: async (id) => {
    try {
      await databaseService.deletePhoneNumber(id);
      set((state) => ({
        phoneNumbers: state.phoneNumbers.filter((p) => p.id !== id),
      }));
    } catch (error) {
      console.error('Error deleting phone number:', error);
    }
  },
  updateBusinessHours: async (hours) => {
    try {
      const updatedHours = await databaseService.updateBusinessHours(hours);
      set({ businessHours: [updatedHours] });
    } catch (error) {
      console.error('Error updating business hours:', error);
    }
  },
  updateSocialMedia: async (id, socialMedia) => {
    try {
      const updatedSocialMedia = await databaseService.updateSocialMedia(id, socialMedia);
      set((state) => ({
        socialMedia: state.socialMedia.map((sm) => 
          sm.id === id ? updatedSocialMedia : sm
        ),
      }));
    } catch (error) {
      console.error('Error updating social media:', error);
    }
  },
  updateCompanyInfo: async (data: Partial<CompanyInfo>) => {
    try {
      // Llama al servicio para actualizar en el backend
      const updatedCompanyInfoFromDB = await databaseService.updateCompanyInfo(data);
      // Actualiza el estado en el store, asegurando que 'images' sea un array
      set({ 
        companyInfo: { 
          ...updatedCompanyInfoFromDB, 
          images: updatedCompanyInfoFromDB.images || [] 
        } 
      });
    } catch (error) {
      console.log('Tipo de databaseService.updateCompanyInfo:', typeof databaseService.updateCompanyInfo); 
      console.error('Error updating company info in store:', error);
      // Aquí podrías querer re-lanzar el error o manejarlo para mostrar un mensaje al usuario
    }
  },

    updateMapLocation: async (newEmbedUrl: string) => {
    try {
      const payload: SiteSettingsPayload = { mapLocation: { embedUrl: newEmbedUrl } };
      // Llama a la función de servicio que actualiza site-settings
      const updatedSiteSettings = await databaseService.updateSiteSettings(payload);
      // Actualiza solo mapLocation en el store con la respuesta del backend.
      set({ mapLocation: updatedSiteSettings.mapLocation }); 
      // Si también quisieras actualizar el logo general del sitio a través de esta acción, 
      // podrías añadir: logo: updatedSiteSettings.logo
    } catch (error) {
      console.error('Error updating map location in store:', error);
      throw error; // Re-lanzar el error para que el componente EditLocation pueda manejarlo
    }
  },
   addContactInfoItem: async (itemData) => {
    try {
      const newItem = await databaseService.addContactInfoItem(itemData);
      set((state) => ({ contactInfo: [...state.contactInfo, newItem] }));
    } catch (error) {
      console.error("Error adding contact info item to store:", error);
      throw error; // Re-lanzar para que el componente lo maneje
    }
  },

  updateContactInfoItem: async (id, itemData) => {
    try {
      const updatedItem = await databaseService.updateContactInfoItem(id, itemData);
      set((state) => ({
        contactInfo: state.contactInfo.map((item) =>
          item.id === id ? { ...item, ...updatedItem } : item 
        ),
      }));
    } catch (error) {
      console.error("Error updating contact info item in store:", error);
      throw error;
    }
  },

  deleteContactInfoItem: async (id) => {
    try {
      await databaseService.deleteContactInfoItem(id);
      set((state) => ({
        contactInfo: state.contactInfo.filter((item) => item.id !== id),
      }));
    } catch (error) {
      console.error("Error deleting contact info item from store:", error);
      throw error;
    }
  },

    updateMenuItem: async (id, itemData) => {
    try {
      const updatedItem = await databaseService.updateMenuItem(id, itemData);
      set((state) => ({
        menuItems: state.menuItems.map((item) =>
          item.id === id ? { ...item, ...updatedItem } : item
        ),
      }));
    } catch (error) {
      console.error("Error updating menu item in store:", error);
      throw error;
    }
  },
  
}));