// src/pages/admin/Categories.tsx (CORREGIDO CON HTTPS)

import { useState } from 'react';
import { Plus, Edit3, Trash2, Save, X } from 'lucide-react';
import { useCategories } from '../../hooks/useData';
import { Category } from '../../lib/supabase';

// CORRECCIÓN: Aseguramos que la URL base use HTTPS
const BASE_API_URL = 'https://alejandrosabater.com.ar/api';

export default function Categories() {
  const { categories, loading, refetch } = useCategories();
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [name, setName] = useState('');

  const resetForm = () => {
    setIsFormOpen(false);
    setEditingCategory(null);
    setName('');
  };

  const handleAddNew = () => {
    resetForm();
    setIsFormOpen(true);
  };

  const handleEdit = (category: Category) => {
    resetForm();
    setEditingCategory(category);
    setName(category.name);
    setIsFormOpen(true);
  };

  const handleDelete = async (categoryId: string) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar esta categoría?')) return;
    
    try {
      const response = await fetch(`${BASE_API_URL}/deleteCategory.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: categoryId }),
      });
      const result = await response.json();
      if (!response.ok || result.error) throw new Error(result.error);
      
      alert('Categoría eliminada con éxito.');
      refetch();
    } catch (error) {
      alert(`Error al eliminar la categoría: ${error}`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setSubmitting(true);
    let url = '';
    let body = {};

    if (editingCategory) {
      url = `${BASE_API_URL}/updateCategory.php`;
      body = { id: editingCategory.id, name: name.trim() };
    } else {
      url = `${BASE_API_URL}/createCategory.php`;
      body = { name: name.trim() };
    }
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const result = await response.json();
      if (!response.ok || result.error) throw new Error(result.error);
      
      alert(`Categoría ${editingCategory ? 'actualizada' : 'creada'} con éxito.`);
      resetForm();
      refetch();
    } catch (error) {
      console.error('Error saving category:', error);
      alert(`Error al guardar la categoría: ${error}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Categorías</h1>
        {!isFormOpen && (
          <button onClick={handleAddNew} className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2">
            <Plus size={20} />
            <span>Nueva Categoría</span>
          </button>
        )}
      </div>

      {isFormOpen && (
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-6">{editingCategory ? 'Editar Categoría' : 'Añadir Nueva Categoría'}</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">Nombre de la categoría</label>
              <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg" required />
            </div>
            <div className="flex space-x-3">
              <button type="submit" disabled={submitting} className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 flex items-center space-x-2 disabled:opacity-50">
                <Save size={16} />
                <span>{submitting ? 'Guardando...' : 'Guardar'}</span>
              </button>
              <button type="button" onClick={resetForm} className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 flex items-center space-x-2">
                <X size={16} />
                <span>Cancelar</span>
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? <p>Cargando...</p> : categories.map((category) => (
          <div key={category.id} className="bg-white rounded-2xl shadow-lg p-6 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-800">{category.name}</h3>
            <div className="flex space-x-2">
                <button onClick={() => handleEdit(category)} className="p-2 text-blue-600 hover:text-blue-900"><Edit3 size={18} /></button>
                <button onClick={() => handleDelete(category.id)} className="p-2 text-red-600 hover:text-red-900"><Trash2 size={18} /></button>
            </div>
          </div>
        ))}
      </div>

       {categories.length === 0 && !loading && !isFormOpen && (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">No hay categorías creadas aún.</p>
        </div>
      )}
    </div>
  );
}