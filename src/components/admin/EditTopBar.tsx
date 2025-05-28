import React, { useState } from 'react';
import { useWebsiteStore } from '../../store/useWebsiteStore';
import { Phone, Mail, MapPin, Clock, Trash, Edit, Check, X } from 'lucide-react';

const iconOptions = [
  { value: 'phone', label: 'Teléfono', icon: <Phone className="h-4 w-4" /> },
  { value: 'mail', label: 'Correo', icon: <Mail className="h-4 w-4" /> },
  { value: 'map-pin', label: 'Ubicación', icon: <MapPin className="h-4 w-4" /> },
  { value: 'clock', label: 'Reloj', icon: <Clock className="h-4 w-4" /> },
];

const EditTopBar: React.FC = () => {
  const { contactInfo, updateContactInfo } = useWebsiteStore();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<any>(null);

  const handleEdit = (item: any) => {
    setEditingId(item.id);
    setEditingItem({ ...item });
  };

  const handleSave = () => {
    if (editingItem) {
      const newContactInfo = contactInfo.map(item =>
        item.id === editingId ? editingItem : item
      );
      updateContactInfo(newContactInfo);
      setEditingId(null);
      setEditingItem(null);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditingItem(null);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Editar Barra Superior</h1>
      
      <div className="bg-white rounded-2xl shadow-custom p-6">
        <div className="space-y-4">
          {contactInfo.map((item) => (
            <div key={item.id} className="border border-gray-200 rounded-xl p-4">
              {editingId === item.id ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Icono</label>
                    <select
                      value={editingItem.icon}
                      onChange={(e) => setEditingItem({ ...editingItem, icon: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      {iconOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Texto</label>
                    <input
                      type="text"
                      value={editingItem.text}
                      onChange={(e) => setEditingItem({ ...editingItem, text: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  
                  <div className="flex items-center">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={editingItem.showOnMobile}
                        onChange={(e) => setEditingItem({ ...editingItem, showOnMobile: e.target.checked })}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700">Mostrar en móvil</span>
                    </label>
                  </div>
                  
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={handleCancel}
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
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {iconOptions.find(option => option.value === item.icon)?.icon}
                    <span>{item.text}</span>
                    {item.showOnMobile && (
                      <span className="text-xs bg-primary-100 text-primary-500 px-2 py-1 rounded-full">
                        Móvil
                      </span>
                    )}
                  </div>
                  
                  <button
                    onClick={() => handleEdit(item)}
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
    </div>
  );
};

export default EditTopBar;