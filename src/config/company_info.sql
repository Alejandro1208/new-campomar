CREATE TABLE IF NOT EXISTS company_info (
  id VARCHAR(255) PRIMARY KEY DEFAULT '1',
  title VARCHAR(255),
  description TEXT,
  images JSONB  -- Columna para almacenar el array de imágenes como JSON
);

-- Insertar datos iniciales (con un array de imágenes vacío o con ejemplos)
-- Asegúrate de que el id '1' sea el que usas consistentemente.
-- Para un array vacío:
INSERT INTO company_info (id, title, description, images) VALUES
('1', 'Nuestra Empresa Desde SQL', 'Descripción inicial desde SQL.', '[]') 
ON CONFLICT (id) DO UPDATE 
SET title = EXCLUDED.title, 
    description = EXCLUDED.description,
    images = EXCLUDED.images; 
-- ON CONFLICT es para manejar el caso de que la fila ya exista (útil si el script se corre múltiples veces)
-- Si prefieres datos de ejemplo para las imágenes:
-- INSERT INTO company_info (id, title, description, images) VALUES
-- ('1', 'Nuestra Empresa Ejemplo', 'Descripción con imágenes de ejemplo.', '[{"id": "imgsql1", "src": "https://via.placeholder.com/300x200.png?text=Imagen+SQL+1", "alt": "Imagen de ejemplo 1 desde SQL"}, {"id": "imgsql2", "src": "https://via.placeholder.com/300x200.png?text=Imagen+SQL+2", "alt": "Imagen de ejemplo 2 desde SQL"}]')
-- ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, images = EXCLUDED.images;