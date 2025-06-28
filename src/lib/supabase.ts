import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Faltan las variables de entorno de Supabase');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Tipos de la base de datos
export interface Category {
  id: string;
  name: string;
  created_at: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  logo_image_url: string;
  category_id: string | null;
  created_at: string;
  category?: Category;
}

export interface Banner {
  id: string;
  image_url: string;
  alt_text: string;
  order_index: number;
  created_at: string;
}

export interface TimelineEvent {
  id: string;
  year: number;
  title: string;
  order_index: number;
  created_at: string;
}

export interface SiteSetting {
  key: string;
  value: string;
  created_at: string;
}