CREATE TABLE IF NOT EXISTS timeline_events (
id VARCHAR(255) PRIMARY KEY,
year VARCHAR(255),
title VARCHAR(255),
description TEXT
);

INSERT INTO timeline_events (id, year, title, description) VALUES
('1', '2000', 'Fundación', 'Comenzamos nuestro viaje con la visión de ofrecer los mejores productos y servicios.'),
('2', '2005', 'Expansión', 'Ampliamos nuestra línea de productos y abrimos nuestra primera oficina regional.'),
('3', '2010', 'Alcance Internacional', 'Nuestros productos llegaron a mercados internacionales y obtuvieron reconocimiento global.'),
('4', '2020', 'Centro de Innovación', 'Establecimos nuestro centro de innovación para desarrollar nuevas soluciones de vanguardia.');