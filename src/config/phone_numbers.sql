CREATE TABLE IF NOT EXISTS phone_numbers (
id VARCHAR(255) PRIMARY KEY,
number VARCHAR(255),
label VARCHAR(255)
);

INSERT INTO phone_numbers (id, number, label) VALUES
('1', '+1 234 567 890', 'Ventas'),
('2', '+1 234 567 891', 'Soporte'),
('3', '+1 234 567 892', 'Administración'),
('4', '+1 234 567 893', 'RRHH'),
('5', '+1 234 567 894', 'General');
