/*
  # Crear bucket de almacenamiento público

  1. Almacenamiento
    - Crear bucket público 'public_assets'
    - Configurar políticas de acceso público para lectura
    - Permitir subida de archivos a usuarios autenticados
*/

-- Crear bucket público para assets
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'public_assets',
  'public_assets',
  true,
  5242880, -- 5MB
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
) ON CONFLICT (id) DO NOTHING;

-- Política para lectura pública
CREATE POLICY "Public read access"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'public_assets');

-- Política para subida de archivos por usuarios autenticados
CREATE POLICY "Authenticated users can upload files"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'public_assets');

-- Política para actualización por usuarios autenticados
CREATE POLICY "Authenticated users can update files"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'public_assets');

-- Política para eliminación por usuarios autenticados
CREATE POLICY "Authenticated users can delete files"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'public_assets');