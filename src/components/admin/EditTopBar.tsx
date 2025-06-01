import React, { useState, useEffect, ChangeEvent } from 'react'; // Añade useEffect si lo necesitas
import { useWebsiteStore } from '../../store/useWebsiteStore';
import { ContactInfo } from '../../types'; // Asegúrate de que este tipo esté correcto y exportado
import { Phone, Mail, MapPin, Clock, Trash, Edit, Check, X, PlusCircle, Save } from 'lucide-react'; // Agregué PlusCircle y Save

// Tipo para el formulario de edición/creación
// Hacemos 'id' opcional para nuevos ítems. `is_active` es el campo para ocultar/mostrar
type ContactInfoFormData = {
  id?: string;
  icon: string;
  text: string;
  show_on_mobile: boolean;
  is_active: boolean; // Asumiendo que añadiste esto a tu tipo ContactInfo
};

const iconOptions = [
  { value: 'phone', label: 'Teléfono', icon: <Phone className="h-5 w-5" /> },
  { value: 'mail', label: 'Correo', icon: <Mail className="h-5 w-5" /> },
  { value: 'map-pin', label: 'Ubicación', icon: <MapPin className="h-5 w-5" /> },
  { value: 'clock', label: 'Reloj', icon: <Clock className="h-5 w-5" /> },
];

const EditTopBar: React.FC = () => {
  const { 
    contactInfo, 
    addContactInfoItem, 
    updateContactInfoItem, 
    deleteContactInfoItem 
  } = useWebsiteStore((state) => ({
    contactInfo: state.contactInfo,
    addContactInfoItem: state.addContactInfoItem,
    updateContactInfoItem: state.updateContactInfoItem,
    deleteContactInfoItem: state.deleteContactInfoItem,
  }));

  const [isEditingId, setIsEditingId] = useState<string | null>(null);
  // Usamos un estado separado para los datos del formulario del ítem que se está editando o creando
  const [formState, setFormState] = useState<ContactInfoFormData>({
    icon: iconOptions[0]?.value || '',
    text: '',
    show_on_mobile: true,
    is_active: true, // Por defecto activo
  });
  const [isAddingNew, setIsAddingNew] = useState(false); // Para controlar el formulario de nuevo ítem

  const handleEdit = (item: ContactInfo) => {
    setIsEditingId(item.id);
    setFormState({ ...item }); // Carga los datos del ítem en el estado del formulario
    setIsAddingNew(false); // Asegurarse de que no estamos en modo "añadir nuevo"
  };

  const handleCancelEdit = () => {
    setIsEditingId(null);
    // No es necesario resetear formState aquí si solo se usa cuando isEditingId o isAddingNew es true
  };

  const handleFormInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const target = e.target as HTMLInputElement;
    const { name, value, type } = target;
    setFormState(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? target.checked : value,
    }));
  };

  const handleSave = async () => {
    if (!formState.text.trim() || !formState.icon) {
        alert("Icono y Texto son obligatorios.");
        return;
    }

    try {
      if (isEditingId) { // Estamos editando un ítem existente
        if (typeof updateContactInfoItem === 'function') {
          // Creamos el objeto solo con los campos que se pueden editar (sin el id)
          const dataToUpdate: Partial<Omit<ContactInfo, 'id'>> = {
            icon: formState.icon,
            text: formState.text,
            show_on_mobile: formState.show_on_mobile,
            is_active: formState.is_active,
          };
          await updateContactInfoItem(isEditingId, dataToUpdate);
        } else {
          throw new Error("updateContactInfoItem no es una función");
        }
      } else if (isAddingNew) { // Estamos agregando un nuevo ítem
        if (typeof addContactInfoItem === 'function') {
          const newItemData: Omit<ContactInfo, 'id'> = {
            icon: formState.icon,
            text: formState.text,
            show_on_mobile: formState.show_on_mobile,
            is_active: formState.is_active,
          };
          await addContactInfoItem(newItemData);
        } else {
          throw new Error("addContactInfoItem no es una función");
        }
      }
      setIsEditingId(null);
      setIsAddingNew(false);
      // No es necesario resetear formState aquí si el formulario se oculta
    } catch (error) {
      console.error("Error al guardar el ítem:", error);
      alert("Error al guardar el ítem. Revisa la consola.");
    }
  };
  
  const handleDelete = async (id: string) => {
    if (typeof deleteContactInfoItem === 'function') {
        if(window.confirm('¿Estás seguro de eliminar este ítem?')) {
            try {
                await deleteContactInfoItem(id);
            } catch (error) {
                console.error("Error al eliminar el ítem:", error);
                alert("Error al eliminar el ítem.");
            }
        }
    } else {
        alert("Error: La función para eliminar no está disponible.");
    }
  };

  const openAddNewForm = () => {
    setIsEditingId(null); // Nos aseguramos que no estamos editando
    setFormState({ // Resetear para un nuevo ítem
        icon: iconOptions[0]?.value || '',
        text: '',
        show_on_mobile: true,
        is_active: true,
    });
    setIsAddingNew(true); // Mostrar el formulario de "añadir nuevo"
  };
  
  const renderIconDisplay = (iconValue: string) => {
    const iconObj = iconOptions.find(opt => opt.value === iconValue);
    return iconObj ? React.cloneElement(iconObj.icon, {className: "h-5 w-5"}) : null;
  }

  // Formulario de Edición/Creación (puede ser un componente separado o inline)
  const renderForm = () => (
    <div className="border border-gray-300 rounded-xl p-4 my-4 space-y-4 bg-gray-50">
      <h3 className="text-lg font-semibold text-gray-700">{isEditingId ? 'Editando Ítem' : 'Nuevo Ítem'}</h3>
      <div>
        <label htmlFor="icon" className="block text-sm font-medium text-gray-700 mb-1">Icono</label>
        <select name="icon" value={formState.icon} onChange={handleFormInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg">
          {iconOptions.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
        </select>
      </div>
      <div>
        <label htmlFor="text" className="block text-sm font-medium text-gray-700 mb-1">Texto</label>
        <input type="text" name="text" value={formState.text} onChange={handleFormInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg"/>
      </div>
      <div className="flex items-center space-x-4">
        <label className="flex items-center">
          <input type="checkbox" name="show_on_mobile" checked={formState.show_on_mobile} onChange={handleFormInputChange} className="mr-2 h-4 w-4"/>
          <span className="text-sm text-gray-700">Mostrar en móvil</span>
        </label>
        <label className="flex items-center">
          <input type="checkbox" name="is_active" checked={formState.is_active} onChange={handleFormInputChange} className="mr-2 h-4 w-4"/>
          <span className="text-sm text-gray-700">Activo (Visible)</span>
        </label>
      </div>
      <div className="flex justify-end space-x-2">
        <button onClick={() => { setIsAddingNew(false); handleCancelEdit(); }} className="px-3 py-1 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100"><X className="h-4 w-4 inline-block mr-1"/>Cancelar</button>
        <button onClick={handleSave} className="px-3 py-1 rounded-lg bg-primary-500 text-white hover:bg-primary-400"><Save className="h-4 w-4 inline-block mr-1"/>Guardar</button>
      </div>
    </div>
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Editar Barra Superior (Información de Contacto)</h1>
        {!isAddingNew && !isEditingId && ( // Solo mostrar si no se está añadiendo o editando
             <button onClick={openAddNewForm} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded flex items-center">
                <PlusCircle size={18} className="mr-2" /> Añadir Ítem
            </button>
        )}
      </div>

      {/* Formulario para añadir nuevo (se muestra condicionalmente) */}
      {isAddingNew && renderForm()}
      
      <div className="space-y-3">
        {(contactInfo || []).map((item) => (
          <div key={item.id} className={`border rounded-xl p-4 ${isEditingId === item.id ? 'bg-blue-50' : 'bg-white'} ${!item.is_active ? 'opacity-50 bg-gray-100' : ''}`}>
            {isEditingId === item.id ? renderForm() : (
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {renderIconDisplay(item.icon)}
                  <span className="text-sm text-gray-800">{item.text}</span>
                  {item.show_on_mobile && <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Móvil</span>}
                  {!item.is_active && <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full">Oculto</span>}
                </div>
                <div className="space-x-2">
                  <button onClick={() => handleEdit(item)} className="p-1.5 rounded-full text-blue-600 hover:bg-blue-100"><Edit size={16} /></button>
                  <button onClick={() => handleDelete(item.id)} className="p-1.5 rounded-full text-red-600 hover:bg-red-100"><Trash size={16} /></button>
                </div>
              </div>
            )}
          </div>
        ))}
        {contactInfo?.length === 0 && !isAddingNew && (
            <p className="text-center py-4 text-gray-500">No hay información de contacto. Añade un nuevo ítem.</p>
        )}
      </div>
    </div>
  );
};

export default EditTopBar;