import React, { useState } from 'react';
import { useWebsiteStore } from '../../store/useWebsiteStore';
import { Menu, Plus, Trash, Edit, Check, X } from 'lucide-react';

const EditNavigation: React.FC = () => {
  const { menuItems, updateMenuItems } = useWebsiteStore();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [newItem, setNewItem] = useState({ text: '', url: '' });

  const handleEdit = (item: any) => {
    setEditingId(item.id);
    setEditingItem({ ...item });
  };

  const handleSave = () => {
    if (editingItem) {
      const newMenuItems = menuItems.map(item =>
        item.id === editingId ? editingItem : item
      );
      updateMenuItems(newMenuItems);
      setEditingId(null);
      setEditingItem(null);
    }
  };

  const handleAdd = () => {
    if (newItem.text && newItem.url) {
      const newMenuItems = [
        ...menuItems,
        {
          id: Date.now().toString(),
          ...newItem
        }
      ];
      updateMenuItems(newMenuItems);
      setNewItem({ text: '', url: '' });
      setIsAdding(false);
    }
  };

  const handleDelete = (id: string) => {
    const newMenuItems = menuItems.filter(item => item.id !== id);
    updateMenuItems(newMenuItems);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Editar Navegación</h1>
      
      <div className="bg-white rounded-2xl shadow-custom p-6">
        <div className="mb-4 flex justify-end">
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center px-3 py-2 rounded-lg bg-primary-500 text-white hover:bg-primary-400"
          >
            <Plus className="h-4 w-4 mr-1" />
            <span>Agregar Ítem</span>
          </button>
        </div>

        {isAdding && (
          <div className="border border-gray-200 rounded-xl p-4 mb-4">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Texto</label>
                <input
                  type="text"
                  value={newItem.text}
                  onChange={(e) => setNewItem({ ...newItem, text: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">URL</label>
                <input
                  type="text"
                  value={newItem.url}
                  onChange={(e) => setNewItem({ ...newItem, url: e.target.value })}
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

        <div className="space-y-4">
          {menuItems.map((item) => (
            <div key={item.id} className="border border-gray-200 rounded-xl p-4">
              {editingId === item.id ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Texto</label>
                    <input
                      type="text"
                      value={editingItem.text}
                      onChange={(e) => setEditingItem({ ...editingItem, text: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">URL</label>
                    <input
                      type="text"
                      value={editingItem.url}
                      onChange={(e) => setEditingItem({ ...editingItem, url: e.target.value })}
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
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Menu className="h-4 w-4 text-primary-500" />
                    <span>{item.text}</span>
                    <span className="text-sm text-gray-500">{item.url}</span>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(item)}
                      className="p-1 rounded-full text-blue-600 hover:bg-blue-100"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
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

export default EditNavigation;