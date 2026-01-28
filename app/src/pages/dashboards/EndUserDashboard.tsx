import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  MapPin, Wallet, Bell, Settings, Navigation, 
  Clock, Gauge, Battery, Signal
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useTrackerStore } from '@/store/trackerStore';
import { useWalletStore } from '@/store/walletStore';
import { useNotificationStore } from '@/store/notificationStore';
import { useTrackerSimulation } from '@/hooks/useTrackerSimulation';
import { getEndUserByUserId } from '@/lib/mockData';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Custom marker icon
const trackerIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iMTAiIGZpbGw9IiNDOEZGMkUiIHN0cm9rZT0iIzBCMEMwRiIgc3Ryb2tlLXdpZHRoPSIyIi8+CjxjaXJjbGUgY3g9IjEyIiBjeT0iMTIiIHI9IjQiIGZpbGw9IiMwQjBDMEYiLz4KPC9zdmc+',
  iconSize: [24, 24],
  iconAnchor: [12, 12],
  popupAnchor: [0, -12],
});

export function EndUserDashboard() {
  const { user } = useAuthStore();
  const { trackers, loadTrackers } = useTrackerStore();
  const { balance, loadWallet } = useWalletStore();
  const { unreadCount } = useNotificationStore();
  const { trackers: simulatedTrackers } = useTrackerSimulation();
  
  const [endUser] = useState(() => getEndUserByUserId(user?.id || ''));
  const [selectedTracker, setSelectedTracker] = useState(simulatedTrackers[0]);

  useEffect(() => {
    if (user && endUser) {
      loadTrackers(endUser.id, 'end_user');
      loadWallet(user.id, 'end_user');
    }
  }, [user, endUser]);

  // Update selected tracker when simulation updates
  useEffect(() => {
    if (simulatedTrackers.length > 0 && !selectedTracker) {
      setSelectedTracker(simulatedTrackers[0]);
    }
  }, [simulatedTrackers]);

  const tracker = trackers[0];
  const isSubscriptionExpired = tracker?.status === 'expired';

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-[#F2F4F8]">My Tracker</h1>
          <p className="text-xs text-[#A6AEB8]">{tracker?.name || 'No tracker'}</p>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/user/notifications" className="relative p-2">
            <Bell className="w-5 h-5 text-[#A6AEB8]" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-[#C8FF2E] text-[#0B0C0F] text-xs font-bold rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </Link>
          <Link to="/user/settings" className="p-2">
            <Settings className="w-5 h-5 text-[#A6AEB8]" />
          </Link>
        </div>
      </div>

      {/* Desktop Header */}
      <div className="hidden md:flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#F2F4F8]">
            Welcome back, {user?.full_name.split(' ')[0]}
          </h1>
          <p className="text-sm text-[#A6AEB8]">Track and monitor your asset</p>
        </div>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <div className="glass-panel p-3 md:p-4">
          <div className="flex items-center gap-2 mb-1">
            <Gauge className="w-4 h-4 text-[#C8FF2E]" />
            <span className="text-xs text-[#A6AEB8]">Speed</span>
          </div>
          <p className="text-lg md:text-2xl font-bold text-[#F2F4F8]">
            {Math.round(selectedTracker?.speed || 0)}
          </p>
          <p className="text-xs text-[#A6AEB8]">km/h</p>
        </div>

        <div className="glass-panel p-3 md:p-4">
          <div className="flex items-center gap-2 mb-1">
            <Battery className="w-4 h-4 text-[#C8FF2E]" />
            <span className="text-xs text-[#A6AEB8]">Status</span>
          </div>
          <p className="text-lg md:text-2xl font-bold text-[#F2F4F8]">
            {selectedTracker?.ignition_status ? 'On' : 'Off'}
          </p>
          <p className="text-xs text-[#A6AEB8]">Ignition</p>
        </div>

        <div className="glass-panel p-3 md:p-4">
          <div className="flex items-center gap-2 mb-1">
            <Signal className="w-4 h-4 text-[#C8FF2E]" />
            <span className="text-xs text-[#A6AEB8]">Signal</span>
          </div>
          <p className="text-lg md:text-2xl font-bold text-[#F2F4F8]">Good</p>
          <p className="text-xs text-[#A6AEB8]">Connection</p>
        </div>

        <Link to="/user/wallet" className="glass-panel p-3 md:p-4 hover:border-[#C8FF2E]/40 transition-colors">
          <div className="flex items-center gap-2 mb-1">
            <Wallet className="w-4 h-4 text-[#C8FF2E]" />
            <span className="text-xs text-[#A6AEB8]">Wallet</span>
          </div>
          <p className="text-lg md:text-2xl font-bold text-[#F2F4F8]">
            ₦{balance.toLocaleString()}
          </p>
          <p className="text-xs text-[#A6AEB8]">Balance</p>
        </Link>
      </div>

      {/* Map */}
      <div className="glass-panel p-3 md:p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm md:text-lg font-semibold text-[#F2F4F8]">Live Location</h2>
          <span className={`px-2 py-1 rounded-full text-xs ${
            selectedTracker?.is_moving ? 'bg-[#C8FF2E]/20 text-[#C8FF2E]' : 'bg-yellow-500/20 text-yellow-400'
          }`}>
            {selectedTracker?.is_moving ? 'Moving' : 'Stationary'}
          </span>
        </div>

        <div className={`relative h-64 md:h-80 rounded-lg overflow-hidden ${isSubscriptionExpired ? 'blurry-screen' : ''}`}>
          {selectedTracker ? (
            <MapContainer
              center={[selectedTracker.currentLocation.lat, selectedTracker.currentLocation.lng]}
              zoom={14}
              style={{ height: '100%', width: '100%' }}
              className="z-0"
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker
                position={[selectedTracker.currentLocation.lat, selectedTracker.currentLocation.lng]}
                icon={trackerIcon}
              >
                <Popup>
                  <div className="text-[#0B0C0F]">
                    <p className="font-semibold">{selectedTracker.name}</p>
                    <p className="text-sm">Speed: {Math.round(selectedTracker.speed)} km/h</p>
                  </div>
                </Popup>
              </Marker>
            </MapContainer>
          ) : (
            <div className="h-full flex items-center justify-center bg-[#12151C]">
              <p className="text-[#A6AEB8]">No tracker data available</p>
            </div>
          )}

          {/* Blurry Screen Overlay for Expired Subscription */}
          {isSubscriptionExpired && (
            <div className="blurry-screen-overlay">
              <div className="text-center p-6">
                <div className="w-12 h-12 rounded-full bg-yellow-500/20 flex items-center justify-center mx-auto mb-3">
                  <Clock className="w-6 h-6 text-yellow-400" />
                </div>
                <h3 className="text-lg font-semibold text-[#F2F4F8] mb-2">
                  Subscription Expired
                </h3>
                <p className="text-sm text-[#A6AEB8] mb-4">
                  Renew your subscription to view the full map
                </p>
                <Link
                  to="/user/subscription"
                  className="btn-primary inline-block"
                >
                  Renew Now
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Location Info */}
        {selectedTracker && (
          <div className="mt-3 grid grid-cols-2 gap-3">
            <div className="bg-[#0B0C0F]/50 rounded-lg p-3">
              <p className="text-xs text-[#A6AEB8] mb-1">Latitude</p>
              <p className="text-sm font-mono text-[#F2F4F8]">
                {selectedTracker.currentLocation.lat.toFixed(6)}
              </p>
            </div>
            <div className="bg-[#0B0C0F]/50 rounded-lg p-3">
              <p className="text-xs text-[#A6AEB8] mb-1">Longitude</p>
              <p className="text-sm font-mono text-[#F2F4F8]">
                {selectedTracker.currentLocation.lng.toFixed(6)}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Link
          to="/user/trackers"
          className="glass-panel p-4 text-center hover:border-[#C8FF2E]/40 transition-colors"
        >
          <MapPin className="w-5 h-5 text-[#C8FF2E] mx-auto mb-2" />
          <span className="text-sm text-[#F2F4F8]">My Trackers</span>
        </Link>
        <Link
          to="/user/wallet"
          className="glass-panel p-4 text-center hover:border-[#C8FF2E]/40 transition-colors"
        >
          <Wallet className="w-5 h-5 text-[#C8FF2E] mx-auto mb-2" />
          <span className="text-sm text-[#F2F4F8]">Wallet</span>
        </Link>
        <Link
          to="/user/subscription"
          className="glass-panel p-4 text-center hover:border-[#C8FF2E]/40 transition-colors"
        >
          <Clock className="w-5 h-5 text-[#C8FF2E] mx-auto mb-2" />
          <span className="text-sm text-[#F2F4F8]">Subscription</span>
        </Link>
        <Link
          to="/user/settings"
          className="glass-panel p-4 text-center hover:border-[#C8FF2E]/40 transition-colors"
        >
          <Settings className="w-5 h-5 text-[#C8FF2E] mx-auto mb-2" />
          <span className="text-sm text-[#F2F4F8]">Settings</span>
        </Link>
      </div>

      {/* Subscription Status */}
      <div className="glass-panel p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-[#F2F4F8]">Subscription Status</h3>
            <p className="text-xs text-[#A6AEB8]">
              {tracker?.subscription_expires_at 
                ? `Expires: ${new Date(tracker.subscription_expires_at).toLocaleDateString()}`
                : 'No active subscription'}
            </p>
          </div>
          <Link
            to="/user/subscription"
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              isSubscriptionExpired
                ? 'bg-red-500/20 text-red-400'
                : 'bg-[#C8FF2E]/20 text-[#C8FF2E]'
            }`}
          >
            {isSubscriptionExpired ? 'Renew' : 'Manage'}
          </Link>
        </div>
      </div>
    </div>
  );
}

export default EndUserDashboard;
