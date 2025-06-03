CREATE TABLE IF NOT EXISTS business_hours (
id VARCHAR(255) PRIMARY KEY,
days VARCHAR(255),
hours VARCHAR(255)
);

INSERT INTO business_hours (id, days, hours) VALUES
('1', 'Lun-Vie', '8:00-17:45');

