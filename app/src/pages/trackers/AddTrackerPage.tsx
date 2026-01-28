import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Upload, Car } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useTrackerStore } from '@/store/trackerStore';
import { getPartnerByUserId, getEndUserByUserId } from '@/lib/mockData';
import type { AssetType } from '@/types';

const assetTypes: { value: AssetType; label: string }[] = [
  { value: 'car', label: 'Car' },
  { value: 'bike', label: 'Motorcycle' },
  { value: 'suv', label: 'SUV' },
  { value: 'van', label: 'Van' },
  { value: 'truck', label: 'Truck' },
  { value: 'boat', label: 'Boat' },
  { value: 'helicopter', label: 'Helicopter' },
  { value: 'plane', label: 'Plane' },
  { value: 'ship', label: 'Ship' },
  { value: 'heavy_equipment', label: 'Heavy Equipment' },
];

export function AddTrackerPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { addTracker, isLoading } = useTrackerStore();
  
  const [formData, setFormData] = useState({
    device_id: '',
    name: '',
    asset_type: 'car' as AssetType,
    vehicle_name: '',
    vehicle_registration: '',
    driver_name: '',
    driver_phone: '',
  });
  const [photos, setPhotos] = useState<File[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const partner = getPartnerByUserId(user?.id || '');
    const endUser = getEndUserByUserId(user?.id || '');
    
    const ownerId = partner?.id || endUser?.id || '';
    const ownerType = partner ? 'partner' : 'end_user';
    
    if (!ownerId) {
      alert('User profile not found');
      return;
    }
    
    const success = await addTracker({
      ...formData,
      owner_id: ownerId,
      owner_type: ownerType,
      photos: [],
      status: 'active',
      last_location: null,
      last_seen: null,
      speed: null,
      ignition_status: false,
      subscription_expires_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
    });
    
    if (success) {
      const basePath = user?.role === 'partner' ? '/partner' : '/user';
      navigate(`${basePath}/trackers`);
    }
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setPhotos(Array.from(e.target.files));
    }
  };

  const basePath = user?.role === 'partner' ? '/partner' : '/user';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          to={`${basePath}/trackers`}
          className="p-2 text-[#A6AEB8] hover:text-[#F2F4F8] transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-[#F2F4F8]">Add New Tracker</h1>
          <p className="text-sm text-[#A6AEB8]">Register a new tracking device</p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="glass-panel p-6 space-y-6">
        {/* Device Information */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-[#F2F4F8]">Device Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#F2F4F8] mb-2">
                Device ID *
              </label>
              <input
                type="text"
                value={formData.device_id}
                onChange={(e) => setFormData({ ...formData, device_id: e.target.value })}
                className="input-dark w-full"
                placeholder="e.g., DEV-001-ABC"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-[#F2F4F8] mb-2">
                Tracker Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="input-dark w-full"
                placeholder="e.g., Toyota Hilux - Lagos Fleet"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#F2F4F8] mb-2">
              Asset Type *
            </label>
            <select
              value={formData.asset_type}
              onChange={(e) => setFormData({ ...formData, asset_type: e.target.value as AssetType })}
              className="input-dark w-full"
              required
            >
              {assetTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Vehicle Information */}
        <div className="space-y-4 pt-6 border-t border-[#C8FF2E]/10">
          <h2 className="text-lg font-semibold text-[#F2F4F8]">Vehicle Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#F2F4F8] mb-2">
                Vehicle Name
              </label>
              <input
                type="text"
                value={formData.vehicle_name}
                onChange={(e) => setFormData({ ...formData, vehicle_name: e.target.value })}
                className="input-dark w-full"
                placeholder="e.g., Toyota Hilux"
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
                className="input-dark w-full"
                placeholder="e.g., LAG-123-XY"
              />
            </div>
          </div>
        </div>

        {/* Driver Information */}
        <div className="space-y-4 pt-6 border-t border-[#C8FF2E]/10">
          <h2 className="text-lg font-semibold text-[#F2F4F8]">Driver Information (Optional)</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#F2F4F8] mb-2">
                Driver Name
              </label>
              <input
                type="text"
                value={formData.driver_name}
                onChange={(e) => setFormData({ ...formData, driver_name: e.target.value })}
                className="input-dark w-full"
                placeholder="e.g., John Doe"
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
                className="input-dark w-full"
                placeholder="e.g., +234 801 234 5678"
              />
            </div>
          </div>
        </div>

        {/* Photos */}
        <div className="space-y-4 pt-6 border-t border-[#C8FF2E]/10">
          <h2 className="text-lg font-semibold text-[#F2F4F8]">Photos (Optional)</h2>
          
          <div className="border-2 border-dashed border-[#C8FF2E]/20 rounded-lg p-8 text-center">
            <Upload className="w-8 h-8 text-[#A6AEB8] mx-auto mb-3" />
            <p className="text-sm text-[#A6AEB8] mb-2">
              Drag and drop photos here, or click to browse
            </p>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handlePhotoChange}
              className="hidden"
              id="photo-upload"
            />
            <label
              htmlFor="photo-upload"
              className="btn-secondary text-sm cursor-pointer inline-block"
            >
              Browse Files
            </label>
            {photos.length > 0 && (
              <p className="text-sm text-[#C8FF2E] mt-3">
                {photos.length} photo{photos.length > 1 ? 's' : ''} selected
              </p>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-4 pt-6 border-t border-[#C8FF2E]/10">
          <Link
            to={`${basePath}/trackers`}
            className="btn-secondary"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary flex items-center gap-2 disabled:opacity-50"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-[#0B0C0F] border-t-transparent rounded-full animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            Save Tracker
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddTrackerPage;
