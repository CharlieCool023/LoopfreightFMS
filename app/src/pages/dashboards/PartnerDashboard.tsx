import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  MapPin, Wallet, Bell, Plus, ArrowRight, TrendingUp,
  Car, AlertTriangle, CheckCircle, Clock
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useTrackerStore } from '@/store/trackerStore';
import { useWalletStore } from '@/store/walletStore';
import { useNotificationStore } from '@/store/notificationStore';
import { useTrackerSimulation } from '@/hooks/useTrackerSimulation';
import { getPartnerByUserId } from '@/lib/mockData';
import type { Tracker } from '@/types';

export function PartnerDashboard() {
  const { user } = useAuthStore();
  const { trackers, loadTrackers } = useTrackerStore();
  const { balance, loadWallet } = useWalletStore();
  const { unreadCount, loadNotifications } = useNotificationStore();
  const { trackers: simulatedTrackers, getStatistics } = useTrackerSimulation();
  
  const [partner, setPartner] = useState(() => getPartnerByUserId(user?.id || ''));
  const stats = getStatistics();

  useEffect(() => {
    if (user && partner) {
      loadTrackers(partner.id, 'partner');
      loadWallet(user.id, 'partner');
      loadNotifications(user.id);
    }
  }, [user, partner]);

  const activeTrackers = trackers.filter(t => t.status === 'active').length;
  const expiredTrackers = trackers.filter(t => t.status === 'expired').length;

  const quickStats = [
    {
      title: 'Total Trackers',
      value: trackers.length,
      icon: MapPin,
      color: 'text-[#C8FF2E]',
      link: '/partner/trackers',
    },
    {
      title: 'Active',
      value: activeTrackers,
      icon: CheckCircle,
      color: 'text-green-400',
      link: '/partner/trackers',
    },
    {
      title: 'Wallet Balance',
      value: `₦${balance.toLocaleString()}`,
      icon: Wallet,
      color: 'text-[#C8FF2E]',
      link: '/partner/wallet',
    },
    {
      title: 'Notifications',
      value: unreadCount,
      icon: Bell,
      color: 'text-yellow-400',
      link: '/partner/notifications',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#F2F4F8]">
            Welcome back, {user?.full_name.split(' ')[0]}
          </h1>
          <p className="text-sm text-[#A6AEB8]">
            {partner?.company_name} • {trackers.length} trackers
          </p>
        </div>
        <Link
          to="/partner/trackers/add"
          className="btn-primary inline-flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Tracker
        </Link>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {quickStats.map((stat, i) => (
          <Link
            key={i}
            to={stat.link}
            className="glass-panel p-4 hover:border-[#C8FF2E]/40 transition-colors"
          >
            <div className="flex items-start justify-between mb-2">
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
              <ArrowRight className="w-4 h-4 text-[#A6AEB8]" />
            </div>
            <p className="text-2xl font-bold text-[#F2F4F8]">{stat.value}</p>
            <p className="text-xs text-[#A6AEB8]">{stat.title}</p>
          </Link>
        ))}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Live Map Preview */}
        <div className="lg:col-span-2 glass-panel p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-[#F2F4F8]">Live Fleet Status</h2>
            <Link to="/partner/trackers" className="text-sm text-[#C8FF2E] hover:underline">
              View all
            </Link>
          </div>

          {/* Status Summary */}
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="bg-[#0B0C0F]/50 rounded-lg p-3 text-center border border-[#C8FF2E]/20">
              <p className="text-xl font-bold text-[#C8FF2E]">{stats.moving}</p>
              <p className="text-xs text-[#A6AEB8]">Moving</p>
            </div>
            <div className="bg-[#0B0C0F]/50 rounded-lg p-3 text-center border border-yellow-500/20">
              <p className="text-xl font-bold text-yellow-400">{stats.idle}</p>
              <p className="text-xs text-[#A6AEB8]">Idle</p>
            </div>
            <div className="bg-[#0B0C0F]/50 rounded-lg p-3 text-center border border-red-500/20">
              <p className="text-xl font-bold text-red-400">{stats.offline}</p>
              <p className="text-xs text-[#A6AEB8]">Offline</p>
            </div>
          </div>

          {/* Trackers List */}
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {simulatedTrackers.slice(0, 5).map((tracker) => (
              <Link
                key={tracker.id}
                to={`/partner/trackers/${tracker.id}`}
                className="flex items-center justify-between p-3 bg-[#0B0C0F]/50 rounded-lg hover:bg-[#C8FF2E]/5 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${
                    tracker.is_moving ? 'bg-[#C8FF2E]' : 
                    tracker.ignition_status ? 'bg-yellow-400' : 'bg-red-400'
                  }`} />
                  <div>
                    <p className="text-sm font-medium text-[#F2F4F8]">{tracker.name}</p>
                    <p className="text-xs text-[#A6AEB8]">{tracker.device_id}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-[#F2F4F8]">{Math.round(tracker.speed)} km/h</p>
                  <p className="text-xs text-[#A6AEB8]">
                    {tracker.is_moving ? 'Moving' : tracker.ignition_status ? 'Idle' : 'Offline'}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Side Panel */}
        <div className="space-y-4">
          {/* Alerts */}
          <div className="glass-panel p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-[#F2F4F8]">Alerts</h2>
              {expiredTrackers > 0 && (
                <span className="px-2 py-1 bg-red-500/20 text-red-400 text-xs rounded-full">
                  {expiredTrackers} expired
                </span>
              )}
            </div>

            {expiredTrackers > 0 ? (
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg mb-3">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-red-400 font-medium">Subscription Expired</p>
                    <p className="text-xs text-[#A6AEB8]">
                      {expiredTrackers} tracker{expiredTrackers > 1 ? 's' : ''} need renewal
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-3 bg-[#C8FF2E]/10 border border-[#C8FF2E]/30 rounded-lg">
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-[#C8FF2E] mt-0.5" />
                  <div>
                    <p className="text-sm text-[#C8FF2E] font-medium">All Good</p>
                    <p className="text-xs text-[#A6AEB8]">No alerts at the moment</p>
                  </div>
                </div>
              </div>
            )}

            <Link
              to="/partner/subscription"
              className="block w-full py-2 text-center text-sm text-[#C8FF2E] hover:underline"
            >
              Manage Subscriptions
            </Link>
          </div>

          {/* Quick Actions */}
          <div className="glass-panel p-5">
            <h2 className="text-lg font-semibold text-[#F2F4F8] mb-4">Quick Actions</h2>
            <div className="space-y-2">
              <Link
                to="/partner/trackers/bulk-add"
                className="flex items-center gap-3 p-3 bg-[#0B0C0F]/50 rounded-lg hover:bg-[#C8FF2E]/5 transition-colors"
              >
                <Plus className="w-4 h-4 text-[#C8FF2E]" />
                <span className="text-sm text-[#F2F4F8]">Add Multiple Trackers</span>
              </Link>
              <Link
                to="/partner/geofencing"
                className="flex items-center gap-3 p-3 bg-[#0B0C0F]/50 rounded-lg hover:bg-[#C8FF2E]/5 transition-colors"
              >
                <MapPin className="w-4 h-4 text-[#C8FF2E]" />
                <span className="text-sm text-[#F2F4F8]">Set Up Geofences</span>
              </Link>
              <Link
                to="/partner/wallet"
                className="flex items-center gap-3 p-3 bg-[#0B0C0F]/50 rounded-lg hover:bg-[#C8FF2E]/5 transition-colors"
              >
                <Wallet className="w-4 h-4 text-[#C8FF2E]" />
                <span className="text-sm text-[#F2F4F8]">Fund Wallet</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="glass-panel p-6">
        <h2 className="text-lg font-semibold text-[#F2F4F8] mb-4">Recent Activity</h2>
        <div className="space-y-3">
          {trackers.slice(0, 3).map((tracker) => (
            <div
              key={tracker.id}
              className="flex items-center justify-between p-3 bg-[#0B0C0F]/50 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <Car className="w-4 h-4 text-[#C8FF2E]" />
                <div>
                  <p className="text-sm font-medium text-[#F2F4F8]">{tracker.name}</p>
                  <p className="text-xs text-[#A6AEB8]">
                    Last seen: {tracker.last_seen ? new Date(tracker.last_seen).toLocaleString() : 'Never'}
                  </p>
                </div>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs ${
                tracker.status === 'active' ? 'bg-[#C8FF2E]/20 text-[#C8FF2E]' :
                tracker.status === 'expired' ? 'bg-red-500/20 text-red-400' :
                'bg-yellow-500/20 text-yellow-400'
              }`}>
                {tracker.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default PartnerDashboard;
