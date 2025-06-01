import { create } from 'zustand';
import {
  WebsiteData,
  ContactInfo,
  BannerSlide,
  MenuItem,
  TimelineEvent,
  Product,
  ProductCategory,
  PhoneNumber,
  SocialMedia,
  BusinessHours,
  CompanyInfo,
  MapLocation, // Asegúrate que esté en types/index.ts
  SiteSettingsPayload, // Importa desde types o databaseService (asegúrate que esté exportada)
  SiteSettingsResponse // O SiteSettingsData, como lo hayas llamado en types/index.ts
} from '../types';
import { databaseService } from '../services/databaseService'; // SiteSettingsPayload no se importa desde aquí si está en types

interface WebsiteStore extends WebsiteData {
  // Data Loading
  loadInitialData: () => Promise<void>;

  // Products
  // updateProducts: (products: Product[]) => void; // Usualmente no necesaria si el estado se actualiza por CRUD
  updateProduct: (id: string, data: Partial<Product>) => Promise<void>;
  addProduct: (productData: Omit<Product, 'id'>) => Promise<void>;
  removeProduct: (id: string) => Promise<void>;

  // Product Categories
  // updateProductCategories: (categories: ProductCategory[]) => void; // Similar a updateProducts
  addProductCategory: (categoryData: Omit<ProductCategory, 'id'>) => Promise<void>;
  updateProductCategory: (id: string, categoryData: Partial<ProductCategory>) => Promise<void>; // Acción para actualizar
  removeProductCategory: (id: string) => Promise<void>;

  // Contact Info (Topbar)
  addContactInfoItem: (itemData: Omit<ContactInfo, 'id'>) => Promise<void>;
  updateContactInfoItem: (id: string, itemData: Partial<ContactInfo>) => Promise<void>;
  deleteContactInfoItem: (id: string) => Promise<void>;

  // Menu Items
  updateMenuItem: (id: string, itemData: Partial<MenuItem>) => Promise<void>; // Solo texto

  // Banner Slides
  addBannerSlide: (slideData: Omit<BannerSlide, 'id' | 'image'> & { imageFile?: File | null }) => Promise<void>;
  updateBannerSlide: (id: string, slideData: Partial<Omit<BannerSlide, 'image'>> & { imageFile?: File | null }) => Promise<void>;
  deleteBannerSlide: (id: string) => Promise<void>;

  // Company Info
  updateCompanyInfo: (data: Partial<CompanyInfo>) => Promise<void>; // Ya la tienes

  // Site Settings (Map, Logo, Footer Texts)
  updateSiteSettings: (data: SiteSettingsPayload & { logoFile?: File | null }) => Promise<void>;
  // updateMapLocation y updateSiteLogo se pueden fusionar en updateSiteSettings

  // Social Media (Footer)
  addSocialMedia: (socialData: Omit<SocialMedia, 'id'>) => Promise<void>;
  updateSocialMedia: (id: string, socialData: Partial<SocialMedia>) => Promise<void>; // Ya la tienes
  deleteSocialMedia: (id: string) => Promise<void>;

  // Phone Numbers (Footer)
  addPhoneNumber: (phoneData: Omit<PhoneNumber, 'id'>) => Promise<void>; // Ya la tienes
  updatePhoneNumber: (id: string, phoneData: PhoneNumber) => Promise<void>; // Ya la tienes
  deletePhoneNumber: (id: string) => Promise<void>; // Ya la tienes

  // Business Hours (Footer)
  addBusinessHours: (hoursData: Omit<BusinessHours, 'id'>) => Promise<void>;
  updateBusinessHours: (id: string, hoursData: Partial<BusinessHours>) => Promise<void>; // Ya la tienes, firma ajustada
  deleteBusinessHours: (id: string) => Promise<void>;
  
  // Timeline Events (Si necesitas CRUD, añade aquí)
  // addTimelineEvent: ...
  // updateTimelineEvent: ...
  // deleteTimelineEvent: ...
}

export const useWebsiteStore = create<WebsiteStore>((set, get) => ({
  // Initial state
  contactInfo: [],
  menuItems: [],
  bannerSlides: [],
  companyInfo: { title: '', description: '', images: [] },
  timelineEvents: [],
  productCategories: [],
  products: [],
  socialMedia: [],
  phoneNumbers: [],
  businessHours: [], // Esto será un array
  mapLocation: { embedUrl: '' },
  logo: '',
  footerShortDescription: '',
  footerCopyright: '',

  // --- Data Loading ---
  loadInitialData: async () => {
    try {
      const [
        productsData, categoriesData, socialData, phonesData, hoursData,
        bannerSlidesData, menuItemsData, companyInfoData, timelineEventsData,
        siteSettingsData, contactInfoData,
      ] = await Promise.all([
        databaseService.getProducts(),
        databaseService.getProductCategories(),
        databaseService.getSocialMedia(),
        databaseService.getPhoneNumbers(),
        databaseService.getBusinessHours(), // Espera BusinessHours[]
        databaseService.getBannerSlides(),
        databaseService.getMenuItems(),
        databaseService.getCompanyInfo(),
        databaseService.getTimelineEvents(),
        databaseService.getSiteSettings(),
        databaseService.getContactInfo(),
      ]);

      console.log('Datos recibidos de las APIs:', { /* ... todos los datos ... */ });
  
      set({
        products: productsData || [],
        productCategories: categoriesData || [],
        socialMedia: socialData || [],
        phoneNumbers: phonesData || [],
        businessHours: hoursData || [], // hoursData ya es un array
        bannerSlides: bannerSlidesData || [],
        menuItems: menuItemsData || [],
        companyInfo: companyInfoData ? { ...companyInfoData, images: companyInfoData.images || [] } : { title: '', description: '', images: [] },
        timelineEvents: timelineEventsData || [],
        mapLocation: siteSettingsData?.mapLocation || { embedUrl: '' },
        logo: siteSettingsData?.logo || '',
        footerShortDescription: siteSettingsData?.footerShortDescription || '',
        footerCopyright: siteSettingsData?.footerCopyright || '',
        contactInfo: contactInfoData || [],
      });
    } catch (error) {
      console.error('Error en loadInitialData del store:', error);
      set({ // Estado por defecto en caso de error general
        products: [], productCategories: [], socialMedia: [], phoneNumbers: [],
        businessHours: [], bannerSlides: [], menuItems: [],
        companyInfo: { title: '', description: '', images: [] },
        timelineEvents: [], mapLocation: { embedUrl: '' }, logo: '',
        footerShortDescription: '', footerCopyright: '', contactInfo: [],
      });
    }
  },
  
  // --- Products ---
  addProduct: async (productData) => {
    const newProduct = await databaseService.addProduct(productData);
    set((state) => ({ products: [...state.products, newProduct] }));
  },
  updateProduct: async (id, data) => {
    const updatedProduct = await databaseService.updateProduct(id, data as Product); // Asumimos que 'data' es compatible
    set((state) => ({
      products: state.products.map((p) => (p.id === id ? { ...p, ...updatedProduct } : p)),
    }));
  },
  removeProduct: async (id) => {
    await databaseService.deleteProduct(id);
    set((state) => ({ products: state.products.filter((p) => p.id !== id) }));
  },

  // --- Product Categories ---
  addProductCategory: async (categoryData) => {
    const newCategory = await databaseService.addProductCategory(categoryData);
    set((state) => ({ productCategories: [...state.productCategories, newCategory] }));
  },
  updateProductCategory: async (id, categoryData) => {
    const updatedCategory = await databaseService.updateProductCategory(id, categoryData); // Necesitas esta función en el servicio
    set((state) => ({
      productCategories: state.productCategories.map(cat => cat.id === id ? {...cat, ...updatedCategory} : cat)
    }));
  },
  removeProductCategory: async (id) => {
    await databaseService.deleteProductCategory(id);
    set((state) => ({ productCategories: state.productCategories.filter((cat) => cat.id !== id)}));
  },
  
  // --- Contact Info (Topbar) ---
  addContactInfoItem: async (itemData) => {
    const newItem = await databaseService.addContactInfoItem(itemData);
    set((state) => ({ contactInfo: [...state.contactInfo, newItem] }));
  },
  updateContactInfoItem: async (id, itemData) => {
    const updatedItem = await databaseService.updateContactInfoItem(id, itemData);
    set((state) => ({
      contactInfo: state.contactInfo.map((item) => (item.id === id ? { ...item, ...updatedItem } : item)),
    }));
  },
  deleteContactInfoItem: async (id) => {
    await databaseService.deleteContactInfoItem(id);
    set((state) => ({ contactInfo: state.contactInfo.filter((item) => item.id !== id) }));
  },

  // --- Menu Items ---
  updateMenuItem: async (id, itemData) => { 
    const updatedItem = await databaseService.updateMenuItem(id, itemData);
    set((state) => ({
      menuItems: state.menuItems.map((item) => (item.id === id ? { ...item, ...updatedItem } : item)),
    }));
  },

  // --- Banner Slides ---
  addBannerSlide: async (slideData) => {
    let imagePath = '';
    if (slideData.imageFile) {
      const uploadResponse = await databaseService.uploadBannerImageFile(slideData.imageFile);
      imagePath = uploadResponse.filePath;
    }
    const finalSlideData = { ...slideData, image: imagePath };
    delete (finalSlideData as any).imageFile; // Limpiar el File object

    const newSlide = await databaseService.addBannerSlide(finalSlideData as Omit<BannerSlide, 'id'>);
    set((state) => ({ bannerSlides: [...state.bannerSlides, newSlide] }));
  },
  updateBannerSlide: async (id, slideData) => {
    let imagePath = slideData.image; // Usar la imagen existente si no se sube una nueva
    if (slideData.imageFile) {
      const uploadResponse = await databaseService.uploadBannerImageFile(slideData.imageFile);
      imagePath = uploadResponse.filePath;
    }
    const finalSlideData = { ...slideData, image: imagePath };
    delete (finalSlideData as any).imageFile;

    const updatedSlide = await databaseService.updateBannerSlide(id, finalSlideData as Partial<BannerSlide>);
    set((state) => ({
      bannerSlides: state.bannerSlides.map((s) => (s.id === id ? { ...s, ...updatedSlide } : s)),
    }));
  },
  deleteBannerSlide: async (id) => {
    // Opcional: Lógica para obtener la ruta de la imagen y pedir al backend que la borre del servidor
    await databaseService.deleteBannerSlide(id);
    set((state) => ({ bannerSlides: state.bannerSlides.filter((s) => s.id !== id) }));
  },
  
  // --- Company Info ---
  updateCompanyInfo: async (data) => {
    const updatedCompanyInfoFromDB = await databaseService.updateCompanyInfo(data);
    set({ 
      companyInfo: { 
        ...updatedCompanyInfoFromDB, 
        images: updatedCompanyInfoFromDB.images || [] 
      } 
    });
  },

  // --- Site Settings (Map, Logo, Footer Texts) ---
  // updateMapLocation y updateSiteLogo se fusionan en updateSiteSettings
  updateSiteSettings: async (data) => { // data: SiteSettingsPayload & { logoFile?: File | null }
    let logoPathToSave = data.logo || get().logo; // Usa el logo actual como base o el del payload

    if (data.logoFile) {
      const uploadResponse = await databaseService.uploadSiteLogoFile(data.logoFile);
      logoPathToSave = uploadResponse.filePath;
    }

    const finalPayload: SiteSettingsPayload = {
      mapLocation: data.mapLocation || get().mapLocation, // Preserva el mapLocation existente si no se envía uno nuevo
      logo: logoPathToSave,
      footerShortDescription: data.footerShortDescription,
      footerCopyright: data.footerCopyright,
    };
    
    const updatedSettings = await databaseService.updateSiteSettings(finalPayload);
    
    set({ 
      mapLocation: updatedSettings.mapLocation, 
      logo: updatedSettings.logo,
      footerShortDescription: updatedSettings.footerShortDescription || '',
      footerCopyright: updatedSettings.footerCopyright || ''
    });
  },
  // Mantener updateMapLocation y updateSiteLogo si los componentes las llaman así,
  // pero internamente pueden llamar a la lógica de updateSiteSettings.
  updateMapLocation: async (newEmbedUrl: string) => {
    const currentSettings = get();
    const payload: SiteSettingsPayload = { 
        mapLocation: { embedUrl: newEmbedUrl },
        logo: currentSettings.logo, // Preservar logo existente
        footerShortDescription: currentSettings.footerShortDescription, // Preservar
        footerCopyright: currentSettings.footerCopyright // Preservar
    };
    const updatedSettings = await databaseService.updateSiteSettings(payload);
    set({ mapLocation: updatedSettings.mapLocation, logo: updatedSettings.logo, footerShortDescription: updatedSettings.footerShortDescription, footerCopyright: updatedSettings.footerCopyright });
  },
  updateSiteLogo: async (file: File) => {
    const currentSettings = get();
    const uploadResponse = await databaseService.uploadSiteLogoFile(file);
    const newLogoPath = uploadResponse.filePath;
    const payload: SiteSettingsPayload = {
      mapLocation: currentSettings.mapLocation,
      logo: newLogoPath,
      footerShortDescription: currentSettings.footerShortDescription,
      footerCopyright: currentSettings.footerCopyright
    };
    const updatedSettings = await databaseService.updateSiteSettings(payload);
    set({ logo: updatedSettings.logo, mapLocation: updatedSettings.mapLocation, footerShortDescription: updatedSettings.footerShortDescription, footerCopyright: updatedSettings.footerCopyright });
  },

  // --- Social Media (Footer) ---
  addSocialMedia: async (socialData) => {
    const newSocial = await databaseService.addSocialMedia(socialData);
    set((state) => ({ socialMedia: [...state.socialMedia, newSocial] }));
  },
  deleteSocialMedia: async (id) => {
    await databaseService.deleteSocialMedia(id);
    set((state) => ({ socialMedia: state.socialMedia.filter((sm) => sm.id !== id) }));
  },
  // updateSocialMedia ya lo tenías

  // --- Phone Numbers (Footer) ---
  // addPhoneNumber, updatePhoneNumber, deletePhoneNumber ya los tenías

  // --- Business Hours (Footer) ---
  addBusinessHours: async (hoursData) => {
    const newHours = await databaseService.addBusinessHours(hoursData);
    set((state) => ({ businessHours: [...state.businessHours, newHours] }));
  },
  deleteBusinessHours: async (id) => {
    await databaseService.deleteBusinessHours(id);
    set((state) => ({ businessHours: state.businessHours.filter((bh) => bh.id !== id) }));
  },
  // updateBusinessHours ya lo tenías (con la firma ajustada)
}));