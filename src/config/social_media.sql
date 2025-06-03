CREATE TABLE IF NOT EXISTS social_media (
  id VARCHAR(255) PRIMARY KEY,
  name VARCHAR(255),
  icon VARCHAR(255),
  url VARCHAR(255)
);

INSERT INTO social_media (id, name, icon, url) VALUES
('1', 'Facebook', 'facebook', 'https://www.facebook.com/DistribuidoraCampomar/'),
('2', 'Instagram', 'instagram', 'https://www.instagram.com/distribuidoracampomarsa/');