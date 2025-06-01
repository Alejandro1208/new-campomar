CREATE TABLE IF NOT EXISTS contact_info (
  id VARCHAR(255) PRIMARY KEY,
  icon VARCHAR(255),
  text VARCHAR(255),
  show_on_mobile BOOLEAN,
  is_active BOOLEAN DEFAULT TRUE
);


INSERT INTO contact_info (id, icon, text, show_on_mobile, is_active) VALUES
('1', 'phone', '+54 9 11 1234-5678', TRUE, TRUE),
('2', 'mail', 'info@empresa.com', TRUE, TRUE),
('3', 'map-pin', 'Av. Siempre Viva 742', FALSE, TRUE),
('4', 'clock', 'Lun-Vie: 9am - 6pm', FALSE, TRUE)
ON CONFLICT (id) DO UPDATE SET 
  icon = EXCLUDED.icon, 
  text = EXCLUDED.text, 
  show_on_mobile = EXCLUDED.show_on_mobile,
  is_active = EXCLUDED.is_active;