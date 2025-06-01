import React, { useState, useEffect, ChangeEvent } from 'react';
import { useWebsiteStore } from '../../store/useWebsiteStore';
import { SiteSettingsPayload } from '../../types'; // Asegúrate que este tipo incluya todos los campos de site_settings
import { Save, ImageUp, FileText, Type, AlertTriangle } from 'lucide-react';

const EditSettings: React.FC = () => {
  const { 
    logo, 
    footerShortDescription,
    footerCopyright,
    // Asumimos una acción genérica para guardar todos los settings.
    // Si tienes acciones separadas, necesitarás llamarlas individualmente o coordinarlas.
    updateSiteSettingsInStore, // Renombrada para claridad, debe existir en tu store
    mapLocation // Lo necesitamos para no borrarlo al guardar otros settings
  } = useWebsiteStore((state) => ({
    logo: state.logo,
    footerShortDescription: state.footerShortDescription,
    footerCopyright: state.footerCopyright,
    updateSiteSettingsInStore: state.updateSiteSettingsInStore, // Usa el nombre correcto de la acción en tu store
    mapLocation: state.mapLocation, // Para enviar de vuelta y no perderlo
  }));

  // Estados para el formulario
  const [selectedLogoFile, setSelectedLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [editedFooterDesc, setEditedFooterDesc] = useState<string>('');
  const [editedCopyright, setEditedCopyright] = useState<string>('');
  
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);

  useEffect(() => {
    // Inicializar el preview del logo y los campos de texto con los valores del store
    if (logo) {
      setLogoPreview(logo.startsWith('http') ? logo : `http://localhost:3001${logo}`);
    } else {
      setLogoPreview(null);
    }
    setEditedFooterDesc(footerShortDescription || '');
    setEditedCopyright(footerCopyright || '');
  }, [logo, footerShortDescription, footerCopyright]);

  const handleLogoFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    setMessage(null);
    const file = e.target.files?.[0];
    if (file) {
      setSelectedLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setSelectedLogoFile(null);
      setLogoPreview(logo ? (logo.startsWith('http') ? logo : `http://localhost:3001${logo}`) : null);
    }
  };

  const handleSaveAllSettings = async () => {
    if (typeof updateSiteSettingsInStore !== 'function') {
      setMessage({ type: 'error', text: 'Error: La función para guardar la configuración no está disponible.' });
      console.error("updateSiteSettingsInStore no es una función");
      return;
    }

    setIsSaving(true);
    setMessage(null);
    let finalLogoPath = logo; // Inicia con el logo actual del store

    try {
      const settingsPayload: SiteSettingsPayload & { logoFile?: File | null } = {
        mapLocation: mapLocation, // Mantener el mapLocation actual del store
        logo: logo, // El logo actual del store (la acción del store lo cambiará si hay un selectedLogoFile)
        footerShortDescription: editedFooterDesc,
        footerCopyright: editedCopyright,
        // Añadimos el archivo para que la acción del store decida si subirlo y usar la nueva ruta
        ...(selectedLogoFile && { logoFile: selectedLogoFile }) 
      };
      
      await updateSiteSettingsInStore(settingsPayload); // Esta acción del store debe ser robusta

      setMessage({ type: 'success', text: 'Configuración guardada exitosamente.' });
      setSelectedLogoFile(null); // Limpiar el archivo seleccionado
      // El useEffect se encargará de actualizar el logoPreview con el nuevo logo del store si cambió

    } catch (error: any) {
      console.error("Error al guardar la configuración:", error);
      setMessage({ type: 'error', text: error.message || 'Error al guardar la configuración.' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Configuración General del Sitio</h1>

      {message && (
        <div className={`p-3 rounded-md mb-6 text-sm ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'} flex items-center`}>
          {message.type === 'error' && <AlertTriangle size={16} className="mr-2" />}
          {message.text}
        </div>
      )}

      <div className="space-y-8">
        {/* Sección para editar el Logo del Sitio */}
        <div className="bg-white rounded-2xl shadow-custom p-6 space-y-4">
          <h2 className="text-xl font-semibold text-gray-700 mb-3 border-b pb-2 flex items-center">
            <ImageUp size={20} className="mr-2 text-primary-500" /> Logo del Sitio Web
          </h2>
          <div>
            <label htmlFor="siteLogoFile" className="block text-sm font-medium text-gray-700">
              Seleccionar nuevo logo (PNG, JPG, WEBP, SVG)
            </label>
            <input 
              type="file" 
              id="siteLogoFile" 
              accept="image/png, image/jpeg, image/webp, image/svg+xml"
              onChange={handleLogoFileChange}
              className="mt-1 block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
            />
          </div>

          {(logoPreview) && (
            <div className="mt-3">
              <p className="text-sm font-medium text-gray-700 mb-1">
                {selectedLogoFile ? "Vista previa del nuevo logo:" : "Logo actual:"}
              </p>
              <div className="w-48 h-24 flex items-center justify-center border border-gray-200 p-2 rounded-md bg-gray-50 overflow-hidden">
                <img 
                  src={logoPreview} 
                  alt="Logo del sitio" 
                  className="max-h-full max-w-full object-contain"
                />
              </div>
            </div>
          )}
          {!logoPreview && !selectedLogoFile && (
               <div className="w-48 h-24 flex items-center justify-center border border-dashed border-gray-300 p-2 rounded-md bg-gray-50 text-gray-400">
                  <ImageUp size={32} /> <span className="ml-2">Sin logo</span>
               </div>
          )}
        </div>

        {/* Sección para Textos del Footer */}
        <div className="bg-white rounded-2xl shadow-custom p-6 space-y-4">
          <h2 className="text-xl font-semibold text-gray-700 mb-3 border-b pb-2 flex items-center">
            <FileText size={20} className="mr-2 text-primary-500" /> Textos del Pie de Página
          </h2>
          <div>
            <label htmlFor="footerDesc" className="block text-sm font-medium text-gray-700">
              Descripción Corta (aparece bajo el logo en el footer)
            </label>
            <textarea
              id="footerDesc"
              rows={3}
              value={editedFooterDesc}
              onChange={(e) => setEditedFooterDesc(e.target.value)}
              className="mt-1 w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Una breve descripción sobre la empresa para el pie de página..."
            />
          </div>
          <div>
            <label htmlFor="copyright" className="block text-sm font-medium text-gray-700">
              Texto de Copyright (El año se añade automáticamente. Ej: "MiEmpresa Inc.")
            </label>
            <input
              type="text"
              id="copyright"
              value={editedCopyright}
              onChange={(e) => setEditedCopyright(e.target.value)}
              className="mt-1 w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Ej: Nombre de tu Empresa. Todos los derechos reservados."
            />
          </div>
        </div>

        {/* Botón de Guardar General */}
        <div className="flex justify-end mt-6 pt-6 border-t">
            <button
              onClick={handleSaveAllSettings}
              disabled={isSaving}
              className="px-8 py-2.5 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 disabled:opacity-50 flex items-center"
            >
              <Save size={18} className="mr-2"/> 
              {isSaving ? 'Guardando...' : 'Guardar Configuración'}
            </button>
          </div>
      </div>
    </div>
  );
};

export default EditSettings;