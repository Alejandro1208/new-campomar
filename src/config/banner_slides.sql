CREATE TABLE IF NOT EXISTS banner_slides (
id VARCHAR(255) PRIMARY KEY,
image VARCHAR(255),
title VARCHAR(255),
subtitle VARCHAR(255)
);

INSERT INTO banner_slides (id, image, title, subtitle) VALUES
('1', 'https://images.pexels.com/photos/3183197/pexels-photo-3183197.jpeg', 'Bienvenidos a Nuestra Empresa', 'Brindando Soluciones de Calidad desde 2000'),
('2', 'https://images.pexels.com/photos/3182812/pexels-photo-3182812.jpeg', 'Soluciones Innovadoras', 'Para Empresas Modernas'),
('3', 'https://images.pexels.com/photos/3182774/pexels-photo-3182774.jpeg', 'Equipo Experto', 'Dedicados a Tu Éxito'),
('4', 'https://images.pexels.com/photos/3182781/pexels-photo-3182781.jpeg', 'Productos de Calidad', 'De los Mejores Fabricantes'),
('5', 'https://images.pexels.com/photos/3182812/pexels-photo-3182812.jpeg', 'Satisfacción del Cliente', 'Nuestra Prioridad');