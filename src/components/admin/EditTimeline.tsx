import React, { useState } from 'react';
import { useWebsiteStore } from '../../store/useWebsiteStore';
import { Plus, Trash, Edit, Check, X } from 'lucide-react';

const EditTimeline: React.FC = () => {
  const { timelineEvents, updateTimelineEvents, addTimelineEvent, removeTimelineEvent } = useWebsiteStore();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingEvent, setEditingEvent] = useState<any>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [newEvent, setNewEvent] = useState({
    year: '',
    title: '',
    description: '',
  });

  const handleEdit = (event: any) => {
    setEditingId(event.id);
    setEditingEvent({ ...event });
  };

  const handleSave = () => {
    if (editingEvent) {
      const newEvents = timelineEvents.map(event =>
        event.id === editingId ? editingEvent : event
      );
      updateTimelineEvents(newEvents);
      setEditingId(null);
      setEditingEvent(null);
    }
  };

  const handleAdd = () => {
    if (newEvent.year && newEvent.title) {
      addTimelineEvent({
        id: Date.now().toString(),
        ...newEvent
      });
      setNewEvent({
        year: '',
        title: '',
        description: '',
      });
      setIsAdding(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Editar Línea de Tiempo</h1>
      
      <div className="bg-white rounded-2xl shadow-custom p-6">
        <div className="mb-4 flex justify-end">
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center px-3 py-2 rounded-lg bg-primary-500 text-white hover:bg-primary-400"
          >
            <Plus className="h-4 w-4 mr-1" />
            <span>Agregar Evento</span>
          </button>
        </div>

        {isAdding && (
          <div className="border border-gray-200 rounded-xl p-4 mb-4">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Año</label>
                <input
                  type="text"
                  value={newEvent.year}
                  onChange={(e) => setNewEvent({ ...newEvent, year: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
                <input
                  type="text"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                <textarea
                  value={newEvent.description}
                  onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                  rows={3}
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
          {timelineEvents.map((event) => (
            <div key={event.id} className="border border-gray-200 rounded-xl p-4">
              {editingId === event.id ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Año</label>
                    <input
                      type="text"
                      value={editingEvent.year}
                      onChange={(e) => setEditingEvent({ ...editingEvent, year: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
                    <input
                      type="text"
                      value={editingEvent.title}
                      onChange={(e) => setEditingEvent({ ...editingEvent, title: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                    <textarea
                      value={editingEvent.description}
                      onChange={(e) => setEditingEvent({ ...editingEvent, description: e.target.value })}
                      rows={3}
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
                    <button
                      onClick={() => removeTimelineEvent(event.id)}
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

export default EditTimeline;