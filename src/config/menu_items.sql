CREATE TABLE IF NOT EXISTS menu_items (
id VARCHAR(255) PRIMARY KEY,
text VARCHAR(255),
url VARCHAR(255)
);

INSERT INTO menu_items (id, text, url) VALUES
('1', 'Inicio', '#home'),
('2', 'La empresa', '#about'),
('3', 'Historia', '#timeline'),
('4', 'Productos', '#products'),
('5', 'Ubicación', '#location'),
('6', 'Contacto', '#footer');
