CREATE TABLE IF NOT EXISTS phone_numbers (
  id VARCHAR(255) PRIMARY KEY, -- El ID es un VARCHAR y la clave primaria
  number VARCHAR(255),
  label VARCHAR(255)
);

INSERT INTO phone_numbers (id, number, label) VALUES
('1', '1132140313', 'Ventas Mayoristas'),
('2', '1158559410', 'Ventas Mayoristas'),
('3', '1122849850', 'Ventas Minoristas'),
('4', '1155784862', 'Ventas Minoristas'),
('5', '1144227511', 'Mercado Libre');
