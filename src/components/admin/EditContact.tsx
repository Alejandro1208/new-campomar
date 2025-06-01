import React, { useState, useEffect, ChangeEvent } from 'react';
import { useWebsiteStore } from '../../store/useWebsiteStore';
import { PhoneNumber, SocialMedia, BusinessHours } from '../../types'; // Asegúrate de importar los tipos correctos
import { PlusCircle, Edit3, Trash2, Save, XCircle, Phone, Clock, Facebook, Instagram, Twitter, Linkedin, Link as LinkIcon } from 'lucide-react'; // Añadí más íconos

// Tipos para los formularios
type PhoneFormData = Omit<PhoneNumber, 'id'> & { id?: string };
type SocialFormData = Omit<SocialMedia, 'id'> & { id?: string; name: string }; // 'name' podría ser el label, 'icon' el value
// Para BusinessHours, la edición puede ser más compleja si tienes múltiples entradas.
// Este ejemplo asume que puedes editar las entradas existentes o agregar nuevas.
type BusinessHoursFormData = Omit<BusinessHours, 'id'> & { id?: string };


// Opciones de iconos para Redes Sociales
const socialIconOptions: { value: string; label: string; IconComponent: React.ElementType }[] = [
  { value: 'facebook', label: 'Facebook', IconComponent: Facebook },
  { value: 'instagram', label: 'Instagram', IconComponent: Instagram },
  { value: 'twitter', label: 'Twitter', IconComponent: Twitter },
  { value: 'linkedin', label: 'LinkedIn', IconComponent: Linkedin },
  { value: 'youtube', label: 'YouTube', IconComponent: LinkIcon }, // Placeholder si no tienes YoutubeIcon
  // Añade más si es necesario
];


const EditContact: React.FC = () => {
  const {
    phoneNumbers, addPhoneNumber: storeAddPhone, updatePhoneNumber: storeUpdatePhone, deletePhoneNumber: storeDeletePhone,
    socialMedia, addSocialMedia: storeAddSocial, updateSocialMedia: storeUpdateSocial, deleteSocialMedia: storeDeleteSocial,
    businessHours, addBusinessHours: storeAddHours, updateBusinessHours: storeUpdateHours, deleteBusinessHours: storeDeleteHours,
  } = useWebsiteStore((state) => ({
    phoneNumbers: state.phoneNumbers,
    addPhoneNumber: state.addPhoneNumber,
    updatePhoneNumber: state.updatePhoneNumber,
    deletePhoneNumber: state.deletePhoneNumber,
    socialMedia: state.socialMedia,
    addSocialMedia: state.addSocialMedia, // Necesitarás estas acciones en el store
    updateSocialMedia: state.updateSocialMedia,
    deleteSocialMedia: state.deleteSocialMedia, // Necesitarás estas acciones en el store
    businessHours: state.businessHours, // Esto debería ser BusinessHours[]
    addBusinessHours: state.addBusinessHours,   // Necesitarás estas acciones
    updateBusinessHours: state.updateBusinessHours,
    deleteBusinessHours: state.deleteBusinessHours, // Necesitarás estas acciones
  }));

  // --- Estados para Teléfonos ---
  const [isPhoneModalOpen, setIsPhoneModalOpen] = useState(false);
  const [editingPhone, setEditingPhone] = useState<PhoneNumber | null>(null);
  const [phoneForm, setPhoneForm] = useState<Omit<PhoneNumber, 'id'>>({ number: '', label: '' });

  // --- Estados para Redes Sociales ---
  const [isSocialModalOpen, setIsSocialModalOpen] = useState(false);
  const [editingSocial, setEditingSocial] = useState<SocialMedia | null>(null);
  const [socialForm, setSocialForm] = useState<Omit<SocialMedia, 'id'>>({ name: socialIconOptions[0]?.label || '', icon: socialIconOptions[0]?.value || '', url: '' });
  
  // --- Estados para Horario de Atención ---
  const [isHoursModalOpen, setIsHoursModalOpen] = useState(false);
  const [editingHours, setEditingHours] = useState<BusinessHours | null>(null);
  const [hoursForm, setHoursForm] = useState<Omit<BusinessHours, 'id'>>({ days: '', hours: '' });


  // --- Manejadores para Teléfonos ---
  const handlePhoneFormChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPhoneForm({ ...phoneForm, [e.target.name]: e.target.value });
  };

  const handleSavePhone = async () => {
    if (!phoneForm.number) { alert("El número es obligatorio."); return; }
    try {
      if (editingPhone && editingPhone.id) {
        if (typeof storeUpdatePhone !== 'function') throw new Error("storeUpdatePhone no es una función");
        await storeUpdatePhone(editingPhone.id, { id: editingPhone.id, ...phoneForm }); // Incluye el id para cumplir con PhoneNumber
      } else {
        if (typeof storeAddPhone !== 'function') throw new Error("storeAddPhone no es una función");
        await storeAddPhone(phoneForm);
      }
      setIsPhoneModalOpen(false);
      setEditingPhone(null);
    } catch (error) { console.error("Error guardando teléfono:", error); alert("Error al guardar teléfono.");}
  };
  
  const openEditPhoneModal = (phone: PhoneNumber) => {
    setEditingPhone(phone);
    setPhoneForm({ number: phone.number, label: phone.label });
    setIsPhoneModalOpen(true); 
  };
  
  const openAddPhoneModal = () => {
    setEditingPhone(null);
    setPhoneForm({ number: '', label: '' });
    setIsPhoneModalOpen(true);
  };

  const handleDeletePhone = async (id: string) => {
    if (typeof storeDeletePhone !== 'function') { alert("Función para eliminar no disponible."); return; }
    if(window.confirm("¿Seguro que quieres eliminar este número?")) {
        try { await storeDeletePhone(id); }
        catch (error) { console.error("Error eliminando teléfono:", error); alert("Error al eliminar teléfono."); }
    }
  }

  // --- Manejadores para Redes Sociales ---
   const handleSocialFormChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === "icon") {
        const selectedOption = socialIconOptions.find(opt => opt.value === value);
        setSocialForm({ ...socialForm, icon: value, name: selectedOption ? selectedOption.label : value });
    } else {
        setSocialForm({ ...socialForm, [name]: value });
    }
  };

  const handleSaveSocial = async () => {
    if (!socialForm.url || !socialForm.icon || !socialForm.name) { alert("El nombre, ícono y URL son obligatorios."); return;}
    try {
      const payload = { name: socialForm.name, icon: socialForm.icon, url: socialForm.url };
      if (editingSocial && editingSocial.id) {
        if (typeof storeUpdateSocial !== 'function') throw new Error("storeUpdateSocial no es una función");
        await storeUpdateSocial(editingSocial.id, { id: editingSocial.id, ...payload });
      } else {
        if (typeof storeAddSocial !== 'function') throw new Error("storeAddSocial no es una función");
        await storeAddSocial(payload);
      }
      setIsSocialModalOpen(false);
      setEditingSocial(null);
    } catch (error) { console.error("Error guardando red social:", error); alert("Error al guardar red social.");}
  };
  
  const openEditSocialModal = (social: SocialMedia) => {
    setEditingSocial(social);
    setSocialForm({ name: social.name, icon: social.icon, url: social.url });
    setIsSocialModalOpen(true);
  };

  const openAddSocialModal = () => {
    setEditingSocial(null);
    setSocialForm({ name: socialIconOptions[0]?.label || '', icon: socialIconOptions[0]?.value || '', url: '' });
    setIsSocialModalOpen(true);
  };

  const handleDeleteSocial = async (id: string) => {
    if (typeof storeDeleteSocial !== 'function') { alert("Función para eliminar no disponible."); return; }
    if(window.confirm("¿Seguro que quieres eliminar esta red social?")) {
        try { await storeDeleteSocial(id); }
        catch (error) { console.error("Error eliminando red social:", error); alert("Error al eliminar red social."); }
    }
  }


  // --- Manejadores para Horario de Atención ---
  const handleHoursFormChange = (e: ChangeEvent<HTMLInputElement>) => {
    setHoursForm({ ...hoursForm, [e.target.name]: e.target.value });
  };

  const handleSaveHours = async () => {
    if (!hoursForm.days || !hoursForm.hours) { alert("Días y horas son obligatorios."); return; }
    try {
        // Si solo hay una entrada de horario que se actualiza, o la primera.
        // Necesitas un ID para el PUT, o tu backend debe saber cómo manejarlo.
        // Asumimos que la acción updateBusinessHours toma el objeto completo, incluido el ID
        const currentHourEntry = editingHours || (businessHours && businessHours.length > 0 ? businessHours[0] : null) || {id: 'default_hours_id'}; // Fallback de ID
        
        if (typeof storeUpdateHours !== 'function') throw new Error("storeUpdateHours no es una función");
        
        await storeUpdateHours(currentHourEntry.id, { days: hoursForm.days, hours: hoursForm.hours });
        setIsHoursModalOpen(false);
        setEditingHours(null);

    } catch (error) { console.error("Error guardando horario:", error); alert("Error al guardar horario.");}
  };

  const openEditHoursModal = (hours: BusinessHours) => {
    setEditingHours(hours);
    setHoursForm({ days: hours.days, hours: hours.hours });
    setIsHoursModalOpen(true); // Necesitarás un isHoursModalOpen
  };
  
  // Suponiendo que "Horario de Atención" es una lista y quieres agregar/eliminar
  const openAddHoursModal = () => {
    setEditingHours(null);
    setHoursForm({ days: '', hours: '' });
    setIsHoursModalOpen(true);
  };

  const handleDeleteHours = async (id: string) => {
    if (typeof storeDeleteHours !== 'function') { alert("Función para eliminar no disponible."); return; }
     if(window.confirm("¿Seguro que quieres eliminar este horario?")) {
        try { await storeDeleteHours(id); }
        catch (error) { console.error("Error eliminando horario:", error); alert("Error al eliminar horario."); }
    }
  };


  const renderSocialIconPreview = (iconKey: string, classes = "h-5 w-5") => {
    const iconOption = socialIconOptions.find(opt => opt.value === iconKey);
    if (iconOption) {
        const IconComponent = iconOption.IconComponent;
        return <IconComponent className={classes} />;
    }
    return <LinkIcon className={classes} />; // Fallback
  };


  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Editar Información de Contacto (Footer)</h1>
      
      <div className="space-y-8">
        {/* Teléfonos */}
        <section className="bg-white rounded-2xl shadow-custom p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-700">Números de Teléfono</h2>
            <button onClick={openAddPhoneModal} className="bg-blue-500 text-white px-3 py-1.5 rounded-lg hover:bg-blue-600 flex items-center text-sm"><PlusCircle size={16} className="mr-1"/>Añadir</button>
          </div>
          {isPhoneModalOpen && (
            <div className="border border-gray-200 p-4 rounded-lg mb-4 space-y-3 bg-gray-50">
              <h3 className="text-md font-medium">{editingPhone ? 'Editar Teléfono' : 'Nuevo Teléfono'}</h3>
              <div>
                <label htmlFor="phone_number" className="text-sm font-medium text-gray-700">Número:</label>
                <input type="text" name="number" id="phone_number" value={phoneForm.number} onChange={handlePhoneFormChange} className="w-full mt-1 p-2 border border-gray-300 rounded-md"/>
              </div>
              <div>
                <label htmlFor="phone_label" className="text-sm font-medium text-gray-700">Etiqueta (Ej: Ventas):</label>
                <input type="text" name="label" id="phone_label" value={phoneForm.label} onChange={handlePhoneFormChange} className="w-full mt-1 p-2 border border-gray-300 rounded-md"/>
              </div>
              <div className="flex justify-end space-x-2">
                <button onClick={() => {setIsPhoneModalOpen(false); setEditingPhone(null);}} className="px-3 py-1.5 border rounded text-sm hover:bg-gray-100">Cancelar</button>
                <button onClick={handleSavePhone} className="px-3 py-1.5 bg-green-500 text-white rounded text-sm hover:bg-green-600">Guardar</button>
              </div>
            </div>
          )}
          <ul className="space-y-1">
            {phoneNumbers.map((phone) => (
              <li key={phone.id} className="flex justify-between items-center p-2 hover:bg-gray-50 rounded">
                <div className="flex items-center"><Phone size={16} className="mr-2 text-primary-500"/> {phone.number} {phone.label && <span className="text-xs text-gray-500 ml-2">({phone.label})</span>}</div>
                <div className="space-x-2">
                  <button onClick={() => openEditPhoneModal(phone)} className="p-1 text-blue-600 hover:text-blue-800"><Edit3 size={16}/></button>
                  <button onClick={() => handleDeletePhone(phone.id)} className="p-1 text-red-600 hover:text-red-800"><Trash2 size={16}/></button>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* Redes Sociales */}
        <section className="bg-white rounded-2xl shadow-custom p-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-700">Redes Sociales</h2>
                <button onClick={openAddSocialModal} className="bg-blue-500 text-white px-3 py-1.5 rounded-lg hover:bg-blue-600 flex items-center text-sm"><PlusCircle size={16} className="mr-1"/>Añadir</button>
            </div>
            {isSocialModalOpen && (
                <div className="border border-gray-200 p-4 rounded-lg mb-4 space-y-3 bg-gray-50">
                <h3 className="text-md font-medium">{editingSocial ? 'Editar Red Social' : 'Nueva Red Social'}</h3>
                <div>
                    <label htmlFor="social_icon" className="text-sm font-medium text-gray-700">Plataforma:</label>
                    <select name="icon" id="social_icon" value={socialForm.icon} onChange={handleSocialFormChange} className="w-full mt-1 p-2 border border-gray-300 rounded-md bg-white">
                        {socialIconOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                    </select>
                </div>
                <div>
                    <label htmlFor="social_url" className="text-sm font-medium text-gray-700">URL:</label>
                    <input type="url" name="url" id="social_url" value={socialForm.url} onChange={handleSocialFormChange} placeholder="https://www.facebook.com/tu_pagina" className="w-full mt-1 p-2 border border-gray-300 rounded-md"/>
                </div>
                <div className="flex justify-end space-x-2">
                    <button onClick={() => {setIsSocialModalOpen(false); setEditingSocial(null);}} className="px-3 py-1.5 border rounded text-sm hover:bg-gray-100">Cancelar</button>
                    <button onClick={handleSaveSocial} className="px-3 py-1.5 bg-green-500 text-white rounded text-sm hover:bg-green-600">Guardar</button>
                </div>
                </div>
            )}
             <ul className="space-y-1">
                {socialMedia.map((social) => (
                <li key={social.id} className="flex justify-between items-center p-2 hover:bg-gray-50 rounded">
                    <div className="flex items-center">{renderSocialIconPreview(social.icon, "h-5 w-5 mr-2 text-primary-500")} <a href={social.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm">{social.name}</a></div>
                    <div className="space-x-2">
                    <button onClick={() => openEditSocialModal(social)} className="p-1 text-blue-600 hover:text-blue-800"><Edit3 size={16}/></button>
                    <button onClick={() => handleDeleteSocial(social.id)} className="p-1 text-red-600 hover:text-red-800"><Trash2 size={16}/></button>
                    </div>
                </li>
                ))}
            </ul>
        </section>

        {/* Horario de Atención */}
        <section className="bg-white rounded-2xl shadow-custom p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-700">Horario de Atención</h2>
            {/* Botón para añadir si businessHours es un array y se permite más de uno, o editar el existente */}
            {businessHours && businessHours.length > 0 ? (
                 <button onClick={() => openEditHoursModal(businessHours[0])} className="text-blue-500 hover:text-blue-700"><Edit3 size={16}/></button>
            ) : (
                 <button onClick={openAddHoursModal} className="bg-blue-500 text-white px-3 py-1.5 rounded-lg hover:bg-blue-600 flex items-center text-sm"><PlusCircle size={16} className="mr-1"/>Añadir Horario</button>
            )}
          </div>
          {isHoursModalOpen && (
            <div className="border border-gray-200 p-4 rounded-lg mb-4 space-y-3 bg-gray-50">
              <h3 className="text-md font-medium">{editingHours ? 'Editar Horario' : 'Nuevo Horario'}</h3>
              <div>
                <label htmlFor="hours_days" className="text-sm font-medium text-gray-700">Días (Ej: Lun-Vie):</label>
                <input type="text" name="days" id="hours_days" value={hoursForm.days} onChange={handleHoursFormChange} className="w-full mt-1 p-2 border border-gray-300 rounded-md"/>
              </div>
              <div>
                <label htmlFor="hours_time" className="text-sm font-medium text-gray-700">Horas (Ej: 9:00-18:00):</label>
                <input type="text" name="hours" id="hours_time" value={hoursForm.hours} onChange={handleHoursFormChange} className="w-full mt-1 p-2 border border-gray-300 rounded-md"/>
              </div>
              <div className="flex justify-end space-x-2">
                <button onClick={() => {setIsHoursModalOpen(false); setEditingHours(null);}} className="px-3 py-1.5 border rounded text-sm hover:bg-gray-100">Cancelar</button>
                <button onClick={handleSaveHours} className="px-3 py-1.5 bg-green-500 text-white rounded text-sm hover:bg-green-600">Guardar Horario</button>
              </div>
            </div>
          )}
          <ul className="space-y-1">
            {businessHours.map((hoursEntry) => ( // Mapear si es un array
              <li key={hoursEntry.id} className="flex items-center p-2">
                <Clock size={16} className="mr-2 text-primary-500"/> {hoursEntry.days}: {hoursEntry.hours}
                {/* Si quisieras botones de editar/eliminar para cada entrada de horario, irían aquí */}
              </li>
            ))}
             {businessHours?.length === 0 && !isHoursModalOpen && (
                <p className="text-center py-4 text-gray-500 text-sm">No hay horario de atención definido.</p>
            )}
          </ul>
        </section>
      </div>
    </div>
  );
};

export default EditContact;