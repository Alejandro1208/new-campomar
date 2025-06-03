CREATE TABLE IF NOT EXISTS site_settings (
  id VARCHAR(255) PRIMARY KEY,
  map_embed_url TEXT,
  site_logo_url VARCHAR(255),
  footer_short_description TEXT, -- <--- COLUMNA AÑADIDA
  footer_copyright VARCHAR(255)    -- <--- COLUMNA AÑADIDA
);

-- Insertar datos iniciales, incluyendo los nuevos campos.
-- Puedes cambiar los valores por defecto si lo deseas.
INSERT INTO site_settings (id, map_embed_url, site_logo_url, footer_short_description, footer_copyright) 
VALUES (
    'default', 
    'https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d26273.86913422805!2d-58.45367799999999!3d-34.598253!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95bcca078f361f85%3A0x98e4fc30e0e452e2!2sEncendido%20Campomar!5e0!3m2!1ses!2sar!4v1748921156097!5m2!1ses!2sar', -- URL de mapa por defecto
    '/logo.png',             -- Ruta a un logo por defecto o string vacío ''
    'Venta por mayor de productos de encendido y electricidad para el mercado automotor en todo el país', -- Valor por defecto
    'Distribuidora Campomar - Todos los Derechos Reservados.'   -- Valor por defecto
) 
ON CONFLICT (id) DO UPDATE SET 
    map_embed_url = EXCLUDED.map_embed_url,
    site_logo_url = EXCLUDED.site_logo_url,
    footer_short_description = EXCLUDED.footer_short_description,
    footer_copyright = EXCLUDED.footer_copyright;