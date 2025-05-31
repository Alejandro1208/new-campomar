CREATE TABLE IF NOT EXISTS site_settings (
  id VARCHAR(255) PRIMARY KEY,
  map_embed_url TEXT,
  site_logo_url VARCHAR(255)
);


INSERT INTO site_settings (id, map_embed_url, site_logo_url) 
VALUES ('default', 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3283.960893996255!2d-58.38157038476918!3d-34.60518098045927!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95bccacf3833a573%3A0x2e0ba73d30239009!2sObelisco!5e0!3m2!1ses-419!2sar!4v1622502488760!5m2!1ses-419!2sar', '') 
ON CONFLICT (id) DO NOTHING; 
