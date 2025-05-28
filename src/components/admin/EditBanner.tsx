import React, { useState } from 'react';
import { useWebsiteStore } from '../../store/useWebsiteStore';
import { Plus, Trash, Edit, Check, X, Image } from 'lucide-react';

const EditBanner: React.FC = () => {
  const { bannerSlides, updateBannerSlides, addBannerSlide, removeBannerSlide } = useWebsiteStore();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingSlide, setEditingSlide] = useState<any>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [newSlide, setNewSlide] = useState({
    image: '',
    title: '',
    subtitle: '',
  });

  const handleEdit = (slide: any) => {
    setEditingId(slide.id);
    setEditingSlide({ ...slide });
  };

  const handleSave = () => {
    if (editingSlide) {
      const newSlides = bannerSlides.map(slide =>
        slide.id === editingId ? editingSlide : slide
      );
      updateBannerSlides(newSlides);
      setEditingId(null);
      setEditingSlide(null);
    }
  };

  const handleAdd = () => {
    if (newSlide.image && newSlide.title) {
      addBannerSlide({
        id: Date.now().toString(),
        ...newSlide
      });
      setNewSlide({
        image: '',
        title: '',
        subtitle: '',
      });
      setIsAdding(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Editar Banner</h1>
      
      <div className="bg-white rounded-2xl shadow-custom p-6">
        <div className="mb-4 flex justify-end">
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center px-3 py-2 rounded-lg bg-primary-500 text-white hover:bg-primary-400"
          >
            <Plus className="h-4 w-4 mr-1" />
            <span>Agregar Slide</span>
          </button>
        </div>

        {isAdding && (
          <div className="border border-gray-200 rounded-xl p-4 mb-4">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">URL de la Imagen</label>
                <input
                  type="text"
                  value={newSlide.image}
                  onChange={(e) => setNewSlide({ ...newSlide, image: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
                <input
                  type="text"
                  value={newSlide.title}
                  onChange={(e) => setNewSlide({ ...newSlide, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subtítulo</label>
                <input
                  type="text"
                  value={newSlide.subtitle}
                  onChange={(e) => setNewSlide({ ...newSlide, subtitle: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setIsAdding(false)}
                  className="px-3 py-1 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleAdd}
                  className="px-3 py-1 rounded-lg bg-primary-500 text-white hover:bg-primary-400"
                >
                  Agregar
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {bannerSlides.map((slide) => (
            <div key={slide.id} className="border border-gray-200 rounded-xl p-4">
              {editingId === slide.id ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">URL de la Imagen</label>
                    <input
                      type="text"
                      value={editingSlide.image}
                      onChange={(e) => setEditingSlide({ ...editingSlide, image: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
                    <input
                      type="text"
                      value={editingSlide.title}
                      onChange={(e) => setEditingSlide({ ...editingSlide, title: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Subtítulo</label>
                    <input
                      type="text"
                      value={editingSlide.subtitle}
                      onChange={(e) => setEditingSlide({ ...editingSlide, subtitle: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => setEditingId(null)}
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
                  <div className="relative aspect-video mb-3">
                    <img
                      src={slide.image}
                      alt={slide.title}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="font-medium">{slide.title}</h3>
                    {slide.subtitle && (
                      <p className="text-sm text-gray-600">{slide.subtitle}</p>
                    )}
                  </div>
                  
                  <div className="flex justify-end space-x-2 mt-3">
                    <button
                      onClick={() => handleEdit(slide)}
                      className="p-1 rounded-full text-blue-600 hover:bg-blue-100"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => removeBannerSlide(slide.id)}
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
    </div>
  );
};

export default EditBanner;