CREATE TABLE IF NOT EXISTS products (
  id VARCHAR(255) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  logo VARCHAR(255),
  category_id VARCHAR(255) REFERENCES product_categories(id) -- Asegúrate que product_categories.sql se ejecute ANTES
);

INSERT INTO products (id, name, description, logo, category_id) VALUES
('1', 'Producto 1', 'Descripción del Producto 1', 'https://via.placeholder.com/150x150.png?text=Logo+1', '2'),
('2', 'Producto 2', 'Descripción del Producto 2', 'https://via.placeholder.com/150x150.png?text=Logo+2', '2'),
('3', 'Producto 3', 'Descripción del Producto 3', 'https://via.placeholder.com/150x150.png?text=Logo+3', '3'),
('4', 'Producto 4', 'Descripción del Producto 4', 'https://via.placeholder.com/150x150.png?text=Logo+4', '3'),
('5', 'Producto 5', 'Descripción del Producto 5', 'https://via.placeholder.com/150x150.png?text=Logo+5', '4'),
('6', 'Producto 6', 'Descripción del Producto 6', 'https://via.placeholder.com/150x150.png?text=Logo+6', '4'),
('7', 'Producto 7', 'Descripción del Producto 7', 'https://via.placeholder.com/150x150.png?text=Logo+7', '5'),
('8', 'Producto 8', 'Descripción del Producto 8', 'https://via.placeholder.com/150x150.png?text=Logo+8', '5'),
('9', 'Producto 9', 'Descripción del Producto 9', 'https://via.placeholder.com/150x150.png?text=Logo+9', '6'),
('10', 'Producto 10', 'Descripción del Producto 10', 'https://via.placeholder.com/150x150.png?text=Logo+10', '6');