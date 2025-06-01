import React, { useState, ChangeEvent } from 'react';
import { useWebsiteStore } from '../../store/useWebsiteStore';
import { MenuItem as MenuItemType } from '../../types'; // Renombrado para evitar conflicto con el ícono Menu
import { Menu as MenuIcon, Edit3, Save, XCircle } from 'lucide-react'; // Cambiado Edit a Edit3, Check a Save, X a XCircle

const EditNavigation: React.FC = () => {
  const { menuItems, updateMenuItem } = useWebsiteStore((state) => ({
    menuItems: state.menuItems,
    updateMenuItem: state.updateMenuItem,
  }));

  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  // Estado para el texto que se está editando
  const [currentEditText, setCurrentEditText] = useState<string>('');

  const handleEdit = (item: MenuItemType) => {
    setEditingItemId(item.id);
    setCurrentEditText(item.text); // Cargar el texto actual en el input
  };

  const handleSave = async (id: string) => {
    if (typeof updateMenuItem !== 'function') {
      alert('Error: La función de actualización no está disponible.');
      console.error("updateMenuItem no es una función en EditNavigation");
      return;
    }
    if (!currentEditText.trim()) {
        alert('El texto no puede estar vacío.');
        return;
    }

    try {
      // Solo actualizamos el texto. La URL y el ID no se modifican.
      await updateMenuItem(id, { text: currentEditText });
      setEditingItemId(null); // Salir del modo edición
    } catch (error) {
      console.error("Error al guardar el ítem de menú:", error);
      alert("Error al guardar el ítem de menú. Revisa la consola.");
    }
  };

  const handleCancelEdit = () => {
    setEditingItemId(null);
    setCurrentEditText(''); // Limpiar el texto en edición
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Editar Textos de Navegación</h1>
      
      <div className="bg-white rounded-2xl shadow-custom p-6">
        <div className="space-y-4">
          {(menuItems || []).map((item) => (
            <div key={item.id} className={`border rounded-xl p-4 ${editingItemId === item.id ? 'bg-blue-50 border-blue-200' : 'border-gray-200'}`}>
              {editingItemId === item.id ? (
                // Formulario de Edición
                <div className="space-y-3">
                  <div>
                    <label htmlFor={`menuitem-text-${item.id}`} className="block text-sm font-medium text-gray-700 mb-1">
                      Editar Texto para "{item.text}" (URL: {item.url})
                    </label>
                    <input
                      type="text"
                      id={`menuitem-text-${item.id}`}
                      value={currentEditText}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setCurrentEditText(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={handleCancelEdit}
                      className="px-3 py-1.5 rounded-lg border border-gray-300 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                    >
                      <XCircle size={16} className="mr-1" /> Cancelar
                    </button>
                    <button
                      onClick={() => handleSave(item.id)}
                      className="px-3 py-1.5 rounded-lg bg-primary-500 text-sm text-white hover:bg-primary-400 flex items-center"
                    >
                      <Save size={16} className="mr-1" /> Guardar
                    </button>
                  </div>
                </div>
              ) : (
                // Vista de Ítem
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <MenuIcon className="h-5 w-5 text-primary-500" />
                    <div>
                        <span className="font-medium text-gray-800">{item.text}</span>
                        <p className="text-xs text-gray-500">URL: {item.url} (ID: {item.id})</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleEdit(item)}
                    className="p-1.5 rounded-full text-blue-600 hover:bg-blue-100"
                    title="Editar Texto"
                  >
                    <Edit3 size={18} />
                  </button>
                </div>
              )}
            </div>
          ))}
          {(menuItems?.length === 0) && (
            <p className="text-center py-4 text-gray-500">No hay ítems de menú para mostrar.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditNavigation;