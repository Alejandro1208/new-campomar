import { create } from "zustand";
// Eliminar esta importación ya que no se usa
// import { api } from '../services/api';
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
    SiteSettingsPayload,
} from "../types";
import { databaseService } from "../services/databaseService";

interface WebsiteStore extends WebsiteData {
    // Data Loading
    loadInitialData: () => Promise<void>;

    // Products
    updateProducts: (products: Product[]) => void;
    updateProduct: (id: string, data: Partial<Product>) => Promise<void>;
    addProduct: (product: Omit<Product, "id">) => Promise<void>;
    removeProduct: (id: string) => Promise<void>;

    // Product Categories
    updateProductCategories: (categories: ProductCategory[]) => void;
    addProductCategory: (
        category: Omit<ProductCategory, "id">
    ) => Promise<void>;
    removeProductCategory: (id: string) => Promise<void>;

    // Footer
    updatePhoneNumbers: (numbers: PhoneNumber[]) => void;
    addPhoneNumber: (phone: Omit<PhoneNumber, "id">) => Promise<void>;
    updatePhoneNumber: (id: string, phone: PhoneNumber) => Promise<void>;
    deletePhoneNumber: (id: string) => Promise<void>;
    updateBusinessHours: (hours: BusinessHours) => Promise<void>;
    updateSocialMedia: (id: string, socialMedia: SocialMedia) => Promise<void>;

    updateCompanyInfo: (data: Partial<CompanyInfo>) => Promise<void>;
    updateMapLocation: (newEmbedUrl: string) => Promise<void>;

    addContactInfoItem: (itemData: Omit<ContactInfo, "id">) => Promise<void>;
    updateContactInfoItem: (
        id: string,
        itemData: Partial<ContactInfo>
    ) => Promise<void>;
    deleteContactInfoItem: (id: string) => Promise<void>;

    updateMenuItem: (id: string, itemData: Partial<MenuItem>) => Promise<void>;

    addBannerSlide: (slideData: Omit<BannerSlide, "id">) => Promise<void>;
    updateBannerSlide: (
        id: string,
        slideData: Partial<BannerSlide>
    ) => Promise<void>;
    deleteBannerSlide: (id: string) => Promise<void>;

    updateSiteLogo: (file: File) => Promise<void>;

    addSocialMedia: (socialData: Omit<SocialMedia, "id">) => Promise<void>;
    deleteSocialMedia: (id: string) => Promise<void>;

    deleteBusinessHours: (id: string) => Promise<void>;

    updateSiteSettings: (
        data: SiteSettingsPayload & { logoFile?: File | null }
    ) => Promise<void>;

    // Nuevas propiedades para el estado
    footerShortDescription: string;
    footerCopyright: string;
}

export const useWebsiteStore = create<WebsiteStore>((set, get) => ({
    // Estado inicial
    contactInfo: [],
    menuItems: [],
    bannerSlides: [],
    companyInfo: {
        title: "",
        description: "",
        images: [],
    },
    timelineEvents: [],
    productCategories: [],
    products: [],
    socialMedia: [],
    phoneNumbers: [],
    businessHours: [],
    mapLocation: { embedUrl: "" },
    logo: "",
    footerShortDescription: "",
    footerCopyright: "",
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
                contactInfoData,
                siteSettingsData,
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
                databaseService.getContactInfo(),
                databaseService.getSiteSettings(),
            ]);

            console.log(
                "Store: loadInitialData - SiteSettingsData recibido:",
                siteSettingsData
            ); 
            set({
                products: products || [],
                productCategories: categories || [],
                socialMedia: social || [],
                phoneNumbers: phones || [],
                contactInfo: contactInfoData || [],
                businessHours: Array.isArray(hours) ? hours : (hours ? [hours] : []),
                bannerSlides: bannerSlides || [],
                menuItems: menuItems || [],
                companyInfo: companyInfo || { title: '', description: '', images: [] },
                timelineEvents: timelineEvents || [],
                mapLocation: siteSettingsData?.mapLocation || { embedUrl: "" },
                logo: siteSettingsData?.logo || "",
                footerShortDescription:
                    siteSettingsData?.footerShortDescription || "", // <--- ¡CORRECTO!
                footerCopyright: siteSettingsData?.footerCopyright || "", // <--- ACTUALIZA si lo tienes
            });
            console.log(
                "Store: loadInitialData - mapLocation en store:",
                get().mapLocation.embedUrl
            ); // <--- LOG
        } catch (error) {
            console.error("Error loading initial data:", error);
            set({
                mapLocation: { embedUrl: "" }, // Fallback
                logo: "", // Fallback
                footerShortDescription: "", // Fallback value
                footerCopyright: "", // Fallback value
            });
        }
    },

    // Products
    updateProducts: (products) => set({ products }),
    updateProduct: async (id, data) => {
        try {
            const updatedProduct = await databaseService.updateProduct(
                id,
                data as Product
            );
            set((state) => ({
                products: state.products.map((product) =>
                    product.id === id ? updatedProduct : product
                ),
            }));
        } catch (error) {
            console.error("Error updating product:", error);
        }
    },
    addProduct: async (product) => {
        try {
            const newProduct = await databaseService.addProduct(product);
            set((state) => ({
                products: [...state.products, newProduct],
            }));
        } catch (error) {
            console.error("Error adding product:", error);
        }
    },
    updateSiteSettings: async (data) => {
        // data es SiteSettingsPayload & { logoFile?: File | null }
        try {
            console.log("Store: updateSiteSettings - Datos recibidos:", data);
            let logoPathToSave =
                data.logo !== undefined ? data.logo : get().logo; // Usa el logo actual como base

            if (data.logoFile) {
                console.log(
                    "Store: updateSiteSettings - Subiendo nuevo logo..."
                );
                const uploadResponse = await databaseService.uploadSiteLogoFile(
                    data.logoFile
                );
                logoPathToSave = uploadResponse.filePath;
                console.log(
                    "Store: updateSiteSettings - Nuevo logo subido, ruta:",
                    logoPathToSave
                );
            }

            const finalPayload: SiteSettingsPayload = {
                mapLocation:
                    data.mapLocation !== undefined
                        ? data.mapLocation
                        : get().mapLocation,
                logo: logoPathToSave,
                footerShortDescription:
                    data.footerShortDescription !== undefined
                        ? data.footerShortDescription
                        : get().footerShortDescription,
                footerCopyright:
                    data.footerCopyright !== undefined
                        ? data.footerCopyright
                        : get().footerCopyright,
            };

            console.log(
                "Store: updateSiteSettings - Payload final enviado a databaseService:",
                finalPayload
            );
            const updatedSettings = await databaseService.updateSiteSettings(
                finalPayload
            );
            console.log(
                "Store: updateSiteSettings - Respuesta de databaseService:",
                updatedSettings
            );

            set({
                mapLocation: updatedSettings.mapLocation,
                logo: updatedSettings.logo,
                footerShortDescription:
                    updatedSettings.footerShortDescription || "",
                footerCopyright: updatedSettings.footerCopyright || "",
            });
        } catch (error) {
            console.error("Error en store updateSiteSettings:", error);
            throw error;
        }
    },
    removeProduct: async (id) => {
        try {
            await databaseService.deleteProduct(id);
            set((state) => ({
                products: state.products.filter((product) => product.id !== id),
            }));
        } catch (error) {
            console.error("Error removing product:", error);
        }
    },

    // Product Categories
    updateProductCategories: (productCategories) => set({ productCategories }),
    addProductCategory: async (category) => {
        try {
            const newCategory = await databaseService.addProductCategory(
                category
            );
            set((state) => ({
                productCategories: [...state.productCategories, newCategory],
            }));
        } catch (error) {
            console.error("Error adding product category:", error);
        }
    },
    removeProductCategory: async (id) => {
        try {
            await databaseService.deleteProductCategory(id);
            set((state) => ({
                productCategories: state.productCategories.filter(
                    (category) => category.id !== id
                ),
            }));
        } catch (error) {
            console.error("Error removing product category:", error);
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
            console.error("Error adding phone number:", error);
        }
    },
    updatePhoneNumber: async (id, phone) => {
        try {
            const updatedPhone = await databaseService.updatePhoneNumber(
                id,
                phone
            );
            set((state) => ({
                phoneNumbers: state.phoneNumbers.map((p) =>
                    p.id === id ? updatedPhone : p
                ),
            }));
        } catch (error) {
            console.error("Error updating phone number:", error);
        }
    },
    deletePhoneNumber: async (id) => {
        try {
            await databaseService.deletePhoneNumber(id);
            set((state) => ({
                phoneNumbers: state.phoneNumbers.filter((p) => p.id !== id),
            }));
        } catch (error) {
            console.error("Error deleting phone number:", error);
        }
    },
    updateBusinessHours: async (hours: BusinessHours) => {
        // 'hours' DEBE tener un ID válido aquí
        try {
            if (!hours.id) {
                // <--- AÑADE ESTA VERIFICACIÓN
                console.error(
                    "Error: El ID del horario de atención es undefined antes de llamar al servicio."
                );
                throw new Error("ID del horario de atención no definido.");
            }
            const updatedHours = await databaseService.updateBusinessHours(
                hours
            ); // El servicio espera hours.id
            // Si businessHours es un array en el store y quieres actualizar un elemento específico:
            set((state) => ({
                businessHours: state.businessHours.map((bh) =>
                    bh.id === updatedHours.id ? updatedHours : bh
                ),
            }));
            // Si businessHours es un solo objeto en el store (lo cual es menos común para "horarios"):
            // set({ businessHours: [updatedHours] }); // O simplemente { businessHours: updatedHours } si no es un array
        } catch (error) {
            console.error("Error updating business hours:", error);
            throw error; // Re-lanzar para que el componente lo maneje
        }
    },
    updateSocialMedia: async (id, socialMedia) => {
        try {
            const updatedSocialMedia = await databaseService.updateSocialMedia(
                id,
                socialMedia
            );
            set((state) => ({
                socialMedia: state.socialMedia.map((sm) =>
                    sm.id === id ? updatedSocialMedia : sm
                ),
            }));
        } catch (error) {
            console.error("Error updating social media:", error);
        }
    },
    updateCompanyInfo: async (data: Partial<CompanyInfo>) => {
        try {
            // Llama al servicio para actualizar en el backend
            const updatedCompanyInfoFromDB =
                await databaseService.updateCompanyInfo(data);
            // Actualiza el estado en el store, asegurando que 'images' sea un array
            set({
                companyInfo: {
                    ...updatedCompanyInfoFromDB,
                    images: updatedCompanyInfoFromDB.images || [],
                },
            });
        } catch (error) {
            console.log(
                "Tipo de databaseService.updateCompanyInfo:",
                typeof databaseService.updateCompanyInfo
            );
            console.error("Error updating company info in store:", error);
            // Aquí podrías querer re-lanzar el error o manejarlo para mostrar un mensaje al usuario
        }
    },

    updateMapLocation: async (newEmbedUrl: string) => {
        try {
            console.log(
                "Store: updateMapLocation - URL a enviar:",
                newEmbedUrl
            ); // <--- AÑADE LOG
            // IMPORTANTE: El payload aquí solo envía mapLocation.
            // Si tu backend espera un objeto SiteSettings completo y borra los campos no enviados,
            // podrías perder el logo u otros settings.
            // Una forma más segura es obtener todos los settings actuales, modificar mapLocation y enviar todo.
            // Sin embargo, si tu backend (PUT /api/site-settings) maneja bien actualizaciones parciales, está bien.

            const currentSettings = get(); // Obtener el estado actual
            const payload: SiteSettingsPayload = {
                mapLocation: { embedUrl: newEmbedUrl },
                logo: currentSettings.logo, // Preservar logo existente
                footerShortDescription: currentSettings.footerShortDescription, // Preservar
                footerCopyright: currentSettings.footerCopyright, // Preservar
            };

            console.log(
                "Store: updateMapLocation - Payload enviado a updateSiteSettings:",
                payload
            ); // <--- LOG
            const updatedSiteSettings =
                await databaseService.updateSiteSettings(payload); // Debe actualizar y devolver todos los settings

            console.log(
                "Store: updateMapLocation - Recibido de updateSiteSettings:",
                updatedSiteSettings
            ); // <--- LOG
            set({
                mapLocation: updatedSiteSettings.mapLocation,
                // Si el backend devuelve todos los settings, también actualiza los otros por si acaso:
                logo: updatedSiteSettings.logo,
                footerShortDescription:
                    updatedSiteSettings.footerShortDescription,
                footerCopyright: updatedSiteSettings.footerCopyright,
            });
        } catch (error) {
            console.error("Error updating map location in store:", error);
            throw error;
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
            const updatedItem = await databaseService.updateContactInfoItem(
                id,
                itemData
            );
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
            console.error(
                "Error deleting contact info item from store:",
                error
            );
            throw error;
        }
    },

    updateMenuItem: async (id, itemData) => {
        try {
            const updatedItem = await databaseService.updateMenuItem(
                id,
                itemData
            );
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
    addBannerSlide: async (slideData) => {
        try {
            const newSlide = await databaseService.addBannerSlide(slideData);
            set((state) => ({
                bannerSlides: [...state.bannerSlides, newSlide],
            }));
        } catch (error) {
            console.error("Error adding banner slide to store:", error);
            throw error;
        }
    },

    updateBannerSlide: async (id, slideData) => {
        try {
            const updatedSlide = await databaseService.updateBannerSlide(
                id,
                slideData
            );
            set((state) => ({
                bannerSlides: state.bannerSlides.map((slide) =>
                    slide.id === id ? { ...slide, ...updatedSlide } : slide
                ),
            }));
        } catch (error) {
            console.error("Error updating banner slide in store:", error);
            throw error;
        }
    },

    deleteBannerSlide: async (id) => {
        try {
            await databaseService.deleteBannerSlide(id);
            set((state) => ({
                bannerSlides: state.bannerSlides.filter(
                    (slide) => slide.id !== id
                ),
            }));
        } catch (error) {
            console.error("Error deleting banner slide from store:", error);
            throw error;
        }
    },

    updateSiteLogo: async (file: File) => {
        try {
            // 1. Subir el nuevo archivo de logo
            const uploadResponse = await databaseService.uploadSiteLogoFile(
                file
            );
            const newLogoPath = uploadResponse.filePath; // ej. /uploads/site_logo/logo-123.png

            // 2. Actualizar site_settings con la nueva ruta del logo
            //    También podrías querer obtener el mapLocation actual para no sobrescribirlo si no cambia.
            const currentMapLocation = get().mapLocation; // Obtiene el mapLocation actual del store

            const payload: SiteSettingsPayload = {
                mapLocation: currentMapLocation, // Mantenemos el mapLocation existente
                logo: newLogoPath,
            };
            const updatedSiteSettings =
                await databaseService.updateSiteSettings(payload);

            // 3. Actualizar el estado del store con la nueva URL del logo (y mapLocation por si acaso)
            set({
                logo: updatedSiteSettings.logo,
                mapLocation: updatedSiteSettings.mapLocation,
            });
        } catch (error) {
            console.error("Error updating site logo in store:", error);
            throw error; // Re-lanzar para que el componente UI pueda manejarlo
        }
    },

    addSocialMedia: async (socialData) => {
        const newSocial = await databaseService.addSocialMedia(socialData);
        set((state) => ({ socialMedia: [...state.socialMedia, newSocial] }));
    },
    deleteSocialMedia: async (id) => {
        await databaseService.deleteSocialMedia(id);
        set((state) => ({
            socialMedia: state.socialMedia.filter((social) => social.id !== id),
        }));
    },

    deleteBusinessHours: async (id: string) => {
        try {
            await databaseService.deleteBusinessHours(id);
            set((state) => ({
                businessHours: state.businessHours.filter(
                    (hours) => hours.id !== id
                ),
            }));
        } catch (error) {
            console.error("Error deleting business hours from store:", error);
            throw error;
        }
    },
}));
