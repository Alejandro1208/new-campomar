-- Crear tablas
CREATE TABLE IF NOT EXISTS product_categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  logo VARCHAR(255) NOT NULL,
  description TEXT,
  category_id INTEGER REFERENCES product_categories(id)
);

CREATE TABLE IF NOT EXISTS social_media (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  url VARCHAR(255) NOT NULL,
  icon VARCHAR(50) NOT NULL
);

CREATE TABLE IF NOT EXISTS phone_numbers (
  id SERIAL PRIMARY KEY,
  number VARCHAR(20) NOT NULL,
  label VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS business_hours (
  id SERIAL PRIMARY KEY,
  days VARCHAR(100) NOT NULL,
  hours VARCHAR(100) NOT NULL
);

-- Insertar datos iniciales
INSERT INTO product_categories (name) VALUES
  ('Sin categoría'),
  ('Categoría 1'),
  ('Categoría 2')
ON CONFLICT DO NOTHING;

INSERT INTO social_media (name, url, icon) VALUES
  ('Facebook', 'https://facebook.com/tuempresa', 'facebook'),
  ('Instagram', 'https://instagram.com/tuempresa', 'instagram')
ON CONFLICT DO NOTHING;

INSERT INTO business_hours (days, hours) VALUES
  ('Lunes a Viernes', '9:00 - 18:00')
ON CONFLICT DO NOTHING;