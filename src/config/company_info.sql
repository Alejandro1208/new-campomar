CREATE TABLE IF NOT EXISTS company_info (
  id VARCHAR(255) PRIMARY KEY DEFAULT '1',
  title VARCHAR(255),
  description TEXT
);

INSERT INTO company_info (id, title, description) VALUES
('1', 'Nuestra Empresa', $$Somos una empresa líder en el mercado con más de 20 años de experiencia brindando soluciones innovadoras y productos de alta calidad. Nuestro compromiso con la excelencia y la satisfacción del cliente nos ha permitido crecer y establecernos como referentes en la industria. Contamos con un equipo de profesionales altamente capacitados y la tecnología más avanzada para garantizar los mejores resultados en cada proyecto.$$);