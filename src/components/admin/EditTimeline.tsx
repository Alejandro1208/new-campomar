// src/components/admin/EditTimeline.tsx
import React, { useState, useEffect } from 'react'; // Añade useEffect
import { useWebsiteStore } from '../../store/useWebsiteStore';
import { TimelineEvent } from '../../types'; // Importa el tipo
import { Edit, Check, X } from 'lucide-react'; // Quita Plus y Trash

const EditTimeline: React.FC = () => {
  const { 
    timelineEvents, 
    updateTimelineEvent // Solo necesitamos esta para editar
  } = useWebsiteStore((state) => ({
    timelineEvents: state.timelineEvents,
    updateTimelineEvent: state.updateTimelineEvent,
  }));

  const [editingId, setEditingId] = useState<string | null>(null);
  // Usaremos un estado para el formulario del evento que se está editando
  const [currentEditForm, setCurrentEditForm] = useState<Partial<TimelineEvent>>({
    year: '',
    title: '',
    description: '',
  });

  // Cuando editingId cambia, actualiza el formulario
  useEffect(() => {
    if (editingId) {
      const eventToEdit = timelineEvents.find(event => event.id === editingId);
      if (eventToEdit) {
        setCurrentEditForm({
          year: eventToEdit.year,
          title: eventToEdit.title,
          description: eventToEdit.description || '',
        });
      }
    } else {
      setCurrentEditForm({ year: '', title: '', description: '' }); // Limpiar si no hay edición
    }
  }, [editingId, timelineEvents]);


  const handleEdit = (event: TimelineEvent) => {
    setEditingId(event.id);
    // setCurrentEditForm se actualizará por el useEffect
  };

  const handleCancelEdit = () => {
    setEditingId(null);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setCurrentEditForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async () => {
    if (editingId && currentEditForm.title && currentEditForm.year) {
      if (typeof updateTimelineEvent !== 'function') {
        console.error("Error: updateTimelineEvent no es una función.");
        alert("Error: La función de actualización no está disponible.");
        return;
      }
      try {
        // Solo envía los campos que pueden cambiar. El ID se pasa como primer argumento.
        const dataToUpdate: Partial<Omit<TimelineEvent, 'id'>> = {
          year: currentEditForm.year,
          title: currentEditForm.title,
          description: currentEditForm.description,
        };
        await updateTimelineEvent(editingId, dataToUpdate);
        setEditingId(null); // Salir del modo edición
      } catch (error) {
        console.error("Error al guardar evento de timeline:", error);
        alert("Error al guardar el evento. Revisa la consola.");
      }
    } else {
      alert("Año y Título son obligatorios.");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Editar Línea de Tiempo</h1>

      <div className="bg-white rounded-2xl shadow-custom p-6">
        {/* Ya no hay botón para "Agregar Evento" */}
        <div className="space-y-4">
          {timelineEvents.map((event) => (
            <div key={event.id} className="border border-gray-200 rounded-xl p-4">
              {editingId === event.id ? (
                // Formulario de Edición
                <div className="space-y-4">
                  <div>
                    <label htmlFor={`year-${event.id}`} className="block text-sm font-medium text-gray-700 mb-1">Año</label>
                    <input
                      type="text"
                      id={`year-${event.id}`}
                      name="year"
                      value={currentEditForm.year}
                      onChange={handleFormChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <label htmlFor={`title-${event.id}`} className="block text-sm font-medium text-gray-700 mb-1">Título</label>
                    <input
                      type="text"
                      id={`title-${event.id}`}
                      name="title"
                      value={currentEditForm.title}
                      onChange={handleFormChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <label htmlFor={`description-${event.id}`} className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                    <textarea
                      id={`description-${event.id}`}
                      name="description"
                      value={currentEditForm.description}
                      onChange={handleFormChange}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={handleCancelEdit}
                      className="px-3 py-1 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100"
                    >
                      <X className="h-4 w-4" /> Cancelar
                    </button>
                    <button
                      onClick={handleSave}
                      className="px-3 py-1 rounded-lg bg-primary-500 text-white hover:bg-primary-400"
                    >
                      <Check className="h-4 w-4" /> Guardar
                    </button>
                  </div>
                </div>
              ) : (
                // Vista del Evento
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="text-primary-500 font-bold">{event.year}</span>
                      <h3 className="font-medium">{event.title}</h3>
                    </div>
                    {event.description && (
                      <p className="text-sm text-gray-600">{event.description}</p>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(event)}
                      className="p-1 rounded-full text-blue-600 hover:bg-blue-100"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    {/* Ya no hay botón para Eliminar */}
                  </div>
                </div>
              )}
            </div>
          ))}
          {timelineEvents.length === 0 && (
            <p className="text-center py-4 text-gray-500">No hay eventos en la línea de tiempo.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditTimeline;