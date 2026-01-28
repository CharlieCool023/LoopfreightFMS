import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, Upload, FileSpreadsheet } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useTrackerStore } from '@/store/trackerStore';
import { getPartnerByUserId } from '@/lib/mockData';
import type { AssetType } from '@/types';

interface TrackerRow {
  id: string;
  device_id: string;
  name: string;
  asset_type: AssetType;
  vehicle_name: string;
  vehicle_registration: string;
}

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

export function BulkAddTrackersPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { addTrackersBulk, isLoading } = useTrackerStore();
  
  const [trackers, setTrackers] = useState<TrackerRow[]>([
    { id: '1', device_id: '', name: '', asset_type: 'car', vehicle_name: '', vehicle_registration: '' },
  ]);

  const addRow = () => {
    setTrackers([...trackers, {
      id: Date.now().toString(),
      device_id: '',
      name: '',
      asset_type: 'car',
      vehicle_name: '',
      vehicle_registration: '',
    }]);
  };

  const removeRow = (id: string) => {
    if (trackers.length > 1) {
      setTrackers(trackers.filter(t => t.id !== id));
    }
  };

  const updateRow = (id: string, field: keyof TrackerRow, value: string) => {
    setTrackers(trackers.map(t => 
      t.id === id ? { ...t, [field]: value } : t
    ));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const partner = getPartnerByUserId(user?.id || '');
    if (!partner) {
      alert('Partner profile not found');
      return;
    }

    // Validate all rows have required fields
    const invalidRows = trackers.filter(t => !t.device_id || !t.name);
    if (invalidRows.length > 0) {
      alert('Please fill in all required fields (Device ID and Tracker Name)');
      return;
    }

    const trackerData = trackers.map(t => ({
      device_id: t.device_id,
      name: t.name,
      asset_type: t.asset_type,
      vehicle_name: t.vehicle_name,
      vehicle_registration: t.vehicle_registration,
      owner_id: partner.id,
      owner_type: 'partner' as const,
      photos: [],
      status: 'active' as const,
      last_location: null,
      last_seen: null,
      speed: null,
      ignition_status: false,
      subscription_expires_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
    }));

    const success = await addTrackersBulk(trackerData);
    
    if (success) {
      navigate('/partner/trackers');
    }
  };

  const handleCSVUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const lines = text.split('\n').filter(line => line.trim());
      
      // Skip header row if present
      const startIndex = lines[0].toLowerCase().includes('device') ? 1 : 0;
      
      const newTrackers: TrackerRow[] = [];
      for (let i = startIndex; i < lines.length; i++) {
        const cols = lines[i].split(',').map(c => c.trim());
        if (cols.length >= 2 && cols[0] && cols[1]) {
          newTrackers.push({
            id: `${Date.now()}-${i}`,
            device_id: cols[0],
            name: cols[1],
            asset_type: (cols[2] as AssetType) || 'car',
            vehicle_name: cols[3] || '',
            vehicle_registration: cols[4] || '',
          });
        }
      }
      
      if (newTrackers.length > 0) {
        setTrackers(newTrackers);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          to="/partner/trackers"
          className="p-2 text-[#A6AEB8] hover:text-[#F2F4F8] transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-[#F2F4F8]">Bulk Add Trackers</h1>
          <p className="text-sm text-[#A6AEB8]">Add multiple trackers at once</p>
        </div>
      </div>

      {/* CSV Upload */}
      <div className="glass-panel p-6">
        <div className="flex items-center gap-3 mb-4">
          <FileSpreadsheet className="w-5 h-5 text-[#C8FF2E]" />
          <h2 className="text-lg font-semibold text-[#F2F4F8]">Import from CSV</h2>
        </div>
        <div className="border-2 border-dashed border-[#C8FF2E]/20 rounded-lg p-6 text-center">
          <Upload className="w-8 h-8 text-[#A6AEB8] mx-auto mb-3" />
          <p className="text-sm text-[#A6AEB8] mb-2">
            Upload a CSV file with columns: Device ID, Name, Asset Type, Vehicle Name, Registration
          </p>
          <input
            type="file"
            accept=".csv"
            onChange={handleCSVUpload}
            className="hidden"
            id="csv-upload"
          />
          <label
            htmlFor="csv-upload"
            className="btn-secondary text-sm cursor-pointer inline-block"
          >
            Upload CSV
          </label>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="glass-panel p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-[#F2F4F8]">Tracker Details</h2>
            <button
              type="button"
              onClick={addRow}
              className="flex items-center gap-2 px-3 py-2 bg-[#C8FF2E]/10 text-[#C8FF2E] rounded-lg hover:bg-[#C8FF2E]/20 transition-colors text-sm"
            >
              <Plus className="w-4 h-4" />
              Add Row
            </button>
          </div>

          <div className="space-y-3">
            {trackers.map((tracker) => (
              <div
                key={tracker.id}
                className="grid grid-cols-1 md:grid-cols-6 gap-3 p-4 bg-[#0B0C0F]/50 rounded-lg"
              >
                <div className="md:col-span-1">
                  <label className="block text-xs text-[#A6AEB8] mb-1">Device ID *</label>
                  <input
                    type="text"
                    value={tracker.device_id}
                    onChange={(e) => updateRow(tracker.id, 'device_id', e.target.value)}
                    className="input-dark w-full text-sm"
                    placeholder="DEV-001"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs text-[#A6AEB8] mb-1">Name *</label>
                  <input
                    type="text"
                    value={tracker.name}
                    onChange={(e) => updateRow(tracker.id, 'name', e.target.value)}
                    className="input-dark w-full text-sm"
                    placeholder="Tracker name"
                    required
                  />
                </div>
                <div className="md:col-span-1">
                  <label className="block text-xs text-[#A6AEB8] mb-1">Type</label>
                  <select
                    value={tracker.asset_type}
                    onChange={(e) => updateRow(tracker.id, 'asset_type', e.target.value as AssetType)}
                    className="input-dark w-full text-sm"
                  >
                    {assetTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="md:col-span-1">
                  <label className="block text-xs text-[#A6AEB8] mb-1">Vehicle</label>
                  <input
                    type="text"
                    value={tracker.vehicle_name}
                    onChange={(e) => updateRow(tracker.id, 'vehicle_name', e.target.value)}
                    className="input-dark w-full text-sm"
                    placeholder="Vehicle name"
                  />
                </div>
                <div className="md:col-span-1 flex items-end gap-2">
                  <div className="flex-1">
                    <label className="block text-xs text-[#A6AEB8] mb-1">Registration</label>
                    <input
                      type="text"
                      value={tracker.vehicle_registration}
                      onChange={(e) => updateRow(tracker.id, 'vehicle_registration', e.target.value)}
                      className="input-dark w-full text-sm"
                      placeholder="REG-001"
                    />
                  </div>
                  {trackers.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeRow(tracker.id)}
                      className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-4">
          <Link to="/partner/trackers" className="btn-secondary">
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
              <Upload className="w-4 h-4" />
            )}
            Add {trackers.length} Tracker{trackers.length > 1 ? 's' : ''}
          </button>
        </div>
      </form>
    </div>
  );
}

export default BulkAddTrackersPage;
