import React, { useState } from 'react';
import { useWebsiteStore } from '../../store/useWebsiteStore';
import { Edit, Check, X, MapPin } from 'lucide-react';

const EditLocation: React.FC = () => {
  const { mapLocation, updateMapLocation } = useWebsiteStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editedUrl, setEditedUrl] = useState(mapLocation.embedUrl);

const handleSave = async () => { // <--- Hacemos handleSave async para poder usar await
  // ---> AÑADE ESTOS LOGS AQUÍ <---
  console.log('En EditLocation.tsx, dentro de handleSave.');
  console.log('Valor de updateMapLocation en el componente:', updateMapLocation);
  console.log('Tipo de updateMapLocation en el componente:', typeof updateMapLocation);
  console.log('URL a guardar (editedUrl):', editedUrl);

  if (typeof updateMapLocation === 'function') {
    try {
      await updateMapLocation(editedUrl); // Llama a la acción del store
      setIsEditing(false);
      alert('URL del mapa actualizada!'); // Feedback opcional para el usuario
    } catch (error) {
      console.error("Error al intentar actualizar la URL del mapa desde EditLocation:", error);
      alert("Error al guardar la URL. Revisa la consola.");
    }
  } else {
    console.error("Error Crítico: updateMapLocation es undefined o no es una función en EditLocation.tsx");
    alert("Error: La función de actualización no está disponible en el store.");
  }
};


  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Editar Ubicación</h1>
      
      <div className="bg-white rounded-2xl shadow-custom p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800">URL del Mapa</h2>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="p-1 rounded-full text-blue-600 hover:bg-blue-100"
            >
              <Edit className="h-4 w-4" />
            </button>
          )}
        </div>
        
        {isEditing ? (
          <div className="space-y-4">
            <input
              type="text"
              value={editedUrl}
              onChange={(e) => setEditedUrl(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Ingrese la URL de Google Maps"
            />
            
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setIsEditing(false)}
                className="px-3 py-1 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100"
              >
                <X className="h-4 w-4" />
              </button>
              <button
                onClick={handleSave}
                className="px-3 py-1 rounded-lg bg-primary-500 text-white hover:bg-primary-400"
              >
                <Check className="h-4 w-4" />
              </button>
            </div>
          </div>
        ) : (
          <p className="text-sm text-gray-600 break-all">{mapLocation.embedUrl}</p>
        )}
        
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Vista Previa</h3>
          <div className="rounded-xl overflow-hidden shadow-custom">
            <iframe
              src={mapLocation.embedUrl}
              width="100%"
              height="400"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Ubicación de la Empresa"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditLocation;