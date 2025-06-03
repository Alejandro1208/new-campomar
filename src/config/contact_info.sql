CREATE TABLE IF NOT EXISTS contact_info (
  id VARCHAR(255) PRIMARY KEY,
  icon VARCHAR(255),
  text VARCHAR(255),
  show_on_mobile BOOLEAN,
  is_active BOOLEAN DEFAULT TRUE
);


INSERT INTO contact_info (id, icon, text, show_on_mobile, is_active) VALUES
('1', 'phone', '1152632814', TRUE, TRUE),
('2', 'phone', '1132140313', TRUE, TRUE),
('3', 'map-pin', 'Av. Warnes 1255, CABA', FALSE, TRUE),
('4', 'email', ' ventas@campomarsa.com.ar', FALSE, TRUE)
ON CONFLICT (id) DO UPDATE SET 
  icon = EXCLUDED.icon, 
  text = EXCLUDED.text, 
  show_on_mobile = EXCLUDED.show_on_mobile,
  is_active = EXCLUDED.is_active;