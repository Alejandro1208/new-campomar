CREATE TABLE IF NOT EXISTS banner_slides (
  id VARCHAR(255) PRIMARY KEY,
  image VARCHAR(255),
  title VARCHAR(255),
  subtitle VARCHAR(255),
  cta_text VARCHAR(255) NULL,
  cta_url VARCHAR(255) NULL,
  cta_is_visible BOOLEAN DEFAULT FALSE
);

INSERT INTO banner_slides (id, image, title, subtitle, cta_text, cta_url, cta_is_visible) VALUES
('1', '/uploads/banner_images/default_banner1.jpg', 'Bienvenidos a Nuestra Empresa', 'Brindando Soluciones de Calidad', 'Conoce Más', '#about', TRUE),
('2', '/uploads/banner_images/default_banner2.jpg', 'Soluciones Innovadoras', 'Para Empresas Modernas', 'Ver Productos', '#products', TRUE),
('3', '/uploads/banner_images/default_banner3.jpg', 'Equipo Experto', 'Dedicados a Tu Éxito', NULL, NULL, FALSE)
ON CONFLICT (id) DO UPDATE SET
  image = EXCLUDED.image,
  title = EXCLUDED.title,
  subtitle = EXCLUDED.subtitle,
  cta_text = EXCLUDED.cta_text,
  cta_url = EXCLUDED.cta_url,
  cta_is_visible = EXCLUDED.cta_is_visible;