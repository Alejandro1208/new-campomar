import { useState } from 'react';
import { Plus, Edit3, Trash2, Save, X } from 'lucide-react';
import { useCategories } from '../../hooks/useData';
import { supabase } from '../../lib/supabase';

export default function Categories() {
  const { categories, loading, refetch } = useCategories();
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '' });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    setSubmitting(true);
    try {
      if (editingId) {
        // Actualizar categoría existente
        const { error } = await supabase
          .from('categories')
          .update({ name: formData.name.trim() })
          .eq('id', editingId);

        if (error) throw error;
        setEditingId(null);
      } else {
        // Crear nueva categoría
        const { error } = await supabase
          .from('categories')
          .insert([{ name: formData.name.trim() }]);

        if (error) throw error;
        setIsCreating(false);
      }

      setFormData({ name: '' });
      refetch();
    } catch (error) {
      console.error('Error saving category:', error);
      alert('Error al guardar la categoría');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (category: any) => {
    setEditingId(category.id);
    setFormData({ name: category.name });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta categoría?')) return;

    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id);

      if (error) throw error;
      refetch();
    } catch (error) {
      console.error('Error deleting category:', error);
      alert('Error al eliminar la categoría');
    }
  };

  const handleCancel = () => {
    setIsCreating(false);
    setEditingId(null);
    setFormData({ name: '' });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando categorías...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Categorías</h1>
          <p className="text-gray-600">Gestiona las categorías de productos</p>
        </div>
        {!isCreating && (
          <button
            onClick={() => setIsCreating(true)}
            className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-300 flex items-center space-x-2"
          >
            <Plus size={20} />
            <span>Nueva Categoría</span>
          </button>
        )}
      </div>

      {/* Formulario de creación */}
      {isCreating && (
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Nueva Categoría</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Nombre de la categoría
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Ej: Tecnología"
                required
              />
            </div>
            <div className="flex space-x-3">
              <button
                type="submit"
                disabled={submitting}
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors duration-300 flex items-center space-x-2 disabled:opacity-50"
              >
                <Save size={16} />
                <span>{submitting ? 'Guardando...' : 'Guardar'}</span>
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors duration-300 flex items-center space-x-2"
              >
                <X size={16} />
                <span>Cancelar</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Lista de categorías */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <div key={category.id} className="bg-white rounded-2xl shadow-lg p-6">
            {editingId === category.id ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                />
                <div className="flex space-x-2">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-600 transition-colors duration-300 flex items-center space-x-1 text-sm disabled:opacity-50"
                  >
                    <Save size={14} />
                    <span>{submitting ? 'Guardando...' : 'Guardar'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="bg-gray-500 text-white px-3 py-1 rounded-lg hover:bg-gray-600 transition-colors duration-300 flex items-center space-x-1 text-sm"
                  >
                    <X size={14} />
                    <span>Cancelar</span>
                  </button>
                </div>
              </form>
            ) : (
              <>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">{category.name}</h3>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(category)}
                    className="bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600 transition-colors duration-300 flex items-center space-x-1 text-sm"
                  >
                    <Edit3 size={14} />
                    <span>Editar</span>
                  </button>
                  <button
                    onClick={() => handleDelete(category.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition-colors duration-300 flex items-center space-x-1 text-sm"
                  >
                    <Trash2 size={14} />
                    <span>Eliminar</span>
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {categories.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg mb-4">No hay categorías creadas aún</p>
          <button
            onClick={() => setIsCreating(true)}
            className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-300 flex items-center space-x-2 mx-auto"
          >
            <Plus size={20} />
            <span>Crear Primera Categoría</span>
          </button>
        </div>
      )}
    </div>
  );
}