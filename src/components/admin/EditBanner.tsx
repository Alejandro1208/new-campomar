import React, { useState, useEffect, ChangeEvent } from 'react';
import { useWebsiteStore } from '../../store/useWebsiteStore';
import { BannerSlide } from '../../types'; // Asegúrate que BannerSlide incluya los campos CTA
import { databaseService } from '../../services/databaseService';
import { PlusCircle, Edit3, Trash2, Save, XCircle, ImageUp, AlertTriangle } from 'lucide-react';

// Tipo para el formulario, id es opcional para nuevos slides
type BannerSlideFormData = Omit<BannerSlide, 'id' | 'image'> & { 
  id?: string;
  image: string; // Almacenará la ruta del archivo de imagen devuelta por el backend
};

const EditBanner: React.FC = () => {
  const { 
    bannerSlides, 
    addBannerSlide, 
    updateBannerSlide, 
    deleteBannerSlide 
  } = useWebsiteStore((state) => ({
    bannerSlides: state.bannerSlides,
    addBannerSlide: state.addBannerSlide,
    updateBannerSlide: state.updateBannerSlide,
    deleteBannerSlide: state.deleteBannerSlide,
  }));

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSlide, setEditingSlide] = useState<BannerSlide | null>(null);
  const [formData, setFormData] = useState<BannerSlideFormData>({
    title: '',
    subtitle: '',
    image: '', // Ruta de la imagen guardada
    cta_text: '',
    cta_url: '',
    cta_is_visible: false,
  });

  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (isModalOpen && editingSlide) {
      setFormData({
        id: editingSlide.id,
        title: editingSlide.title,
        subtitle: editingSlide.subtitle,
        image: editingSlide.image, // Ruta de la imagen existente
        cta_text: editingSlide.cta_text || '',
        cta_url: editingSlide.cta_url || '',
        cta_is_visible: editingSlide.cta_is_visible || false,
      });
      setImagePreview(editingSlide.image ? `http://localhost:3001${editingSlide.image}` : null);
    } else if (isModalOpen && !editingSlide) {
      // Resetear para nuevo slide
      setFormData({
        title: '',
        subtitle: '',
        image: '',
        cta_text: '',
        cta_url: '',
        cta_is_visible: false,
      });
      setImagePreview(null);
    }
    setSelectedImageFile(null); // Siempre limpiar el archivo seleccionado al abrir/cambiar modal
    setFormError(null);
  }, [isModalOpen, editingSlide]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const target = e.target as HTMLInputElement; // Para acceder a 'checked' en checkboxes
    const { name, value, type } = target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? target.checked : value,
    }));
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImageFile(file);
      setFormError(null);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setFormData(prev => ({ ...prev, image: '' })); // Limpiar ruta de imagen anterior del form
    } else {
      setSelectedImageFile(null);
      // Restaurar vista previa a la imagen existente si se está editando
      if (editingSlide && editingSlide.image) {
        setImagePreview(`http://localhost:3001${editingSlide.image}`);
      } else {
        setImagePreview(null);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!formData.title) {
      setFormError("El título es obligatorio.");
      return;
    }

    let imagePathToSave = formData.image; // Usar imagen existente o la que ya se subió

    if (selectedImageFile) { // Si se seleccionó un nuevo archivo de imagen
      setIsUploading(true);
      try {
        const uploadResponse = await databaseService.fuploadBannerImageFile(selectedImageFile);
        imagePathToSave = uploadResponse.filePath; // Actualizar con la ruta del archivo recién subido
      } catch (error: any) {
        console.error("Error al subir la imagen del banner:", error);
        setFormError(error.message || "Error al subir la imagen.");
        setIsUploading(false);
        return; 
      } finally {
        setIsUploading(false);
      }
    }
    
    if (!imagePathToSave && !editingSlide?.image) { // Si no hay imagen nueva ni existente (para un nuevo slide)
        setFormError("La imagen es obligatoria para un nuevo slide.");
        return;
    }

    const slideDataToSave: BannerSlideFormData = {
      ...formData,
      image: imagePathToSave, // Este es el string de la ruta que se guarda
    };

    // Quitar id si es un nuevo slide para que coincida con Omit<BannerSlide, 'id'>
    const payload = editingSlide ? slideDataToSave as BannerSlide 
                                 : { title: slideDataToSave.title, 
                                     subtitle: slideDataToSave.subtitle, 
                                     image: slideDataToSave.image, 
                                     cta_text: slideDataToSave.cta_text, 
                                     cta_url: slideDataToSave.cta_url, 
                                     cta_is_visible: slideDataToSave.cta_is_visible 
                                   } as Omit<BannerSlide, 'id'>;

    try {
      if (editingSlide && editingSlide.id) {
        if (typeof updateBannerSlide !== 'function') throw new Error("Función updateBannerSlide no disponible");
        await updateBannerSlide(editingSlide.id, payload as Partial<BannerSlide>);
      } else {
        if (typeof addBannerSlide !== 'function') throw new Error("Función addBannerSlide no disponible");
        await addBannerSlide(payload as Omit<BannerSlide, 'id'>);
      }
      setIsModalOpen(false);
      setEditingSlide(null);
    } catch (error: any) {
      console.error("Error al guardar el slide del banner:", error);
      setFormError(error.message || "Error al guardar el slide.");
    }
  };

  const openEditModal = (slide: BannerSlide) => {
    setEditingSlide(slide);
    setIsModalOpen(true);
  };

  const openAddModal = () => {
    setEditingSlide(null);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (typeof deleteBannerSlide !== 'function') {
        alert('Error: La función para eliminar no está disponible.');
        return;
    }
    if (window.confirm('¿Estás seguro de que quieres eliminar este slide del banner?')) {
      try {
        await deleteBannerSlide(id);
        // Opcional: Lógica para eliminar el archivo de imagen del servidor aquí si es necesario
      } catch (error) {
        console.error("Error al eliminar el slide del banner:", error);
        alert("Error al eliminar el slide. Revisa la consola.");
      }
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Editar Slides del Banner Principal</h1>
        <button
          onClick={openAddModal}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center"
        >
          <PlusCircle size={18} className="mr-2" /> Añadir Slide
        </button>
      </div>

      {/* Lista de Slides */}
      <div className="space-y-4">
        {(bannerSlides || []).map((slide) => (
          <div key={slide.id} className="bg-white p-4 rounded-lg shadow-md flex items-start space-x-4">
            {slide.image && (
              <img 
                src={`http://localhost:3001${slide.image}`} 
                alt={slide.title || 'Slide image'} 
                className="w-32 h-20 object-cover rounded"
              />
            )}
            <div className="flex-grow">
              <h3 className="text-lg font-semibold text-gray-800">{slide.title}</h3>
              <p className="text-sm text-gray-600">{slide.subtitle}</p>
              {slide.cta_text && (
                <div className="mt-1 text-xs">
                  <span className={`font-medium ${slide.cta_is_visible ? 'text-green-600' : 'text-red-600'}`}>
                    CTA: {slide.cta_is_visible ? 'Visible' : 'Oculto'}
                  </span> - 
                  <span> "{slide.cta_text}" ({slide.cta_url})</span>
                </div>
              )}
            </div>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 items-end">
              <button onClick={() => openEditModal(slide)} className="p-2 text-blue-600 hover:text-blue-800" title="Editar Slide"><Edit3 size={18} /></button>
              <button onClick={() => handleDelete(slide.id)} className="p-2 text-red-600 hover:text-red-800" title="Eliminar Slide"><Trash2 size={18} /></button>
            </div>
          </div>
        ))}
        {(bannerSlides?.length === 0) && (
             <p className="text-center py-4 text-gray-500">No hay slides en el banner. Añade uno nuevo.</p>
        )}
      </div>

      {/* Modal para Añadir/Editar Slide */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-gray-600 bg-opacity-75 flex justify-center items-center p-4">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-3 border-b">
              <h3 className="text-xl font-semibold">{editingSlide ? 'Editar Slide' : 'Añadir Nuevo Slide'}</h3>
              <button onClick={() => {setIsModalOpen(false); setEditingSlide(null);}} className="text-gray-400 hover:text-gray-600"><XCircle size={24} /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4 pt-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">Título del Slide</label>
                <input type="text" name="title" id="title" value={formData.title} onChange={handleInputChange} required className="mt-1 w-full p-2 border rounded-md"/>
              </div>
              <div>
                <label htmlFor="subtitle" className="block text-sm font-medium text-gray-700">Subtítulo del Slide</label>
                <textarea name="subtitle" id="subtitle" value={formData.subtitle} onChange={handleInputChange} rows={2} className="mt-1 w-full p-2 border rounded-md"></textarea>
              </div>
              <div>
                <label htmlFor="bannerImageFile" className="block text-sm font-medium text-gray-700">Imagen del Slide</label>
                <input type="file" id="bannerImageFile" accept="image/png, image/jpeg, image/webp" onChange={handleFileChange} className="mt-1 block w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"/>
                {imagePreview && <img src={imagePreview} alt="Vista previa" className="mt-2 h-32 object-contain border rounded"/>}
                {!selectedImageFile && editingSlide?.image && !imagePreview && <img src={`http://localhost:3001${editingSlide.image}`} alt="Imagen actual" className="mt-2 h-32 object-contain border rounded"/>}
              </div>
              <hr/>
              <h4 className="text-md font-semibold text-gray-700 pt-2">Botón de Llamada a la Acción (CTA)</h4>
              <div>
                <label htmlFor="cta_text" className="block text-sm font-medium text-gray-700">Texto del CTA</label>
                <input type="text" name="cta_text" id="cta_text" value={formData.cta_text || ''} onChange={handleInputChange} placeholder="Ej: Ver Más" className="mt-1 w-full p-2 border rounded-md"/>
              </div>
              <div>
                <label htmlFor="cta_url" className="block text-sm font-medium text-gray-700">URL del CTA</label>
                <input type="text" name="cta_url" id="cta_url" value={formData.cta_url || ''} onChange={handleInputChange} placeholder="Ej: /productos o https://..." className="mt-1 w-full p-2 border rounded-md"/>
              </div>
              <div className="flex items-center">
                <input id="cta_is_visible" name="cta_is_visible" type="checkbox" checked={formData.cta_is_visible || false} onChange={handleInputChange} className="h-4 w-4 text-indigo-600 border-gray-300 rounded"/>
                <label htmlFor="cta_is_visible" className="ml-2 block text-sm text-gray-900">Mostrar CTA en este slide</label>
              </div>
              
              {formError && <p className="text-sm text-red-600 flex items-center"><AlertTriangle size={16} className="mr-1"/> {formError}</p>}

              <div className="pt-3 flex justify-end space-x-3 border-t mt-5">
                <button type="button" onClick={() => {setIsModalOpen(false); setEditingSlide(null);}} className="px-4 py-2 text-sm rounded-md border hover:bg-gray-50">Cancelar</button>
                <button type="submit" disabled={isUploading} className={`px-4 py-2 text-sm text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:opacity-50 ${isUploading ? 'cursor-not-allowed' : ''}`}>
                  {isUploading ? 'Guardando...' : (editingSlide ? 'Actualizar Slide' : 'Crear Slide')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditBanner;