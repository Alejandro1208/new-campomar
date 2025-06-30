// src/pages/admin/Timeline.tsx
import { useState, useEffect } from 'react';
import { Plus, Edit3, Trash2, Save, X } from 'lucide-react';
import { useTimelineEvents, useSiteSettings } from '../../hooks/useData';
import { TimelineEvent } from '../../lib/supabase';

const BASE_API_URL = 'https://alejandrosabater.com.ar/api';

export default function Timeline() {
  const { events, loading, refetch } = useTimelineEvents();
  const { settings: initialSettings, refetch: refetchSettings } = useSiteSettings();

  const [description, setDescription] = useState('');
  const [isEditing, setIsEditing] = useState<TimelineEvent | null>(null);
  const [formData, setFormData] = useState({ year: '', title: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setDescription(initialSettings.timeline_description || '');
  }, [initialSettings]);

  const handleDescriptionSave = async () => {
    try {
      await fetch(`${BASE_API_URL}/updateSettings.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ timeline_description: description }),
      });
      alert('Descripción guardada.');
      refetchSettings();
    } catch (error) {
      alert('Error al guardar la descripción.');
    }
  };

  const handleEdit = (event: TimelineEvent) => {
    setIsEditing(event);
    setFormData({ year: String(event.year), title: event.title });
  };
  
  const handleDelete = async (eventId: string) => {
    if (!window.confirm('¿Eliminar este evento?')) return;
    await fetch(`${BASE_API_URL}/deleteTimelineEvent.php`, {
        method: 'POST', body: JSON.stringify({ id: eventId })
    });
    refetch();
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const url = isEditing 
        ? `${BASE_API_URL}/updateTimelineEvent.php` 
        : `${BASE_API_URL}/createTimelineEvent.php`;
    const body = { 
        id: isEditing?.id, 
        year: Number(formData.year), 
        title: formData.title 
    };
    
    await fetch(url, { method: 'POST', body: JSON.stringify(body) });
    setSubmitting(false);
    setIsEditing(null);
    setFormData({ year: '', title: ''});
    refetch();
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Gestión de Línea de Tiempo</h1>
      
      {/* Descripción */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">Texto descriptivo de la sección</label>
        <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="w-full px-4 py-2 border border-gray-300 rounded-lg"></textarea>
        <button onClick={handleDescriptionSave} className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-lg text-sm">Guardar Descripción</button>
      </div>

      {/* Formulario */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
        <h3 className="text-xl font-semibold mb-4">{isEditing ? 'Editar Evento' : 'Añadir Nuevo Evento'}</h3>
        <form onSubmit={handleFormSubmit} className="flex flex-col md:flex-row gap-4 items-end">
            <div className="w-full md:w-1/4"><label>Año</label><input type="number" placeholder="2025" value={formData.year} onChange={(e) => setFormData({...formData, year: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg" required /></div>
            <div className="w-full md:w-2/4"><label>Título del Evento</label><input type="text" placeholder="Título del hito" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg" required /></div>
            <div className="w-full md:w-1/4 flex gap-2"><button type="submit" disabled={submitting} className="btn-success w-full">{isEditing ? 'Actualizar' : 'Añadir'}</button>{isEditing && <button type="button" onClick={() => setIsEditing(null)} className="btn-secondary">Cancelar</button>}</div>
        </form>
      </div>

      {/* Lista de eventos */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        {loading ? <p>Cargando...</p> : events.map(event => (
          <div key={event.id} className="flex justify-between items-center p-2 border-b">
            <div><span className="font-bold">{event.year}</span> - {event.title}</div>
            <div className="flex gap-2">
              <button onClick={() => handleEdit(event)}><Edit3 size={18} className="text-blue-600" /></button>
              <button onClick={() => handleDelete(event.id)}><Trash2 size={18} className="text-red-600" /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}