/*
  # Create missing database tables and relationships

  1. New Tables
    - `site_settings` - Store site configuration values
    - `banners` - Store hero banner images and content
    - `timeline_events` - Store company history timeline events
    - Update `products` table to add foreign key relationship with `categories`

  2. Security
    - Enable RLS on all new tables
    - Add policies for public read access (since this is a public website)

  3. Sample Data
    - Insert default site settings
    - Add sample banners and timeline events
*/

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

-- Add foreign key relationship between products and categories if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'products_category_id_fkey' 
    AND table_name = 'products'
  ) THEN
    ALTER TABLE products 
    ADD CONSTRAINT products_category_id_fkey 
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL;
  END IF;
END $$;

-- Enable RLS on all tables
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE timeline_events ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access (since this is a public website)
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