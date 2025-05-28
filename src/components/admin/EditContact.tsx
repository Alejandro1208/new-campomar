import React, { useState } from 'react';
import { useWebsiteStore } from '../../store/useWebsiteStore';
import { Plus, Trash, Edit, Check, X, Phone, Facebook, Instagram, Clock } from 'lucide-react';

const EditContact: React.FC = () => {
  const {
    phoneNumbers,
    updatePhoneNumbers,
    socialMedia,
    updateSocialMedia,
    businessHours,
    updateBusinessHours
  } = useWebsiteStore();

  // Estado para teléfonos
  const [isAddingPhone, setIsAddingPhone] = useState(false);
  const [newPhone, setNewPhone] = useState({ number: '', label: '' });
  const [editingPhoneId, setEditingPhoneId] = useState<string | null>(null);
  const [editingPhone, setEditingPhone] = useState<any>(null);

  // Estado para redes sociales
  const [editingSocialId, setEditingSocialId] = useState<string | null>(null);
  const [editingSocial, setEditingSocial] = useState<any>(null);

  // Estado para horario
  const [isEditingHours, setIsEditingHours] = useState(false);
  const [editedHours, setEditedHours] = useState(businessHours);

  // Manejadores para teléfonos
  const handleAddPhone = () => {
    if (newPhone.number) {
      const newPhones = [
        ...phoneNumbers,
        { id: Date.now().toString(), ...newPhone }
      ];
      updatePhoneNumbers(newPhones);
      setNewPhone({ number: '', label: '' });
      setIsAddingPhone(false);
    }
  };

  const handleSavePhone = () => {
    if (editingPhone) {
      const newPhones = phoneNumbers.map(phone =>
        phone.id === editingPhoneId ? editingPhone : phone
      );
      updatePhoneNumbers(newPhones);
      setEditingPhoneId(null);
      setEditingPhone(null);
    }
  };

  const handleDeletePhone = (id: string) => {
    const newPhones = phoneNumbers.filter(phone => phone.id !== id);
    updatePhoneNumbers(newPhones);
  };

  // Manejadores para redes sociales
  const handleSaveSocial = () => {
    if (editingSocial) {
      const newSocials = socialMedia.map(social =>
        social.id === editingSocialId ? editingSocial : social
      );
      updateSocialMedia(newSocials);
      setEditingSocialId(null);
      setEditingSocial(null);
    }
  };

  // Manejadores para horario
  const handleSaveHours = () => {
    updateBusinessHours(editedHours);
    setIsEditingHours(false);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Editar Información de Contacto</h1>
      
      <div className="space-y-6">
        {/* Teléfonos */}
        <div className="bg-white rounded-2xl shadow-custom p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Teléfonos</h2>
            <button
              onClick={() => setIsAddingPhone(true)}
              className="flex items-center px-3 py-2 rounded-lg bg-primary-500 text-white hover:bg-primary-400"
            >
              <Plus className="h-4 w-4 mr-1" />
              <span>Agregar Teléfono</span>
            </button>
          </div>

          {isAddingPhone && (
            <div className="border border-gray-200 rounded-xl p-4 mb-4">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Número</label>
                  <input
                    type="text"
                    value={newPhone.number}
                    onChange={(e) => setNewPhone({ ...newPhone, number: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Etiqueta</label>
                  <input
                    type="text"
                    value={newPhone.label}
                    onChange={(e) => setNewPhone({ ...newPhone, label: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => setIsAddingPhone(false)}
                    className="px-3 py-1 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleAddPhone}
                    className="px-3 py-1 rounded-lg bg-primary-500 text-white hover:bg-primary-400"
                  >
                    Agregar
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-4">
            {phoneNumbers.map((phone) => (
              <div key={phone.id} className="border border-gray-200 rounded-xl p-4">
                {editingPhoneId === phone.id ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Número</label>
                      <input
                        type="text"
                        value={editingPhone.number}
                        onChange={(e) => setEditingPhone({ ...editingPhone, number: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Etiqueta</label>
                      <input
                        type="text"
                        value={editingPhone.label}
                        onChange={(e) => setEditingPhone({ ...editingPhone, label: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                    
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => setEditingPhoneId(null)}
                        className="px-3 py-1 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100"
                      >
                        <X className="h-4 w-4" />
                      </button>
                      <button
                        onClick={handleSavePhone}
                        className="px-3 py-1 rounded-lg bg-primary-500 text-white hover:bg-primary-400"
                      >
                        <Check className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Phone className="h-4 w-4 text-primary-500" />
                      <span>{phone.number}</span>
                      {phone.label && (
                        <span className="text-sm text-gray-500">({phone.label})</span>
                      )}
                    </div>
                    
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          setEditingPhoneId(phone.id);
                          setEditingPhone({ ...phone });
                        }}
                        className="p-1 rounded-full text-blue-600 hover:bg-blue-100"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeletePhone(phone.id)}
                        className="p-1 rounded-full text-red-600 hover:bg-red-100"
                      >
                        <Trash className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Redes Sociales */}
        <div className="bg-white rounded-2xl shadow-custom p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Redes Sociales</h2>
          
          <div className="space-y-4">
            {socialMedia.map((social) => (
              <div key={social.id} className="border border-gray-200 rounded-xl p-4">
                {editingSocialId === social.id ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">URL</label>
                      <input
                        type="text"
                        value={editingSocial.url}
                        onChange={(e) => setEditingSocial({ ...editingSocial, url: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                    
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => setEditingSocialId(null)}
                        className="px-3 py-1 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100"
                      >
                        <X className="h-4 w-4" />
                      </button>
                      <button
                        onClick={handleSaveSocial}
                        className="px-3 py-1 rounded-lg bg-primary-500 text-white hover:bg-primary-400"
                      >
                        <Check className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {social.icon === 'facebook' ? (
                        <Facebook className="h-4 w-4 text-primary-500" />
                      ) : (
                        <Instagram className="h-4 w-4 text-primary-500" />
                      )}
                      <span>{social.name}</span>
                      <a
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary-500 hover:underline"
                      >
                        {social.url}
                      </a>
                    </div>
                    
                    <button
                      onClick={() => {
                        setEditingSocialId(social.id);
                        setEditingSocial({ ...social });
                      }}
                      className="p-1 rounded-full text-blue-600 hover:bg-blue-100"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Horario */}
        <div className="bg-white rounded-2xl shadow-custom p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Horario de Atención</h2>
            {!isEditingHours && (
              <button
                onClick={() => setIsEditingHours(true)}
                className="p-1 rounded-full text-blue-600 hover:bg-blue-100"
              >
                <Edit className="h-4 w-4" />
              </button>
            )}
          </div>
          
          {isEditingHours ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Días</label>
                <input
                  type="text"
                  value={editedHours.days}
                  onChange={(e) => setEditedHours({ ...editedHours, days: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Horario</label>
                <input
                  type="text"
                  value={editedHours.hours}
                  onChange={(e) => setEditedHours({ ...editedHours, hours: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setIsEditingHours(false)}
                  className="px-3 py-1 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100"
                >
                  <X className="h-4 w-4" />
                </button>
                <button
                  onClick={handleSaveHours}
                  className="px-3 py-1 rounded-lg bg-primary-500 text-white hover:bg-primary-400"
                >
                  <Check className="h-4 w-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              <Clock className="h-4 w-4 text-primary-500" />
              <div>
                <p>{businessHours.days}</p>
                <p className="text-gray-600">{businessHours.hours}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditContact;