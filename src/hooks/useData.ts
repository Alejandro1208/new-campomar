// src/hooks/useData.ts (Versión Final para la página de inicio)

import { useState, useEffect } from 'react';
import { Category, Product, Banner, TimelineEvent } from '../lib/supabase';
import { ContactPhone } from '../lib/supabase'

const BASE_API_URL = 'https://alejandrosabater.com.ar/api';

// --- HOOK PARA CATEGORÍAS ---
export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${BASE_API_URL}/getCategorias.php`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data: Category[] = await response.json();
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return { categories, loading, refetch: fetchCategories };
}

// --- HOOK PARA PRODUCTOS ---
export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${BASE_API_URL}/getProductos.php`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data: Product[] = await response.json();
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return { products, loading, refetch: fetchProducts };
}

// --- HOOK PARA CONFIGURACIONES ---
export function useSiteSettings() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${BASE_API_URL}/getSiteSettings.php`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data: Record<string, string> = await response.json();
      setSettings(data || {});
    } catch (error) {
      console.error('Error fetching site settings:', error);
      setSettings({});
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return { settings, loading, refetch: fetchSettings };
}

// --- HOOK PARA BANNERS (AHORA CONECTADO) ---
export function useBanners() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBanners = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${BASE_API_URL}/getBanners.php`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data: Banner[] = await response.json();
      setBanners(data || []);
    } catch (error) {
      console.error('Error fetching banners:', error);
      setBanners([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  return { banners, loading, refetch: fetchBanners };
}

// --- HOOK PARA LÍNEA DE TIEMPO (AHORA CONECTADO) ---
export function useTimelineEvents() {
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${BASE_API_URL}/getTimelineEvents.php`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data: TimelineEvent[] = await response.json();
      setEvents(data || []);
    } catch (error) {
      console.error('Error fetching timeline events:', error);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return { events, loading, refetch: fetchEvents };
}

// Añadir esta función al final de src/hooks/useData.ts
// Reemplaza la función en src/hooks/useData.ts
export function useContactPhones() {
  const [phones, setPhones] = useState<ContactPhone[]>([]); // Usamos la nueva interfaz
  const [loading, setLoading] = useState(true);

  const fetchPhones = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${BASE_API_URL}/getContactPhones.php`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data: ContactPhone[] = await response.json(); // Usamos la nueva interfaz
      setPhones(data || []);
    } catch (error) {
      console.error('Error fetching contact phones:', error);
      setPhones([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPhones();
  }, []);

  return { phones, loading, refetch: fetchPhones };
}

export function useCompanyImages() {
  const [images, setImages] = useState<Banner[]>([]); // Reutilizamos la interfaz Banner
  const [loading, setLoading] = useState(true);

  const fetchImages = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${BASE_API_URL}/getCompanyImages.php`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setImages(data || []);
    } catch (error) {
      console.error('Error fetching company images:', error);
      setImages([]);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { fetchImages(); }, []);
  return { images, loading, refetch: fetchImages };
}

// Añadir esta función al final de src/hooks/useData.ts
export function useDashboardStats() {
  const [stats, setStats] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${BASE_API_URL}/getDashboardStats.php`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setStats(data || {});
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      setStats({});
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return { stats, loading, refetch: fetchStats };
}