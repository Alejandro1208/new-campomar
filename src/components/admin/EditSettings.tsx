import React, { useState } from 'react';
import { useWebsiteStore } from '../../store/useWebsiteStore';
import { Edit, Check, X, Image } from 'lucide-react';

const EditSettings: React.FC = () => {
  const { logo, updateLogo } = useWebsiteStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editedLogo, setEditedLogo] = useState(logo);

  const handleSave = () => {
    updateLogo(editedLogo);
    setIsEditing(false);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Configuración</h1>
      
      <div className="bg-white rounded-2xl shadow-custom p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Logo</h2>
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
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">URL del Logo</label>
              <input
                type="text"
                value={editedLogo}
                onChange={(e) => setEditedLogo(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Ingrese la URL del logo"
              />
            </div>
            
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
          <div>
            <div className="mb-4">
              <p className="text-sm text-gray-600 break-all">{logo}</p>
            </div>
            
            <div className="border border-gray-200 rounded-xl p-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Vista Previa</h3>
              <div className="flex items-center justify-center bg-gray-100 rounded-lg p-4">
                <img
                  src={logo}
                  alt="Logo de la empresa"
                  className="h-16 w-16 object-contain"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditSettings;