CREATE TABLE IF NOT EXISTS timeline_events (
id VARCHAR(255) PRIMARY KEY,
year VARCHAR(255),
title VARCHAR(255),
description TEXT
);

INSERT INTO timeline_events (id, year, title, description) VALUES
('1', '1957', '1ra Generacion', 'Comenzamos nuestro viaje con la visión de ofrecer los mejores productos y servicios.'),
('2', '1987', '2da Generacion', 'Ampliamos nuestra línea de productos y abrimos nuestra primera oficina regional.'),
('3', '2008', '3ra Generacion', 'Nuestros productos llegaron a mercados internacionales y obtuvieron reconocimiento global.'),
('4', '2024', 'Actualidad', 'Establecimos nuestro centro de innovación para desarrollar nuevas soluciones de vanguardia.');