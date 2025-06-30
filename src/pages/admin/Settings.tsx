// src/pages/admin/Settings.tsx (VERSIÓN FINAL CORREGIDA)

import { useState, useEffect } from 'react';
import { Save, Info, UploadCloud } from 'lucide-react';
import { useSiteSettings } from '../../hooks/useData';

const BASE_API_URL = 'https://alejandrosabater.com.ar/api';

const settingLabels: Record<string, string> = {
  topbar_phone: 'Teléfono (Barra Superior)',
  topbar_email: 'Email (Barra Superior)',
  topbar_address: 'Dirección (Barra Superior)',
  topbar_schedule: 'Horario (Barra Superior)',
  company_description: 'Descripción de "La Empresa"',
  footer_description: 'Descripción Corta (Pie de Página)',
  footer_schedule: 'Horario (Pie de Página)',
  whatsapp_phone: 'Teléfono de WhatsApp Flotante',
  facebook_url: 'URL de Facebook',
  instagram_url: 'URL de Instagram',
  youtube_url: 'URL de YouTube (icono flotante)',
  maps_iframe_url: 'URL del Iframe de Google Maps'
};

export default function Settings() {
  const { settings: initialSettings, loading, refetch } = useSiteSettings();
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  useEffect(() => {
    if (!loading) {
      setSettings(initialSettings);
      // Aseguramos que la preview se actualice correctamente, incluso con la cache del navegador
      const logoUrl = initialSettings.site_logo_url 
        ? `https://alejandrosabater.com.ar${initialSettings.site_logo_url}?v=${new Date().getTime()}` 
        : null;
      setLogoPreview(logoUrl);
    }
  }, [initialSettings, loading]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setSettings(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleLogoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      // Primero, si hay un nuevo logo, lo subimos.
      if (logoFile) {
        const logoFormData = new FormData();
        logoFormData.append('logo', logoFile);
        const logoResponse = await fetch(`${BASE_API_URL}/uploadLogo.php`, {
          method: 'POST',
          body: logoFormData,
        });
        const logoResult = await logoResponse.json();
        if (!logoResponse.ok || logoResult.error) {
          throw new Error(logoResult.error || 'Error al subir el logo');
        }
      }
      
      // Segundo, guardamos TODAS las configuraciones de texto.
      // Nuestro script updateSettings.php es lo suficientemente inteligente para manejar esto.
      const textResponse = await fetch(`${BASE_API_URL}/updateSettings.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      const textResult = await textResponse.json();
      if (!textResponse.ok || textResult.error) {
        throw new Error(textResult.error || 'Error al guardar los textos');
      }
      
      alert('¡Configuraciones guardadas con éxito!');
      refetch(); // Recargamos todo para ver los cambios
      setLogoFile(null); 
    } catch (error) {
      alert(`Error al guardar: ${error}`);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div>Cargando...</div>;
  
  const topBarKeys = ['topbar_phone', 'topbar_email', 'topbar_address', 'topbar_schedule'];
  const contentKeys = ['company_description', 'footer_description'];
  const contactKeys = ['footer_schedule', 'whatsapp_phone', 'facebook_url', 'instagram_url', 'youtube_url'];
  const mapKey = 'maps_iframe_url';

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Configuraciones Generales</h1>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* --- SECCIÓN DEL LOGO --- */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Logo del Sitio</h2>
          <div className="flex items-center gap-x-4">
            <div className="w-32 h-16 bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed">
              {logoPreview ? <img src={logoPreview} alt="Vista previa del logo" className="max-h-full max-w-full" /> : <span className="text-xs text-gray-500">Sin logo</span>}
            </div>
            <input type="file" onChange={handleLogoFileChange} accept="image/png, image/jpeg, image/jpg, image/svg+xml" className="block text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:font-semibold file:bg-blue-50 file:text-primary hover:file:bg-blue-100" />
          </div>
        </div>

        {/* --- OTRAS SECCIONES (he agrupado la lógica del formulario) --- */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-4 border-b pb-2">Barra Superior y Mapa</h2>
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg mb-6 flex items-center">
              <Info size={20} className="text-blue-500 mr-3 flex-shrink-0" />
              <p className="text-sm text-blue-700">Estos datos se muestran tanto en la barra superior como en las tarjetas debajo del mapa.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {topBarKeys.map(key => (<div key={key}><label htmlFor={key} className="block text-sm font-medium text-gray-700 mb-2">{settingLabels[key]}</label><input type="text" id={key} name={key} value={settings[key] || ''} onChange={handleInputChange} className="w-full input-style"/></div>))}
            </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-4 border-b pb-2">Contenido General</h2>
             <div className="space-y-6">
                {contentKeys.map(key => (<div key={key}><label htmlFor={key} className="block text-sm font-medium text-gray-700 mb-2">{settingLabels[key]}</label><textarea id={key} name={key} value={settings[key] || ''} onChange={handleInputChange} rows={key.includes('description') ? 4 : 2} className="w-full input-style" /></div>))}
             </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-4 border-b pb-2">Redes y Contacto</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {contactKeys.map(key => (<div key={key}><label htmlFor={key} className="block text-sm font-medium text-gray-700 mb-2">{settingLabels[key]}</label><input type="text" id={key} name={key} value={settings[key] || ''} onChange={handleInputChange} className="w-full input-style"/></div>))}
            </div>
        </div>
        
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Ubicación de Google Maps</h2>
          <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded-r-lg mb-6 text-sm text-green-800"><p className="font-semibold mb-2">Instrucciones:</p><ol className="list-decimal list-inside space-y-1"><li>Busca tu dirección en Google Maps.</li><li>Haz clic en "Compartir" y luego en la pestaña "Incorporar un mapa".</li><li>Copia el enlace que está dentro de las comillas `src="..."`.</li><li>Pega ese enlace aquí abajo.</li></ol></div>
          <div><label htmlFor={mapKey} className="block text-sm font-medium text-gray-700 mb-2">{settingLabels[mapKey]}</label><input type="text" id={mapKey} name={mapKey} value={settings[mapKey] || ''} onChange={handleInputChange} className="w-full input-style"/></div>
        </div>

        <div className="flex justify-end">
            <button type="submit" disabled={submitting} className="bg-primary text-white px-8 py-3 rounded-lg hover:bg-blue-700 flex items-center space-x-2 disabled:opacity-50 font-bold text-base">
                <Save size={20} />
                <span>{submitting ? 'Guardando...' : 'Guardar Todas las Configuraciones'}</span>
            </button>
        </div>
      </form>
    </div>
  );
}

