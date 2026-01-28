import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, Save, X, MapPin, Gauge, Battery, Calendar, User, Car } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useTrackerStore } from '@/store/trackerStore';
import { useTrackerSimulation } from '@/hooks/useTrackerSimulation';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const trackerIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iMTAiIGZpbGw9IiNDOEZGMkUiIHN0cm9rZT0iIzBCMEMwRiIgc3Ryb2tlLXdpZHRoPSIyIi8+CjxjaXJjbGUgY3g9IjEyIiBjeT0iMTIiIHI9IjQiIGZpbGw9IiMwQjBDMEYiLz4KPC9zdmc+',
  iconSize: [24, 24],
  iconAnchor: [12, 12],
  popupAnchor: [0, -12],
});

export function TrackerDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { trackers, updateTracker } = useTrackerStore();
  const { trackers: simulatedTrackers } = useTrackerSimulation();
  
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    vehicle_name: '',
    vehicle_registration: '',
    driver_name: '',
    driver_phone: '',
  });

  const tracker = trackers.find(t => t.id === id);
  const simulatedTracker = simulatedTrackers.find(t => t.id === id);

  useEffect(() => {
    if (tracker) {
      setFormData({
        name: tracker.name,
        vehicle_name: tracker.vehicle_name || '',
        vehicle_registration: tracker.vehicle_registration || '',
        driver_name: tracker.driver_name || '',
        driver_phone: tracker.driver_phone || '',
      });
    }
  }, [tracker]);

  if (!tracker) {
    return (
      <div className="text-center py-12">
        <MapPin className="w-12 h-12 text-[#A6AEB8] mx-auto mb-3" />
        <p className="text-[#A6AEB8]">Tracker not found</p>
        <Link
          to={user?.role === 'partner' ? '/partner/trackers' : '/user/trackers'}
          className="text-[#C8FF2E] hover:underline text-sm mt-2 inline-block"
        >
          Back to trackers
        </Link>
      </div>
    );
  }

  const handleSave = async () => {
    setIsSaving(true);
    await updateTracker(tracker.id, formData);
    setIsSaving(false);
    setIsEditing(false);
  };

  const basePath = user?.role === 'partner' ? '/partner' : '/user';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            to={`${basePath}/trackers`}
            className="p-2 text-[#A6AEB8] hover:text-[#F2F4F8] transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-[#F2F4F8]">{tracker.name}</h1>
            <p className="text-sm text-[#A6AEB8]">{tracker.device_id}</p>
          </div>
        </div>
        <button
          onClick={() => isEditing ? handleSave() : setIsEditing(true)}
          disabled={isSaving}
          className="btn-primary flex items-center gap-2 disabled:opacity-50"
        >
          {isEditing ? (
            <>
              <Save className="w-4 h-4" />
              {isSaving ? 'Saving...' : 'Save'}
            </>
          ) : (
            <>
              <Edit className="w-4 h-4" />
              Edit
            </>
          )}
        </button>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-panel p-4">
          <div className="flex items-center gap-2 mb-1">
            <Gauge className="w-4 h-4 text-[#C8FF2E]" />
            <span className="text-xs text-[#A6AEB8]">Speed</span>
          </div>
          <p className="text-xl font-bold text-[#F2F4F8]">
            {Math.round(simulatedTracker?.speed || 0)}
          </p>
          <p className="text-xs text-[#A6AEB8]">km/h</p>
        </div>

        <div className="glass-panel p-4">
          <div className="flex items-center gap-2 mb-1">
            <Battery className="w-4 h-4 text-[#C8FF2E]" />
            <span className="text-xs text-[#A6AEB8]">Status</span>
          </div>
          <p className="text-xl font-bold text-[#F2F4F8]">
            {simulatedTracker?.ignition_status ? 'On' : 'Off'}
          </p>
          <p className="text-xs text-[#A6AEB8]">Ignition</p>
        </div>

        <div className="glass-panel p-4">
          <div className="flex items-center gap-2 mb-1">
            <MapPin className="w-4 h-4 text-[#C8FF2E]" />
            <span className="text-xs text-[#A6AEB8]">Movement</span>
          </div>
          <p className="text-xl font-bold text-[#F2F4F8]">
            {simulatedTracker?.is_moving ? 'Moving' : 'Stationary'}
          </p>
          <p className="text-xs text-[#A6AEB8]">Current State</p>
        </div>

        <div className="glass-panel p-4">
          <div className="flex items-center gap-2 mb-1">
            <Calendar className="w-4 h-4 text-[#C8FF2E]" />
            <span className="text-xs text-[#A6AEB8]">Subscription</span>
          </div>
          <p className="text-xl font-bold text-[#F2F4F8]">
            {tracker.subscription_expires_at
              ? new Date(tracker.subscription_expires_at).toLocaleDateString()
              : 'N/A'}
          </p>
          <p className="text-xs text-[#A6AEB8]">Expires</p>
        </div>
      </div>

      {/* Map */}
      <div className="glass-panel p-4">
        <h2 className="text-lg font-semibold text-[#F2F4F8] mb-4">Current Location</h2>
        <div className="h-64 md:h-80 rounded-lg overflow-hidden">
          {simulatedTracker ? (
            <MapContainer
              center={[simulatedTracker.currentLocation.lat, simulatedTracker.currentLocation.lng]}
              zoom={15}
              style={{ height: '100%', width: '100%' }}
              className="z-0"
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker
                position={[simulatedTracker.currentLocation.lat, simulatedTracker.currentLocation.lng]}
                icon={trackerIcon}
              >
                <Popup>
                  <div className="text-[#0B0C0F]">
                    <p className="font-semibold">{tracker.name}</p>
                    <p className="text-sm">Speed: {Math.round(simulatedTracker.speed)} km/h</p>
                  </div>
                </Popup>
              </Marker>
            </MapContainer>
          ) : (
            <div className="h-full flex items-center justify-center bg-[#12151C]">
              <p className="text-[#A6AEB8]">No location data available</p>
            </div>
          )}
        </div>
      </div>

      {/* Details Form */}
      <div className="glass-panel p-6">
        <h2 className="text-lg font-semibold text-[#F2F4F8] mb-4">Tracker Details</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[#F2F4F8] mb-2">
              Tracker Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              disabled={!isEditing}
              className="input-dark w-full disabled:opacity-50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#F2F4F8] mb-2">
              Device ID
            </label>
            <input
              type="text"
              value={tracker.device_id}
              disabled
              className="input-dark w-full opacity-50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#F2F4F8] mb-2">
              Vehicle Name
            </label>
            <input
              type="text"
              value={formData.vehicle_name}
              onChange={(e) => setFormData({ ...formData, vehicle_name: e.target.value })}
              disabled={!isEditing}
              className="input-dark w-full disabled:opacity-50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#F2F4F8] mb-2">
              Registration Number
            </label>
            <input
              type="text"
              value={formData.vehicle_registration}
              onChange={(e) => setFormData({ ...formData, vehicle_registration: e.target.value })}
              disabled={!isEditing}
              className="input-dark w-full disabled:opacity-50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#F2F4F8] mb-2">
              Driver Name
            </label>
            <input
              type="text"
              value={formData.driver_name}
              onChange={(e) => setFormData({ ...formData, driver_name: e.target.value })}
              disabled={!isEditing}
              className="input-dark w-full disabled:opacity-50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#F2F4F8] mb-2">
              Driver Phone
            </label>
            <input
              type="tel"
              value={formData.driver_phone}
              onChange={(e) => setFormData({ ...formData, driver_phone: e.target.value })}
              disabled={!isEditing}
              className="input-dark w-full disabled:opacity-50"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default TrackerDetailsPage;
