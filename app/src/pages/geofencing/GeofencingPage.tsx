import { useState } from 'react';
import { Plus, MapPin, Edit, Trash2, AlertCircle } from 'lucide-react';

interface Geofence {
  id: string;
  name: string;
  type: 'circle' | 'polygon';
  radius?: number;
  alerts: string[];
}

export function GeofencingPage() {
  const [geofences, setGeofences] = useState<Geofence[]>([
    {
      id: '1',
      name: 'Headquarters Zone',
      type: 'circle',
      radius: 500,
      alerts: ['entry', 'exit'],
    },
    {
      id: '2',
      name: 'Restricted Area',
      type: 'polygon',
      alerts: ['entry'],
    },
  ]);

  const [showModal, setShowModal] = useState(false);

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this geofence?')) {
      setGeofences(geofences.filter(g => g.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#F2F4F8]">Geofencing</h1>
          <p className="text-sm text-[#A6AEB8]">Create and manage virtual boundaries</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Create Geofence
        </button>
      </div>

      {/* Info Banner */}
      <div className="flex items-start gap-3 p-4 bg-[#C8FF2E]/10 border border-[#C8FF2E]/30 rounded-lg">
        <AlertCircle className="w-5 h-5 text-[#C8FF2E] flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm text-[#F2F4F8]">
            Geofences help you monitor when assets enter or leave specific areas.
          </p>
          <p className="text-xs text-[#A6AEB8] mt-1">
            You'll receive instant notifications when triggers are activated.
          </p>
        </div>
      </div>

      {/* Geofences List */}
      <div className="glass-panel p-6">
        {geofences.length > 0 ? (
          <div className="space-y-4">
            {geofences.map((geofence) => (
              <div
                key={geofence.id}
                className="flex items-center justify-between p-4 bg-[#0B0C0F]/50 rounded-lg border border-[#C8FF2E]/20"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#C8FF2E]/10 flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-[#C8FF2E]" />
                  </div>
                  <div>
                    <p className="font-medium text-[#F2F4F8]">{geofence.name}</p>
                    <p className="text-xs text-[#A6AEB8]">
                      {geofence.type === 'circle' ? `Circle (${geofence.radius}m radius)` : 'Custom Polygon'} • 
                      Alerts: {geofence.alerts.join(', ')}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 text-[#A6AEB8] hover:text-[#F2F4F8] hover:bg-[#C8FF2E]/10 rounded-lg transition-colors">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(geofence.id)}
                    className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <MapPin className="w-12 h-12 text-[#A6AEB8] mx-auto mb-3" />
            <p className="text-[#A6AEB8]">No geofences created yet</p>
            <button
              onClick={() => setShowModal(true)}
              className="text-[#C8FF2E] hover:underline text-sm mt-2"
            >
              Create your first geofence
            </button>
          </div>
        )}
      </div>

      {/* Create Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="glass-panel w-full max-w-lg">
            <div className="p-6">
              <h2 className="text-xl font-bold text-[#F2F4F8] mb-4">Create Geofence</h2>
              <p className="text-sm text-[#A6AEB8] mb-6">
                This feature will be available soon. You'll be able to draw zones on the map and set up alerts.
              </p>
              <button
                onClick={() => setShowModal(false)}
                className="btn-primary w-full"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default GeofencingPage;
