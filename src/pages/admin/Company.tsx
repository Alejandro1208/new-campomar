// src/pages/admin/Company.tsx (CORREGIDO)

import { useState, useEffect } from 'react';
import { Plus, Trash2, Save, Image as ImageIcon } from 'lucide-react';
import { useCompanyImages, useSiteSettings } from '../../hooks/useData';

const BASE_API_URL = 'https://alejandrosabater.com.ar/api';

export default function Company() {
  const { images, loading: imagesLoading, refetch: refetchImages } = useCompanyImages();
  const { settings: initialSettings, loading: settingsLoading, refetch: refetchSettings } = useSiteSettings();
  
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!settingsLoading) {
      setSettings(initialSettings);
    }
  }, [initialSettings, settingsLoading]);

  const handleImageDelete = async (imageId: string) => {
    if (!window.confirm('¿Eliminar esta imagen?')) return;
    try {
      const response = await fetch(`${BASE_API_URL}/deleteCompanyImage.php`, {
        method: 'POST',
        body: JSON.stringify({ id: imageId }),
      });
      const result = await response.json();
      if (!response.ok || result.error) throw new Error(result.error);
      alert('Imagen eliminada.');
      refetchImages();
    } catch (error) {
      alert(`Error: ${error}`);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);
    
    try {
      const response = await fetch(`${BASE_API_URL}/createCompanyImage.php`, {
        method: 'POST',
        body: formData,
      });
      const result = await response.json();
      if (!response.ok || result.error) throw new Error(result.error);
      alert('Imagen subida con éxito.');
      refetchImages();
    } catch (error) {
      alert(`Error al subir la imagen: ${error}`);
    }
  };

  // --- FUNCIÓN CORREGIDA ---
  const handleSettingsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSettings(prev => ({ ...prev, [name]: value }));
  };

  const handleSettingsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const response = await fetch(`${BASE_API_URL}/updateSettings.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      const result = await response.json();
      if (!response.ok || result.error) throw new Error(result.error);
      alert('Métricas y descripción guardadas con éxito!');
      refetchSettings();
    } catch (error) {
      alert(`Error al guardar: ${error}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Gestión de "La Empresa"</h1>
      
      {/* Gestión de Imágenes */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
        <h3 className="text-xl font-semibold text-gray-800 mb-6">Imágenes de la Sección (Máximo 4)</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {imagesLoading ? <p>Cargando imágenes...</p> : images.map(img => (
            <div key={img.id} className="relative group">
              <img src={`https://alejandrosabater.com.ar${img.image_url}`} alt={img.alt_text} className="w-full h-32 object-cover rounded-lg" />
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100">
                <button onClick={() => handleImageDelete(img.id)} className="text-white p-2 bg-red-600 rounded-full hover:bg-red-700">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
          {images.length < 4 && (
            <label className="w-full h-32 bg-gray-100 rounded-lg flex flex-col items-center justify-center border-2 border-dashed cursor-pointer hover:bg-gray-200">
              <Plus size={24} className="text-gray-400" />
              <span className="text-sm text-gray-500 mt-1">Añadir Imagen</span>
              <input type="file" className="hidden" onChange={handleImageUpload} accept="image/*" />
            </label>
          )}
        </div>
      </div>

      {/* Gestión de Métricas y Texto */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
         <h3 className="text-xl font-semibold text-gray-800 mb-6">Métricas y Texto Principal</h3>
         {settingsLoading ? <p>Cargando...</p> : (
            <form onSubmit={handleSettingsSubmit} className="space-y-6">
                <div>
                    <label htmlFor="company_description" className="block text-sm font-medium text-gray-700 mb-2">Descripción de "La Empresa"</label>
                    <textarea id="company_description" name="company_description" value={settings['company_description'] || ''} onChange={handleSettingsChange} rows={4} className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Métrica 1 (Experiencia)</label>
                        <input type="text" name="metric_experience_value" value={settings['metric_experience_value'] || ''} onChange={handleSettingsChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-2" placeholder="Valor, ej: 20+" />
                        <input type="text" name="metric_experience_label" value={settings['metric_experience_label'] || ''} onChange={handleSettingsChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg" placeholder="Texto, ej: Años de Experiencia" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Métrica 2 (Clientes)</label>
                        <input type="text" name="metric_clients_value" value={settings['metric_clients_value'] || ''} onChange={handleSettingsChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-2" placeholder="Valor, ej: 500+" />
                        <input type="text" name="metric_clients_label" value={settings['metric_clients_label'] || ''} onChange={handleSettingsChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg" placeholder="Texto, ej: Clientes Satisfechos" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Métrica 3 (Proyectos)</label>
                        <input type="text" name="metric_projects_value" value={settings['metric_projects_value'] || ''} onChange={handleSettingsChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-2" placeholder="Valor, ej: 100+" />
                        <input type="text" name="metric_projects_label" value={settings['metric_projects_label'] || ''} onChange={handleSettingsChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg" placeholder="Texto, ej: Proyectos Completados" />
                    </div>
                </div>
                <div className="pt-4 border-t">
                    <button type="submit" disabled={submitting} className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2 disabled:opacity-50">
                        <Save size={18} />
                        <span>{submitting ? 'Guardando...' : 'Guardar Textos y Métricas'}</span>
                    </button>
                </div>
            </form>
        )}
      </div>
    </div>
  );
}