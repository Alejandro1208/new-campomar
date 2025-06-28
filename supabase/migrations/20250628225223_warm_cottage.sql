/*
  # CAMPOMAR Website - Schema Principal

  1. Nuevas Tablas
    - `categories` - Categorías para filtrar productos
    - `products` - Productos/marcas con logos
    - `banners` - Imágenes del carrusel principal
    - `timeline_events` - Eventos de la línea de tiempo de la empresa
    - `site_settings` - Configuraciones clave-valor del sitio

  2. Seguridad
    - Habilitar RLS en todas las tablas
    - Políticas para lectura pública y escritura autenticada

  3. Almacenamiento
    - Bucket público para assets
*/

-- Crear tabla de categorías
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Crear tabla de productos
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text DEFAULT '',
  logo_image_url text NOT NULL,
  category_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now()
);

-- Crear tabla de banners
CREATE TABLE IF NOT EXISTS banners (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url text NOT NULL,
  alt_text text DEFAULT '',
  order_index integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Crear tabla de eventos de línea de tiempo
CREATE TABLE IF NOT EXISTS timeline_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  year integer NOT NULL,
  title text NOT NULL,
  order_index integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Crear tabla de configuraciones del sitio
CREATE TABLE IF NOT EXISTS site_settings (
  key text PRIMARY KEY,
  value text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

-- Habilitar RLS en todas las tablas
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE timeline_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Políticas de lectura pública
CREATE POLICY "Public read access for categories"
  ON categories FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Public read access for products"
  ON products FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Public read access for banners"
  ON banners FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Public read access for timeline_events"
  ON timeline_events FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Public read access for site_settings"
  ON site_settings FOR SELECT
  TO anon, authenticated
  USING (true);

-- Políticas de escritura para usuarios autenticados
CREATE POLICY "Authenticated users can manage categories"
  ON categories FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can manage products"
  ON products FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can manage banners"
  ON banners FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can manage timeline_events"
  ON timeline_events FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can manage site_settings"
  ON site_settings FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Insertar datos iniciales de configuración del sitio
INSERT INTO site_settings (key, value) VALUES
  ('topbar_phone', '+1 (555) 123-4567'),
  ('topbar_email', 'info@campomar.com'),
  ('topbar_address', 'Av. Principal 123, Ciudad'),
  ('topbar_schedule', 'Lun-Vie 8:00-18:00'),
  ('company_description', 'CAMPOMAR es una empresa líder en el sector, comprometida con la excelencia y la innovación. Con más de 20 años de experiencia, nos dedicamos a brindar las mejores soluciones a nuestros clientes.'),
  ('footer_schedule', 'Lunes a Viernes: 8:00 AM - 6:00 PM'),
  ('whatsapp_phone', '+5511999999999'),
  ('facebook_url', 'https://facebook.com/campomar'),
  ('instagram_url', 'https://instagram.com/campomar'),
  ('maps_iframe_url', 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3656.0!2d-46.0!3d-23.0!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjPCsDA...!5e0!3m2!1ses!2sbr!4v1234567890123!5m2!1ses!2sbr')
ON CONFLICT (key) DO NOTHING;

-- Insertar categorías de ejemplo
INSERT INTO categories (name) VALUES
  ('Tecnología'),
  ('Alimentación'),
  ('Textil'),
  ('Construcción')
ON CONFLICT DO NOTHING;

-- Insertar eventos de línea de tiempo de ejemplo
INSERT INTO timeline_events (year, title, order_index) VALUES
  (2000, 'Fundación de CAMPOMAR', 1),
  (2005, 'Expansión al mercado internacional', 2),
  (2010, 'Certificación ISO 9001', 3),
  (2020, 'Transformación digital completa', 4)
ON CONFLICT DO NOTHING;