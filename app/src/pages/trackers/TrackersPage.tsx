import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Filter, MoreVertical, Edit, Trash2, MapPin } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useTrackerStore } from '@/store/trackerStore';
import { getPartnerByUserId, getEndUserByUserId } from '@/lib/mockData';
import type { Tracker } from '@/types';

export function TrackersPage() {
  const { user } = useAuthStore();
  const { trackers, loadTrackers, deleteTracker } = useTrackerStore();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      const partner = getPartnerByUserId(user.id);
      const endUser = getEndUserByUserId(user.id);
      
      if (partner) {
        loadTrackers(partner.id, 'partner');
      } else if (endUser) {
        loadTrackers(endUser.id, 'end_user');
      }
    }
  }, [user]);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this tracker?')) return;
    
    setDeletingId(id);
    await deleteTracker(id);
    setDeletingId(null);
  };

  const filteredTrackers = trackers.filter(tracker => {
    const matchesSearch = 
      tracker.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tracker.device_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tracker.vehicle_name?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' || tracker.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-[#C8FF2E]/20 text-[#C8FF2E]';
      case 'idle': return 'bg-yellow-500/20 text-yellow-400';
      case 'offline': return 'bg-red-500/20 text-red-400';
      case 'expired': return 'bg-gray-500/20 text-gray-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const basePath = user?.role === 'partner' ? '/partner' : '/user';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#F2F4F8]">My Trackers</h1>
          <p className="text-sm text-[#A6AEB8]">
            Manage and monitor your tracking devices
          </p>
        </div>
        {user?.role === 'partner' && (
          <div className="flex gap-2">
            <Link
              to={`${basePath}/trackers/bulk-add`}
              className="btn-secondary text-sm"
            >
              Bulk Add
            </Link>
            <Link
              to={`${basePath}/trackers/add`}
              className="btn-primary text-sm inline-flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Tracker
            </Link>
          </div>
        )}
        {user?.role === 'end_user' && trackers.length === 0 && (
          <Link
            to={`${basePath}/trackers/add`}
            className="btn-primary text-sm inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Tracker
          </Link>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#A6AEB8]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search trackers..."
            className="input-dark w-full pl-10"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-[#A6AEB8]" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="input-dark"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="idle">Idle</option>
            <option value="offline">Offline</option>
            <option value="expired">Expired</option>
          </select>
        </div>
      </div>

      {/* Trackers Grid */}
      {filteredTrackers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTrackers.map((tracker) => (
            <div key={tracker.id} className="glass-panel p-5">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${
                    tracker.status === 'active' ? 'bg-[#C8FF2E]' :
                    tracker.status === 'inactive' ? 'bg-yellow-400' :
                    tracker.status === 'offline' ? 'bg-red-400' :
                    'bg-gray-400'
                  }`} />
                  <div>
                    <h3 className="font-semibold text-[#F2F4F8]">{tracker.name}</h3>
                    <p className="text-xs text-[#A6AEB8]">{tracker.device_id}</p>
                  </div>
                </div>
                <div className="relative group">
                  <button className="p-1 text-[#A6AEB8] hover:text-[#F2F4F8]">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                  <div className="absolute right-0 top-full mt-1 w-32 bg-[#12151C] border border-[#C8FF2E]/20 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                    <Link
                      to={`${basePath}/trackers/${tracker.id}`}
                      className="flex items-center gap-2 px-3 py-2 text-sm text-[#A6AEB8] hover:text-[#F2F4F8] hover:bg-[#1a1f2a]"
                    >
                      <Edit className="w-4 h-4" />
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(tracker.id)}
                      disabled={deletingId === tracker.id}
                      className="flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 w-full"
                    >
                      <Trash2 className="w-4 h-4" />
                      {deletingId === tracker.id ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                {tracker.vehicle_name && (
                  <p className="text-sm text-[#A6AEB8]">
                    Vehicle: <span className="text-[#F2F4F8]">{tracker.vehicle_name}</span>
                  </p>
                )}
                {tracker.vehicle_registration && (
                  <p className="text-sm text-[#A6AEB8]">
                    Reg: <span className="text-[#F2F4F8]">{tracker.vehicle_registration}</span>
                  </p>
                )}
                {tracker.driver_name && (
                  <p className="text-sm text-[#A6AEB8]">
                    Driver: <span className="text-[#F2F4F8]">{tracker.driver_name}</span>
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between">
                <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(tracker.status)}`}>
                  {tracker.status}
                </span>
                <Link
                  to={`${basePath}/trackers/${tracker.id}`}
                  className="text-sm text-[#C8FF2E] hover:underline"
                >
                  View Details →
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="glass-panel p-12 text-center">
          <MapPin className="w-12 h-12 text-[#A6AEB8] mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-[#F2F4F8] mb-2">
            No trackers found
          </h3>
          <p className="text-sm text-[#A6AEB8] mb-4">
            {searchQuery 
              ? 'Try adjusting your search or filters'
              : 'Add your first tracker to get started'}
          </p>
          {!searchQuery && user?.role === 'partner' && (
            <Link to={`${basePath}/trackers/add`} className="btn-primary">
              Add Tracker
            </Link>
          )}
        </div>
      )}
    </div>
  );
}

export default TrackersPage;
