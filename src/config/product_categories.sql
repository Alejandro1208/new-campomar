CREATE TABLE IF NOT EXISTS product_categories (
id VARCHAR(255) PRIMARY KEY,
name VARCHAR(255)
);

INSERT INTO product_categories (id, name) VALUES
('1', 'Todos'),
('2', 'Encendido'),
('3', 'Electricidad'),
('4', 'Inyección'),
('5', 'Iluminacion'),
('6', 'Accesorios'),
('7', 'Mecanica');