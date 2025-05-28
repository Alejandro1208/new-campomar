import React, { useState } from 'react';
import { useWebsiteStore } from '../../store/useWebsiteStore';
import { Plus, Trash, Edit, Check, X, Image } from 'lucide-react';

const EditCompany: React.FC = () => {
  const { companyInfo, updateCompanyTitle, updateCompanyDescription, updateCompanyImages } = useWebsiteStore();
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [editedTitle, setEditedTitle] = useState(companyInfo.title);
  const [editedDescription, setEditedDescription] = useState(companyInfo.description);
  const [isAddingImage, setIsAddingImage] = useState(false);
  const [newImage, setNewImage] = useState({ src: '', alt: '' });

  const handleSaveTitle = () => {
    updateCompanyTitle(editedTitle);
    setIsEditingTitle(false);
  };

  const handleSaveDescription = () => {
    updateCompanyDescription(editedDescription);
    setIsEditingDescription(false);
  };

  const handleAddImage = () => {
    if (newImage.src && newImage.alt) {
      const newImages = [
        ...companyInfo.images,
        { id: Date.now().toString(), ...newImage }
      ];
      updateCompanyImages(newImages);
      setNewImage({ src: '', alt: '' });
      setIsAddingImage(false);
    }
  };

  const handleRemoveImage = (id: string) => {
    const newImages = companyInfo.images.filter(img => img.id !== id);
    updateCompanyImages(newImages);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Editar Información de la Empresa</h1>
      
      <div className="bg-white rounded-2xl shadow-custom p-6">
        {/* Título */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-semibold text-gray-800">Título</h2>
            <button
              onClick={() => setIsEditingTitle(!isEditingTitle)}
              className="p-1 rounded-full text-blue-600 hover:bg-blue-100"
            >
              <Edit className="h-4 w-4" />
            </button>
          </div>
          
          {isEditingTitle ? (
            <div className="space-y-2">
              <input
                type="text"
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setIsEditingTitle(false)}
                  className="px-3 py-1 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100"
                >
                  <X className="h-4 w-4" />
                </button>
                <button
                  onClick={handleSaveTitle}
                  className="px-3 py-1 rounded-lg bg-primary-500 text-white hover:bg-primary-400"
                >
                  <Check className="h-4 w-4" />
                </button>
              </div>
            </div>
          ) : (
            <p className="text-gray-700">{companyInfo.title}</p>
          )}
        </div>

        {/* Descripción */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-semibold text-gray-800">Descripción</h2>
            <button
              onClick={() => setIsEditingDescription(!isEditingDescription)}
              className="p-1 rounded-full text-blue-600 hover:bg-blue-100"
            >
              <Edit className="h-4 w-4" />
            </button>
          </div>
          
          {isEditingDescription ? (
            <div className="space-y-2">
              <textarea
                value={editedDescription}
                onChange={(e) => setEditedDescription(e.target.value)}
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setIsEditingDescription(false)}
                  className="px-3 py-1 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100"
                >
                  <X className="h-4 w-4" />
                </button>
                <button
                  onClick={handleSaveDescription}
                  className="px-3 py-1 rounded-lg bg-primary-500 text-white hover:bg-primary-400"
                >
                  <Check className="h-4 w-4" />
                </button>
              </div>
            </div>
          ) : (
            <p className="text-gray-700">{companyInfo.description}</p>
          )}
        </div>

        {/* Imágenes */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Imágenes</h2>
            <button
              onClick={() => setIsAddingImage(true)}
              className="flex items-center px-3 py-2 rounded-lg bg-primary-500 text-white hover:bg-primary-400"
            >
              <Plus className="h-4 w-4 mr-1" />
              <span>Agregar Imagen</span>
            </button>
          </div>

          {isAddingImage && (
            <div className="border border-gray-200 rounded-xl p-4 mb-4">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">URL de la Imagen</label>
                  <input
                    type="text"
                    value={newImage.src}
                    onChange={(e) => setNewImage({ ...newImage, src: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                  <input
                    type="text"
                    value={newImage.alt}
                    onChange={(e) => setNewImage({ ...newImage, alt: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => setIsAddingImage(false)}
                    className="px-3 py-1 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleAddImage}
                    className="px-3 py-1 rounded-lg bg-primary-500 text-white hover:bg-primary-400"
                  >
                    Agregar
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            {companyInfo.images.map((image) => (
              <div key={image.id} className="relative group">
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-48 object-cover rounded-lg"
                />
                <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-lg flex items-center justify-center">
                  <button
                    onClick={() => handleRemoveImage(image.id)}
                    className="p-2 rounded-full bg-red-500 text-white hover:bg-red-600"
                  >
                    <Trash className="h-4 w-4" />
                  </button>
                </div>
                <p className="mt-2 text-sm text-gray-600">{image.alt}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditCompany;