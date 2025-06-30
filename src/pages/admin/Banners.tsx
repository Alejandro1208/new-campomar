// src/pages/admin/Banners.tsx (VERSIÓN FINAL CON EDICIÓN)

import { useState, useEffect } from 'react';
import { Plus, Trash2, Save, X, Image as ImageIcon, Edit3 } from 'lucide-react';
import { useBanners } from '../../hooks/useData';
import { Banner } from '../../lib/supabase'; // Reutilizamos la interfaz

const BASE_API_URL = 'https://alejandrosabater.com.ar/api';

export default function Banners() {
  const { banners, loading, refetch } = useBanners();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Estados del formulario
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [altText, setAltText] = useState('');
  const [headline, setHeadline] = useState('');
  const [subheadline, setSubheadline] = useState('');
  const [ctaText, setCtaText] = useState('');
  const [ctaLink, setCtaLink] = useState('');

  useEffect(() => {
    if (imageFile) {
      const objectUrl = URL.createObjectURL(imageFile);
      setPreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    } else if (editingBanner?.image_url) {
      setPreview(`https://alejandrosabater.com.ar${editingBanner.image_url}`);
    } else {
      setPreview(null);
    }
  }, [imageFile, editingBanner]);

  const resetForm = () => {
    setIsFormOpen(false);
    setEditingBanner(null);
    setImageFile(null);
    setPreview(null);
    setAltText('');
    setHeadline('');
    setSubheadline('');
    setCtaText('');
    setCtaLink('');
  };
  
  const handleAddNew = () => {
    resetForm();
    setIsFormOpen(true);
  };

  const handleEdit = (banner: Banner) => {
    resetForm();
    setEditingBanner(banner);
    setAltText(banner.alt_text || '');
    setHeadline(banner.headline || '');
    setSubheadline(banner.subheadline || '');
    setCtaText(banner.cta_text || '');
    setCtaLink(banner.cta_link || '');
    setIsFormOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const formData = new FormData();
    let url = '';

    if (editingBanner) {
      // --- Lógica de Edición ---
      url = `${BASE_API_URL}/updateBanner.php`;
      formData.append('id', editingBanner.id);
      formData.append('headline', headline);
      formData.append('subheadline', subheadline);
      formData.append('cta_text', ctaText);
      formData.append('cta_link', ctaLink);
      // Nota: no enviamos la imagen en la edición de texto.
    } else {
      // --- Lógica de Creación ---
      if (!imageFile) {
        alert('Se requiere un archivo de imagen para crear un nuevo banner.');
        setSubmitting(false);
        return;
      }
      url = `${BASE_API_URL}/createBanner.php`;
      formData.append('image', imageFile);
      formData.append('alt_text', altText);
      formData.append('headline', headline);
      formData.append('subheadline', subheadline);
      formData.append('cta_text', ctaText);
      formData.append('cta_link', ctaLink);
    }

    try {
      const response = await fetch(url, { method: 'POST', body: formData });
      const result = await response.json();
      if (!response.ok || result.error) throw new Error(result.error);
      
      alert(`¡Banner ${editingBanner ? 'actualizado' : 'creado'} con éxito!`);
      resetForm();
      refetch();
    } catch (error) {
      alert(`Error al guardar: ${error}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (bannerId: string) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar este banner?')) return;
    // ... (la lógica de eliminar no cambia)
    try {
      const response = await fetch(`${BASE_API_URL}/deleteBanner.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: bannerId }),
      });
      const result = await response.json();
      if (!response.ok || result.error) throw new Error(result.error);
      alert('Banner eliminado con éxito.');
      refetch();
    } catch (error) {
      alert(`Error al eliminar el banner: ${error}`);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Gestión de Banners</h1>
      
      {!isFormOpen && (
        <button onClick={handleAddNew} className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2 mb-8">
            <Plus size={20} />
            <span>Añadir Nuevo Banner</span>
        </button>
      )}

      {isFormOpen && (
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-6">{editingBanner ? 'Editar Banner' : 'Añadir Nuevo Banner'}</h3>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* ... El formulario completo ... */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Imagen del Banner</label>
              <div className="mt-2 flex items-center gap-x-3">
                <div className="w-48 h-24 bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed">
                  {preview ? <img src={preview} alt="Vista previa" className="h-full w-full object-cover" /> : <ImageIcon className="h-8 w-8 text-gray-400" />}
                </div>
                {!editingBanner && <input type="file" onChange={(e) => e.target.files && setImageFile(e.target.files[0])} required />}
                {editingBanner && <p className="text-sm text-gray-500">Para cambiar la imagen, elimina este banner y crea uno nuevo.</p>}
              </div>
            </div>
            <div>
                <label htmlFor="headline" className="block text-sm font-medium text-gray-700 mb-2">Título Principal</label>
                <input type="text" id="headline" value={headline} onChange={(e) => setHeadline(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
            </div>
            <div>
              <label htmlFor="subheadline" className="block text-sm font-medium text-gray-700 mb-2">Subtítulo</label>
              <textarea id="subheadline" value={subheadline} onChange={(e) => setSubheadline(e.target.value)} rows={2} className="w-full px-4 py-2 border border-gray-300 rounded-lg"></textarea>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="cta_text" className="block text-sm font-medium text-gray-700 mb-2">Texto del Botón</label>
                <input type="text" id="cta_text" value={ctaText} onChange={(e) => setCtaText(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
              </div>
              <div>
                <label htmlFor="cta_link" className="block text-sm font-medium text-gray-700 mb-2">Enlace del Botón</label>
                <input type="text" id="cta_link" value={ctaLink} onChange={(e) => setCtaLink(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
              </div>
            </div>
            <div className="flex space-x-4 pt-4 border-t">
              <button type="submit" disabled={submitting} className="bg-green-500 text-white px-4 py-2 rounded-lg flex items-center space-x-2 disabled:opacity-50">
                <Save size={16} />
                <span>{submitting ? 'Guardando...' : 'Guardar Cambios'}</span>
              </button>
              <button type="button" onClick={resetForm} className="bg-gray-500 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
                <X size={16} />
                <span>Cancelar</span>
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-6">Banners Actuales</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? <p>Cargando...</p> : banners.map(banner => (
            <div key={banner.id} className="relative group border rounded-lg p-2 flex flex-col justify-between">
              <img src={`https://alejandrosabater.com.ar${banner.image_url}`} alt={banner.alt_text} className="w-full h-32 object-cover rounded-lg" />
              <div className="pt-2">
                <p className="font-bold truncate">{banner.headline}</p>
                <p className="text-sm text-gray-500 truncate">{banner.subheadline}</p>
              </div>
              <div className="absolute top-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => handleEdit(banner)} className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700">
                  <Edit3 size={16} />
                </button>
                <button onClick={() => handleDelete(banner.id)} className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}