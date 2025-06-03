CREATE TABLE IF NOT EXISTS company_info (
  id VARCHAR(255) PRIMARY KEY DEFAULT '1',
  title VARCHAR(255),
  description TEXT,
  images JSONB
);
INSERT INTO company_info (id, title, description, images)
VALUES (
    '1',
    'La empresa',
    'Distribuidora Campomar S.A. fue gestada como una empresa familiar en el año 1957, convirtiéndose a lo largo de 65 años en una compañía líder dentro del mercado de reposición automotriz. Debido al arduo trabajo, responsabilidad y compromiso asumido por las tres generaciones que han tomado la dirección, Distribuidora Campomar S.A. ha logrado sostener los valores que sus fundadores han inculcado en la familia a lo largo de estos años como pilares fundamentales para brindar un servicio de excelencia e innovador para sus clientes.',
    '[
        { "id": "img1", "src": "/img/la-empresa-1.jpg", "alt": "Descripción de la imagen 1 de la empresa" },
        { "id": "img2", "src": "/img/la-empresa-2.jpg", "alt": "Descripción de la imagen 2 de la empresa" },
        { "id": "img3", "src": "/img/la-empresa-3.jpg", "alt": "Descripción de la imagen 3 de la empresa" },
        { "id": "img4", "src": "/img/la-empresa-4.jpg", "alt": "Descripción de la imagen 4 de la empresa" }
    ]'::jsonb 
  ) ON CONFLICT (id) DO
UPDATE
SET title = EXCLUDED.title,
  description = EXCLUDED.description,
  images = EXCLUDED.images;