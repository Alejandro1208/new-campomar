// src/pages/admin/Products.tsx (Versión Final con CRUD completo)

import { useState, useEffect } from 'react';
import { Plus, Edit3, Trash2, Save, X, Image as ImageIcon } from 'lucide-react';
import { useProducts, useCategories } from '../../hooks/useData';
import { Product } from '../../lib/supabase'; // Reutilizamos la interfaz

const BASE_API_URL = 'https://alejandrosabater.com.ar/api';

export default function Products() {
  const { products, loading: productsLoading, refetch: refetchProducts } = useProducts();
  const { categories, loading: categoriesLoading } = useCategories();
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [submitting, setSubmitting] = useState(false);
  
  // Estado para el formulario
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  // Efecto para la previsualización de la imagen
  useEffect(() => {
    if (logoFile) {
      const objectUrl = URL.createObjectURL(logoFile);
      setPreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    } else if (editingProduct?.logo_image_url) {
      // Si estamos editando y no hemos seleccionado un archivo nuevo, mostramos la imagen actual
      setPreview(`https://alejandrosabater.com.ar${editingProduct.logo_image_url}`);
    } else {
      setPreview(null);
    }
  }, [logoFile, editingProduct]);
  
  const resetForm = () => {
    setName('');
    setDescription('');
    setCategoryId('');
    setLogoFile(null);
    setPreview(null);
    setEditingProduct(null);
    setIsFormOpen(false);
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setLogoFile(e.target.files[0]);
    }
  };
  
  const handleAddNew = () => {
    resetForm();
    setIsFormOpen(true);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setName(product.name);
    setDescription(product.description);
    setCategoryId(product.category_id || '');
    setIsFormOpen(true);
  };

  const handleDelete = async (productId: string) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar este producto? Esta acción no se puede deshacer.')) return;
    
    try {
      const response = await fetch(`${BASE_API_URL}/deleteProduct.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: productId }),
      });
      const result = await response.json();
      if (!response.ok || result.error) throw new Error(result.error);
      
      alert('Producto eliminado con éxito.');
      refetchProducts();
    } catch (error) {
      alert(`Error al eliminar el producto: ${error}`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !categoryId) {
      alert('Nombre y Categoría son requeridos.');
      return;
    }
    // El logo solo es requerido si estamos creando un nuevo producto
    if (!editingProduct && !logoFile) {
      alert('El logo es requerido para un nuevo producto.');
      return;
    }

    setSubmitting(true);
    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('category_id', categoryId);
    
    let url = '';
    if (editingProduct) {
      url = `${BASE_API_URL}/updateProduct.php`;
      formData.append('id', editingProduct.id); // Añadimos el ID para la actualización
    } else {
      url = `${BASE_API_URL}/createProduct.php`;
    }

    if (logoFile) {
      formData.append('logo', logoFile);
    }

    try {
      const response = await fetch(url, {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      if (!response.ok || result.error) throw new Error(result.error || 'Error en el servidor');

      alert(`¡Producto ${editingProduct ? 'actualizado' : 'creado'} con éxito!`);
      resetForm();
      refetchProducts();
    } catch (error) {
      console.error('Error submitting product:', error);
      alert(`Error al guardar el producto: ${error}`);
    } finally {
      setSubmitting(false);
    }
  };

  const isLoading = productsLoading || categoriesLoading;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Productos</h1>
        {!isFormOpen && (
          <button onClick={handleAddNew} className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-300 flex items-center space-x-2">
            <Plus size={20} />
            <span>Nuevo Producto</span>
          </button>
        )}
      </div>

      {isFormOpen && (
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-6">{editingProduct ? 'Editar Producto' : 'Añadir Nuevo Producto'}</h3>
          {/* El resto del formulario es igual que antes, el código de React es lo suficientemente inteligente para manejar la edición */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">Nombre del Producto/Marca</label>
                <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg" required />
              </div>
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">Categoría</label>
                <select id="category" value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg" required>
                  <option value="" disabled>Selecciona una categoría</option>
                  {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">Descripción</label>
              <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="w-full px-4 py-2 border border-gray-300 rounded-lg"></textarea>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Logo del Producto {editingProduct && '(Opcional: solo si quieres cambiarlo)'}</label>
              <div className="mt-2 flex items-center gap-x-3">
                <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed">
                  {preview ? <img src={preview} alt="Vista previa" className="h-full w-full object-contain" /> : <ImageIcon className="h-8 w-8 text-gray-400" />}
                </div>
                <input type="file" onChange={handleFileChange} className="block text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-primary hover:file:bg-blue-100" accept="image/png, image/jpeg, image/jpg" />
              </div>
            </div>
            <div className="flex space-x-4 pt-4 border-t">
              <button type="submit" disabled={submitting} className="bg-green-500 text-white px-4 py-2 rounded-lg flex items-center space-x-2 disabled:opacity-50">
                <Save size={16} />
                <span>{submitting ? 'Guardando...' : (editingProduct ? 'Actualizar Producto' : 'Guardar Producto')}</span>
              </button>
              <button type="button" onClick={resetForm} className="bg-gray-500 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
                <X size={16} />
                <span>Cancelar</span>
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Logo</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Categoría</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {isLoading ? (
              <tr><td colSpan={4} className="text-center py-8">Cargando productos...</td></tr>
            ) : products.map(product => (
              <tr key={product.id}>
                <td className="px-6 py-4">
                  <img src={`https://alejandrosabater.com.ar${product.logo_image_url}`} alt={product.name} className="h-10 w-10 object-contain bg-gray-50 p-1 rounded" />
                </td>
                <td className="px-6 py-4 font-medium text-gray-900">{product.name}</td>
                <td className="px-6 py-4 text-gray-500">{product.category?.name || 'N/A'}</td>
                <td className="px-6 py-4">
                  <div className="flex space-x-2">
                    <button onClick={() => handleEdit(product)} className="text-blue-600 hover:text-blue-900 p-1"><Edit3 size={18} /></button>
                    <button onClick={() => handleDelete(product.id)} className="text-red-600 hover:text-red-900 p-1"><Trash2 size={18} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}