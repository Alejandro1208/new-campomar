CREATE TABLE IF NOT EXISTS contact_info (
id VARCHAR(255) PRIMARY KEY,
icon VARCHAR(255),
text VARCHAR(255),
show_on_mobile BOOLEAN
);

INSERT INTO contact_info (id, icon, text, show_on_mobile) VALUES
('1', 'phone', '+1 234 567 890', TRUE),
('2', 'mail', 'info@empresa.com', TRUE),
('3', 'map-pin', 'Calle Comercial 123, Ciudad', FALSE),
('4', 'clock', 'Lun-Vie: 9:00-18:00', FALSE);
