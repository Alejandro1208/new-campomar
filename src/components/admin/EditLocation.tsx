import React, { useState, useEffect } from 'react'; // Asegúrate de importar useEffect si lo usas para sincronizar editedUrl
import { useWebsiteStore } from '../../store/useWebsiteStore';
import { Edit, Check, X, MapPin } from 'lucide-react'; 
 // MapPin no se usa aquí, pero Edit, Check, X sí.

const EditLocation: React.FC = () => {
  const { mapLocation, updateMapLocation } = useWebsiteStore((state) => ({ // Selector más específico
    mapLocation: state.mapLocation,
    updateMapLocation: state.updateMapLocation,
  }));

  const [isEditing, setIsEditing] = useState(false);
  // Inicializar editedUrl con el valor del store. 
  // Si mapLocation.embedUrl puede cambiar mientras el componente está montado y 'isEditing' es false,
  // necesitarás un useEffect para actualizar editedUrl cuando cambie mapLocation.embedUrl.
  const [editedUrl, setEditedUrl] = useState(mapLocation.embedUrl);

  // Sincronizar el editedUrl si mapLocation.embedUrl del store cambia (por ejemplo, después de guardar)
  // o cuando se entra en modo edición.
  useEffect(() => {
    if (mapLocation) { // Asegurarse que mapLocation no es undefined
        setEditedUrl(mapLocation.embedUrl || ''); // Usar string vacío si embedUrl es undefined/null
    }
  }, [mapLocation, isEditing]); // Actualizar si mapLocation cambia o si se activa/desactiva la edición


  const handleSave = async () => {
    console.log('En EditLocation.tsx, dentro de handleSave.');
    console.log('Valor de updateMapLocation en el componente:', updateMapLocation);
    console.log('Tipo de updateMapLocation en el componente:', typeof updateMapLocation);
    console.log('URL a guardar (editedUrl):', editedUrl);

    if (typeof updateMapLocation === 'function') {
      try {
        await updateMapLocation(editedUrl);
        setIsEditing(false);
        // alert('URL del mapa actualizada!'); // Puedes mantener la alerta o quitarla
      } catch (error) {
        console.error("Error al intentar actualizar la URL del mapa desde EditLocation:", error);
        alert("Error al guardar la URL. Revisa la consola.");
      }
    } else {
      console.error("Error Crítico: updateMapLocation es undefined o no es una función en EditLocation.tsx");
      alert("Error: La función de actualización no está disponible en el store.");
    }
  };
  
  const handleCancel = () => {
    setEditedUrl(mapLocation.embedUrl || ''); // Restaurar al valor del store al cancelar
    setIsEditing(false);
  };


  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Editar Ubicación del Mapa</h1>
      
      <div className="bg-white rounded-2xl shadow-custom p-6">
        <div className="flex justify-between items-center mb-1"> {/* Reducido mb-4 a mb-1 o mb-2 */}
          <h2 className="text-lg font-semibold text-gray-800">URL del Iframe de Google Maps</h2>
          {!isEditing && (
            <button
              onClick={() => {
                setEditedUrl(mapLocation.embedUrl || ''); // Cargar valor actual al entrar en edición
                setIsEditing(true);
              }}
              className="p-1 rounded-full text-blue-600 hover:bg-blue-100"
              aria-label="Editar URL del mapa"
            >
              <Edit className="h-4 w-4" />
            </button>
          )}
        </div>
        
        {isEditing ? (
          <div className="space-y-3"> {/* Incrementado space-y-2 a space-y-3 o space-y-4 */}
            <textarea // Cambiado input a textarea para URLs largas
              value={editedUrl}
              onChange={(e) => setEditedUrl(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 min-h-[80px] text-sm"
              placeholder="Pega aquí la URL del atributo src del iframe de Google Maps"
              rows={3} // Sugerencia de filas
            />
            
            {/* === INSTRUCCIONES AÑADIDAS === */}
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-md text-xs text-blue-700">
              <p className="font-semibold mb-1">Cómo obtener la URL correcta:</p>
              <ol className="list-decimal list-inside space-y-1">
                <li>Ve a Google Maps y busca la ubicación deseada.</li>
                <li>Haz clic en el botón "Compartir".</li>
                <li>En la ventana emergente, selecciona la pestaña "Insertar un mapa".</li>
                <li>Verás un código que empieza con <code>&lt;iframe src="URL_AQUÍ" ...&gt;</code>.</li>
                <li>Copia **solamente la URL** que está dentro de las comillas del atributo <code>src</code>.</li>
                <li>(Ejemplo de la URL que necesitas: <code>https://www.google.com/maps/embed?pb=...</code>)</li>
                <li>Pega esa URL en el campo de arriba.</li>
              </ol>
            </div>
            {/* === FIN DE INSTRUCCIONES === */}
            
            <div className="flex justify-end space-x-2 mt-2"> {/* Añadido mt-2 */}
              <button
                onClick={handleCancel} // Usar handleCancel
                className="px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-100"
              >
                <X className="h-4 w-4 mr-1 inline-block" /> Cancelar
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 rounded-lg bg-primary-500 text-sm font-medium text-white hover:bg-primary-400 flex items-center"
              >
                <Check className="h-4 w-4 mr-1 inline-block" /> Guardar URL
              </button>
            </div>
          </div>
        ) : (
          <p className="text-sm text-gray-600 break-all bg-gray-50 p-3 rounded-md">
            {mapLocation.embedUrl ? mapLocation.embedUrl : "No hay URL de mapa configurada."}
          </p>
        )}
        
        <div className="mt-8"> {/* Incrementado mt-6 a mt-8 */}
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Vista Previa del Mapa</h3> {/* Reducido mb-4 a mb-3 */}
          {mapLocation && mapLocation.embedUrl ? (
            <div className="rounded-xl overflow-hidden shadow-xl border border-gray-200 aspect-video"> {/* Mejorado estilo de preview */}
              <iframe
                src={mapLocation.embedUrl}
                width="100%"
                height="100%" // Ajustado para aspect-video
                style={{ border: 0 }}
                allowFullScreen={true} // atributo allowFullScreen se escribe así en React
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Vista Previa de Ubicación de la Empresa"
              ></iframe>
            </div>
          ) : (
            <div className="text-center text-gray-400 py-10 border border-dashed border-gray-300 rounded-lg">
              <MapPin size={32} className="mx-auto mb-2" />
              <p>El mapa se mostrará aquí una vez que se configure una URL.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditLocation;