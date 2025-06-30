// src/pages/admin/ContactPhones.tsx

import { useState } from 'react';
import { Plus, Edit3, Trash2, Save, X } from 'lucide-react';
import { useContactPhones } from '../../hooks/useData'; // Crearemos este hook ahora

const BASE_API_URL = 'https://alejandrosabater.com.ar/api';

interface ContactPhone {
  id: string;
  display_number: string;
  whatsapp_number: string;
}

export default function ContactPhones() {
  const { phones, loading, refetch } = useContactPhones();
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPhone, setEditingPhone] = useState<ContactPhone | null>(null);
  const [submitting, setSubmitting] = useState(false);
  
  // Estados para el formulario
  const [displayNumber, setDisplayNumber] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');

  const resetForm = () => {
    setIsFormOpen(false);
    setEditingPhone(null);
    setDisplayNumber('');
    setWhatsappNumber('');
  };

  const handleAddNew = () => {
    resetForm();
    setIsFormOpen(true);
  };

  const handleEdit = (phone: ContactPhone) => {
    resetForm();
    setEditingPhone(phone);
    setDisplayNumber(phone.display_number);
    setWhatsappNumber(phone.whatsapp_number);
    setIsFormOpen(true);
  };

  const handleDelete = async (phoneId: string) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar este teléfono?')) return;
    
    try {
      const response = await fetch(`${BASE_API_URL}/deleteContactPhone.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: phoneId }),
      });
      const result = await response.json();
      if (!response.ok || result.error) throw new Error(result.error);
      
      alert('Teléfono eliminado con éxito.');
      refetch();
    } catch (error) {
      alert(`Error al eliminar el teléfono: ${error}`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!displayNumber.trim() || !whatsappNumber.trim()) return;

    setSubmitting(true);
    let url = '';
    let body = {};

    if (editingPhone) {
      url = `${BASE_API_URL}/updateContactPhone.php`;
      body = { id: editingPhone.id, display_number: displayNumber.trim(), whatsapp_number: whatsappNumber.trim() };
    } else {
      url = `${BASE_API_URL}/createContactPhone.php`;
      body = { display_number: displayNumber.trim(), whatsapp_number: whatsappNumber.trim() };
    }
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const result = await response.json();
      if (!response.ok || result.error) throw new Error(result.error);
      
      alert(`Teléfono ${editingPhone ? 'actualizado' : 'creado'} con éxito.`);
      resetForm();
      refetch();
    } catch (error) {
      console.error('Error saving phone:', error);
      alert(`Error al guardar el teléfono: ${error}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Teléfonos de Contacto (Footer)</h1>
      
      {!isFormOpen && (
          <button onClick={handleAddNew} className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2 mb-8">
            <Plus size={20} />
            <span>Nuevo Teléfono</span>
          </button>
      )}

      {isFormOpen && (
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-6">{editingPhone ? 'Editar Teléfono' : 'Añadir Nuevo Teléfono'}</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="display_number" className="block text-sm font-medium text-gray-700 mb-2">Número a mostrar (Ej: +54 (11) 1234-5678)</label>
                <input type="text" id="display_number" value={displayNumber} onChange={(e) => setDisplayNumber(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg" required />
              </div>
              <div>
                <label htmlFor="whatsapp_number" className="block text-sm font-medium text-gray-700 mb-2">Número para WhatsApp (Ej: 5491112345678)</label>
                <input type="text" id="whatsapp_number" value={whatsappNumber} onChange={(e) => setWhatsappNumber(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg" required />
              </div>
            </div>
            <div className="flex space-x-3 pt-4 border-t">
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

      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Número a mostrar</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Número WhatsApp</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading ? <tr><td colSpan={3} className="text-center py-4">Cargando...</td></tr> : phones.map((phone) => (
              <tr key={phone.id}>
                <td className="px-6 py-4 font-medium">{phone.display_number}</td>
                <td className="px-6 py-4 text-gray-500">{phone.whatsapp_number}</td>
                <td className="px-6 py-4">
                  <div className="flex space-x-2">
                    <button onClick={() => handleEdit(phone)} className="p-2 text-blue-600 hover:text-blue-900"><Edit3 size={18} /></button>
                    <button onClick={() => handleDelete(phone.id)} className="p-2 text-red-600 hover:text-red-900"><Trash2 size={18} /></button>
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