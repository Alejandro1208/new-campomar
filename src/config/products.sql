-- Archivo: src/config/products.sql

CREATE TABLE IF NOT EXISTS products (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    logo VARCHAR(255), -- Ruta al logo del producto/marca
    category_id VARCHAR(255),
    FOREIGN KEY (category_id) REFERENCES product_categories(id) ON DELETE SET NULL
);

TRUNCATE TABLE products RESTART IDENTITY CASCADE; 

-- Productos convertidos del HTML, usando IDs numéricos como strings
INSERT INTO products (id, name, logo, description, category_id) VALUES
('1', 'Acceplastic', '/img/productos/acceplastic.jpeg', 'Faros - Lentes - Plafones - Portalámparas', '6'), -- Accesorios (o '5' Iluminacion)
('2', 'Accesorios Importados', '/img/productos/Accesorios Importados.jpeg', 'Accesorios importados - Polarizados - Faros auxiliares universales - Varios', '6'),
('3', 'Alfa', '/img/productos/Alfa.png', 'Conmutadores de luces y limpiaparabrisas - Contactores de arranque - Plaquetas de giro', '2'),
('4', 'Argelite', '/img/productos/Argelite.jpeg', 'Cables para bujías - Bobinas de ignición', '3'),
('5', 'B52', '/img/productos/b52.jpeg', 'Alarmas - Car audio - Parlantes y woofer', '6'),
('6', 'Baiml', '/img/productos/Baiml.png', 'Faros - Lentes - Fichas - Portalámparas', '5'),
('7', 'Byc', '/img/productos/Byc.png', 'Bujes', '7'),
('8', 'Campos 1441', '/img/productos/Campos 1441.png', 'Campos de arranque y dinamo', '3'),
('9', 'Champion', '/img/productos/Champion.png', 'Bujías de nafta, incandescentes y jardín', '2'),
('10', 'Damat', '/img/productos/Damat.png', 'Spaghetti termocontraible', '6'),
('11', 'Delco Remy', '/img/productos/Delco Remy.png', 'Arranque - Alternadores - Despiece de arranque - Despiece de alternador', '3'),
('12', 'Denso', '/img/productos/Denso.png', 'Bujías de nafta estándar e iridium - Alternadores - Arranques', '3'),
('13', 'Dipra', '/img/productos/Dipra.png', 'Despiece de arranque - Despiece de limpiaparabrisas - Despiece de alternador', '7'), -- o '3' Electricidad
('14', 'Dml', '/img/productos/Dml.png', 'Discos para tacógrafo', '6'),
('15', 'Doc', '/img/productos/Doc.png', 'Cinturones de seguridad', '6'),
('16', 'Dog', '/img/productos/Dog.png', 'Llaves de contacto y arranque', '2'),
('17', 'Dolz', '/img/productos/Dolz.png', 'Bombas de agua y contracuerpo', '7'),
('18', 'Duracell', '/img/productos/Duracell.png', 'Baterías', '3'),
('19', 'Dze', '/img/productos/Dze.png', 'Destelladores - Platinos - Relays - Temporizadores', '3'),
('20', 'Ele-ese', '/img/productos/Ele-ese.png', 'Distribuidor electrónico', '2'),
-- ... y así sucesivamente para el resto de los productos, incrementando el ID numérico.
-- Asegúrate de que el category_id coincida con los IDs de tu tabla product_categories.
('21', 'Elod', '/img/productos/Elod.png', 'Llaves de tecla y accesorios', '3'),
('22', 'Esebe', '/img/productos/Esebe.png', 'Estaño', '6'),
('23', 'Fb', '/img/productos/Fb.png', 'Espejos - Soportes de espejo - Tapas de tanque de nafta', '6'),
('24', 'Fiamm', '/img/productos/Fiamm.png', 'Bocinas', '6'),
('25', 'Gates', '/img/productos/Gates.jpeg', 'Correas - Kits de correas y tensor', '7'),
('26', 'Genrod', '/img/productos/Genrod.png', 'Fusibles, portafusibles y fusibleras', '3'),
('27', 'Genoud', '/img/productos/Genoud.png', 'Cables para bujías - Despiece de distribuidor - Escobillas', '2'),
('28', 'Geny', '/img/productos/Geny.png', 'Bulbos - Interruptores - Llaves - Termostatos', '7'),
('29', 'Gv', '/img/productos/Gv.png', 'Carbones y portacarbones - Diodos y colectores de alternador', '3'),
('30', 'Indumag', '/img/productos/Indumag.png', 'Bobinas secas y en aceite - Módulos de ignición - Bombas Lavaparabrisas', '2'),
('31', 'JR', '/img/productos/JR.png', 'Clips y prensas para baterías', '3'),
('32', 'Kobla', '/img/productos/Kobla.png', 'Bombas Diesel y nafta', '7'),
('33', 'Lc', '/img/productos/Lc.png', 'Solenoides de arranque, pare de motor - Bomba hidráulica y auxiliares', '3'),
('34', 'Loctite', '/img/productos/Loctite.png', 'Productos químicos', '6'),
('35', 'Magneti Marelli', '/img/productos/Magneti Marelli.png', 'Alternadores - Lamparas - Distribuidor electrónico - Arranques - Bujías incandescentes', '2'),
('36', 'Md', '/img/productos/Md.png', 'Bulbos - Instrumentales - Interruptores - Sensores de inyección electronica', '4'), -- Inyección (o '7' Mecanica, '6' Accesorios)
('37', 'Mirba', '/img/productos/Mirba.png', 'Relays - Llaves varias', '3'),
('38', 'Moura', '/img/productos/Moura.png', 'Baterías', '3'),
('39', 'Nap', '/img/productos/Nap.png', 'Depósitos recuperadores de agua - Tapas varias', '6'),
('40', 'Nosso', '/img/productos/Nosso.png', 'Cortacorrientes - Inyectores - Motores paso a paso - Plaquetas portadiodos - Reguladores de voltaje', '4'), -- Inyección (o '3' Electricidad)
('41', 'Ntn', '/img/productos/Ntn.png', 'Rulemanes', '7'), -- Mecanica (o '3' Electricidad)
('42', 'Omer', '/img/productos/Omer.png', 'Electroventiladores - Paletas de electroventilador - Resistencias', '3'),
('43', 'Orlan Rober', '/img/productos/Orlan Rober.png', 'Instrumentales - Escobillas', '6'),
('44', 'Oro', '/img/productos/Oro.png', 'Fichas y portafusibles - Portalámparas - Fusibles - Instalaciones eléctricas', '3'),
('45', 'Philips', '/img/productos/Philips.png', 'Lamparas', '5'), -- Iluminacion (o '6' Accesorios)
('46', 'Picborg', '/img/productos/Picborg.png', 'Filtros de combustibles', '7'),
('47', 'Plastitrebol', '/img/productos/Plastitrebol.jpeg', 'Cintas de encintar - Spaghetti - Corrugados - Caños cristal', '3'),
('48', 'Portafich', '/img/productos/Portafich.png', 'Fichas - Portafusibles - Portalámparas - Mazos', '6'),
('49', 'Prestolite', '/img/productos/Prestolite.png', 'Cables para bujías', '2'),
('50', 'Ralux', '/img/productos/Ralux.jpeg', 'Destelladores - Módulos de ignición - Relays - Temporizadores', '2'),
('51', 'Reimotor', '/img/productos/Reimotor.png', 'Adaptadores - Alargues de bujías - Conexiones para instrumentales - Gabinetes de instrumental', '6'), -- Accesorios (o '2' Encendido)
('52', 'Rtm', '/img/productos/Rtm.png', 'Destelladores - Relays - Temporizadores de precalentamiento', '2'),
('53', 'Solutronic', '/img/productos/Solutronic.png', 'Balizas - Lamparas de led - Plaquetas electrónicas de led', '5'),
('54', 'Signers', '/img/productos/Signers.png', 'Baterías', '3'),
('55', 'Sumdaf', '/img/productos/Sumdaf.png', 'Precintos plásticos', '6'), -- Accesorios (o '2' Encendido)
('56', 'Tamatel', '/img/productos/Tamatel.png', 'Alternadores - Arranques - Despiece conmutadores de luces - Limpiaparabrisas - Interruptores', '3'),
('57', 'Trico', '/img/productos/Trico.png', 'Escobillas de limpiaparabrisas y luneta trasera', '6'),
('58', 'Triler', '/img/productos/Triler.png', 'Enchufes y accesorios de acoplados', '6'),
('59', 'Vdo', '/img/productos/Vdo.png', 'Bulbos - Motores paso a paso - Relays - Sensores de detonación - Sondas Lambda - Sensores de oxigeno', '4'), -- Inyección (o multiples)
('60', 'Veypa', '/img/productos/Veypa.png', 'Botones de arranque - Llaves varias', '2'),
('61', 'Vic', '/img/productos/Vic.png', 'Faros auxiliares - Ópticas - Vidrios de ópticas', '5'),
('62', 'Vini', '/img/productos/Vini.png', 'Cintas aisladora', '6'),
('63', 'Vuaram', '/img/productos/Vuaram.png', 'Conmutadores de luces y limpiaparabrisas - Llaves tecla - Sensores de nivel de combustible', '2'),
('64', 'Wilson Champ', '/img/productos/Wilson Champ.png', 'Cargadores y arranques de batería - Herramientas de análisis para taller', '3'),
('65', 'X9', '/img/productos/X9.png', 'Bornes de baterías - Cables de instalación - Cortacorrientes - Terminales de instalación', '3'), -- Electricidad (o '6' Accesorios)
('66', 'Zen', '/img/productos/Zen.png', 'Impulsores de arranque', '3'),
('67', 'Zhz', '/img/productos/Zhz.png', 'Bombas de nafta eléctricas - Módulos electrónicos de combustible', '4'),
('68', 'Zm', '/img/productos/Zm.png', 'Alternadores - Arranques - Solenoides de arranque', '3')
;