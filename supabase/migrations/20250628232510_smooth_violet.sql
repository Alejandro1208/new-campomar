/*
  # Complete CAMPOMAR Database Schema

  1. New Tables
    - `categories` - Product categories for filtering
    - `products` - Company products/brands with logos
    - `banners` - Hero carousel images
    - `timeline_events` - Company history milestones
    - `site_settings` - Key-value pairs for site configuration

  2. Security
    - Enable RLS on all tables
    - Add public read policies for website content
    - Add admin policies for authenticated users

  3. Sample Data
    - Default site settings with company information
    - Sample banners for hero carousel
    - Timeline events showing company history
    - Sample categories and products
*/

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create products table with foreign key to categories
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text DEFAULT '',
  logo_image_url text NOT NULL,
  category_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now()
);

-- Create site_settings table
CREATE TABLE IF NOT EXISTS site_settings (
  key text PRIMARY KEY,
  value text NOT NULL DEFAULT '',
  created_at timestamptz DEFAULT now()
);

-- Create banners table
CREATE TABLE IF NOT EXISTS banners (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url text NOT NULL,
  alt_text text NOT NULL DEFAULT '',
  order_index integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create timeline_events table
CREATE TABLE IF NOT EXISTS timeline_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  year integer NOT NULL,
  title text NOT NULL,
  order_index integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE timeline_events ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access (since this is a public website)
CREATE POLICY "Allow public read access to categories"
  ON categories
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public read access to products"
  ON products
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public read access to site_settings"
  ON site_settings
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public read access to banners"
  ON banners
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public read access to timeline_events"
  ON timeline_events
  FOR SELECT
  TO public
  USING (true);

-- Create policies for authenticated users (admin access)
CREATE POLICY "Allow authenticated users full access to categories"
  ON categories
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users full access to products"
  ON products
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users full access to site_settings"
  ON site_settings
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users full access to banners"
  ON banners
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users full access to timeline_events"
  ON timeline_events
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Insert default site settings
INSERT INTO site_settings (key, value) VALUES
  ('company_description', 'Somos una empresa líder en el mercado, comprometida con la excelencia y la innovación. Con más de 20 años de experiencia, ofrecemos productos y servicios de la más alta calidad para satisfacer las necesidades de nuestros clientes.'),
  ('topbar_phone', '+1 (555) 123-4567'),
  ('topbar_email', 'info@campomar.com'),
  ('topbar_address', '123 Business Ave, Ciudad, País'),
  ('topbar_schedule', 'Lun - Vie: 8:00 AM - 6:00 PM'),
  ('footer_schedule', 'Lunes a Viernes: 8:00 AM - 6:00 PM\nSábados: 9:00 AM - 2:00 PM'),
  ('whatsapp_phone', '+1 (555) 123-4567'),
  ('facebook_url', 'https://facebook.com/campomar'),
  ('instagram_url', 'https://instagram.com/campomar'),
  ('maps_iframe_url', 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.9663095343008!2d-74.00425878459418!3d40.74844097932681!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c259bf5c1654f3%3A0xc80f9cfce5383d5d!2sGoogle!5e0!3m2!1sen!2sus!4v1635959592521!5m2!1sen!2sus')
ON CONFLICT (key) DO NOTHING;

-- Insert sample categories
INSERT INTO categories (name) VALUES
  ('Tecnología'),
  ('Alimentación'),
  ('Construcción'),
  ('Automotriz'),
  ('Textil')
ON CONFLICT DO NOTHING;

-- Insert sample banners
INSERT INTO banners (image_url, alt_text, order_index) VALUES
  ('https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=1200', 'Banner principal de CAMPOMAR', 1),
  ('https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=1200', 'Productos de calidad CAMPOMAR', 2),
  ('https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=1200', 'Innovación y tecnología CAMPOMAR', 3);

-- Insert sample timeline events
INSERT INTO timeline_events (year, title, order_index) VALUES
  (2004, 'Fundación de la empresa', 1),
  (2008, 'Expansión a nuevos mercados', 2),
  (2012, 'Lanzamiento de productos innovadores', 3),
  (2016, 'Certificación de calidad internacional', 4),
  (2020, 'Transformación digital completa', 5),
  (2024, 'Liderazgo en sostenibilidad', 6);

-- Insert sample products (using category IDs from the inserted categories)
INSERT INTO products (name, description, logo_image_url, category_id) 
SELECT 
  'Samsung',
  'Líder mundial en tecnología y electrónicos',
  'https://images.pexels.com/photos/404280/pexels-photo-404280.jpeg?auto=compress&cs=tinysrgb&w=300',
  c.id
FROM categories c WHERE c.name = 'Tecnología'
UNION ALL
SELECT 
  'Coca-Cola',
  'La bebida refrescante más popular del mundo',
  'https://images.pexels.com/photos/50593/coca-cola-cold-drink-soft-drink-coke-50593.jpeg?auto=compress&cs=tinysrgb&w=300',
  c.id
FROM categories c WHERE c.name = 'Alimentación'
UNION ALL
SELECT 
  'Caterpillar',
  'Maquinaria pesada y equipos de construcción',
  'https://images.pexels.com/photos/1078884/pexels-photo-1078884.jpeg?auto=compress&cs=tinysrgb&w=300',
  c.id
FROM categories c WHERE c.name = 'Construcción'
UNION ALL
SELECT 
  'Toyota',
  'Vehículos confiables y eficientes',
  'https://images.pexels.com/photos/116675/pexels-photo-116675.jpeg?auto=compress&cs=tinysrgb&w=300',
  c.id
FROM categories c WHERE c.name = 'Automotriz'
UNION ALL
SELECT 
  'Nike',
  'Ropa deportiva y calzado de alta calidad',
  'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=300',
  c.id
FROM categories c WHERE c.name = 'Textil'
UNION ALL
SELECT 
  'Apple',
  'Innovación en tecnología y diseño',
  'https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg?auto=compress&cs=tinysrgb&w=300',
  c.id
FROM categories c WHERE c.name = 'Tecnología'
UNION ALL
SELECT 
  'Nestlé',
  'Productos alimenticios de confianza mundial',
  'https://images.pexels.com/photos/4109743/pexels-photo-4109743.jpeg?auto=compress&cs=tinysrgb&w=300',
  c.id
FROM categories c WHERE c.name = 'Alimentación'
UNION ALL
SELECT 
  'Ford',
  'Tradición automotriz americana',
  'https://images.pexels.com/photos/909907/pexels-photo-909907.jpeg?auto=compress&cs=tinysrgb&w=300',
  c.id
FROM categories c WHERE c.name = 'Automotriz';