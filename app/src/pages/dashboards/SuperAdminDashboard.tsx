import { useEffect } from 'react';
import { 
  Users, MapPin, TrendingUp, Wallet, Activity, 
  ArrowUpRight, ArrowDownRight, UserPlus, CreditCard 
} from 'lucide-react';
import { mockAnalytics, mockUsers, mockTrackers } from '@/lib/mockData';
import { trackerSimulation } from '@/lib/trackerSimulation';
import { useTrackerSimulation } from '@/hooks/useTrackerSimulation';

export function SuperAdminDashboard() {
  const { trackers: simulatedTrackers, getStatistics } = useTrackerSimulation();
  const stats = getStatistics();

  useEffect(() => {
    trackerSimulation.start();
    return () => trackerSimulation.stop();
  }, []);

  const analytics = mockAnalytics;

  const statCards = [
    {
      title: 'Total Users',
      value: analytics.total_users,
      change: '+12%',
      trend: 'up',
      icon: Users,
      color: 'text-[#C8FF2E]',
    },
    {
      title: 'Active Trackers',
      value: stats.moving + stats.idle,
      change: '+8%',
      trend: 'up',
      icon: MapPin,
      color: 'text-[#C8FF2E]',
    },
    {
      title: 'Total Revenue',
      value: `₦${analytics.total_revenue.toLocaleString()}`,
      change: '+23%',
      trend: 'up',
      icon: TrendingUp,
      color: 'text-[#C8FF2E]',
    },
    {
      title: 'Monthly MRR',
      value: `₦${analytics.monthly_recurring_revenue.toLocaleString()}`,
      change: '+5%',
      trend: 'up',
      icon: Wallet,
      color: 'text-[#C8FF2E]',
    },
  ];

  const recentUsers = mockUsers.slice(-5);
  const recentTrackers = mockTrackers.slice(-5);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#F2F4F8]">Super Admin Dashboard</h1>
          <p className="text-sm text-[#A6AEB8]">Overview of the entire platform</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-2 px-3 py-1 bg-[#C8FF2E]/10 border border-[#C8FF2E]/30 rounded-full text-sm text-[#C8FF2E]">
            <Activity className="w-4 h-4" />
            System Online
          </span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, i) => (
          <div key={i} className="glass-panel p-5">
            <div className="flex items-start justify-between mb-4">
              <div className={`w-10 h-10 rounded-lg bg-[#C8FF2E]/10 flex items-center justify-center`}>
                <card.icon className={`w-5 h-5 ${card.color}`} />
              </div>
              <span className={`flex items-center gap-1 text-xs ${
                card.trend === 'up' ? 'text-green-400' : 'text-red-400'
              }`}>
                {card.trend === 'up' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {card.change}
              </span>
            </div>
            <p className="text-2xl font-bold text-[#F2F4F8]">{card.value}</p>
            <p className="text-sm text-[#A6AEB8]">{card.title}</p>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tracker Status */}
        <div className="lg:col-span-2 glass-panel p-6">
          <h2 className="text-lg font-semibold text-[#F2F4F8] mb-4">Live Tracker Status</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-[#0B0C0F]/50 rounded-lg p-4 text-center border border-[#C8FF2E]/20">
              <p className="text-2xl font-bold text-[#C8FF2E]">{stats.moving}</p>
              <p className="text-xs text-[#A6AEB8]">Moving</p>
            </div>
            <div className="bg-[#0B0C0F]/50 rounded-lg p-4 text-center border border-yellow-500/20">
              <p className="text-2xl font-bold text-yellow-400">{stats.idle}</p>
              <p className="text-xs text-[#A6AEB8]">Idle</p>
            </div>
            <div className="bg-[#0B0C0F]/50 rounded-lg p-4 text-center border border-red-500/20">
              <p className="text-2xl font-bold text-red-400">{stats.offline}</p>
              <p className="text-xs text-[#A6AEB8]">Offline</p>
            </div>
            <div className="bg-[#0B0C0F]/50 rounded-lg p-4 text-center border border-[#C8FF2E]/20">
              <p className="text-2xl font-bold text-[#C8FF2E]">{Math.round(stats.averageSpeed)}</p>
              <p className="text-xs text-[#A6AEB8]">Avg Speed (km/h)</p>
            </div>
          </div>

          {/* Simulated Trackers List */}
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {simulatedTrackers.slice(0, 5).map((tracker) => (
              <div
                key={tracker.id}
                className="flex items-center justify-between p-3 bg-[#0B0C0F]/50 rounded-lg"
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
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="glass-panel p-6">
          <h2 className="text-lg font-semibold text-[#F2F4F8] mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <button className="w-full flex items-center gap-3 p-3 bg-[#C8FF2E]/10 border border-[#C8FF2E]/30 rounded-lg hover:bg-[#C8FF2E]/20 transition-colors">
              <UserPlus className="w-5 h-5 text-[#C8FF2E]" />
              <span className="text-sm text-[#F2F4F8]">Create Office Admin</span>
            </button>
            <button className="w-full flex items-center gap-3 p-3 bg-[#0B0C0F]/50 border border-[#C8FF2E]/20 rounded-lg hover:bg-[#C8FF2E]/5 transition-colors">
              <CreditCard className="w-5 h-5 text-[#C8FF2E]" />
              <span className="text-sm text-[#F2F4F8]">Manage Subscriptions</span>
            </button>
            <button className="w-full flex items-center gap-3 p-3 bg-[#0B0C0F]/50 border border-[#C8FF2E]/20 rounded-lg hover:bg-[#C8FF2E]/5 transition-colors">
              <MapPin className="w-5 h-5 text-[#C8FF2E]" />
              <span className="text-sm text-[#F2F4F8]">View All Trackers</span>
            </button>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Users */}
        <div className="glass-panel p-6">
          <h2 className="text-lg font-semibold text-[#F2F4F8] mb-4">Recent Users</h2>
          <div className="space-y-3">
            {recentUsers.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between p-3 bg-[#0B0C0F]/50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#C8FF2E]/10 flex items-center justify-center">
                    <span className="text-[#C8FF2E] text-xs font-semibold">
                      {user.full_name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#F2F4F8]">{user.full_name}</p>
                    <p className="text-xs text-[#A6AEB8]">{user.email}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  user.role === 'super_admin' ? 'bg-purple-500/20 text-purple-400' :
                  user.role === 'partner' ? 'bg-[#C8FF2E]/20 text-[#C8FF2E]' :
                  'bg-blue-500/20 text-blue-400'
                }`}>
                  {user.role}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Trackers */}
        <div className="glass-panel p-6">
          <h2 className="text-lg font-semibold text-[#F2F4F8] mb-4">Recent Trackers</h2>
          <div className="space-y-3">
            {recentTrackers.map((tracker) => (
              <div
                key={tracker.id}
                className="flex items-center justify-between p-3 bg-[#0B0C0F]/50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${
                    tracker.status === 'active' ? 'bg-[#C8FF2E]' :
                    tracker.status === 'inactive' ? 'bg-yellow-400' : 'bg-red-400'
                  }`} />
                  <div>
                    <p className="text-sm font-medium text-[#F2F4F8]">{tracker.name}</p>
                    <p className="text-xs text-[#A6AEB8]">{tracker.device_id}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  tracker.status === 'active' ? 'bg-[#C8FF2E]/20 text-[#C8FF2E]' :
                  tracker.status === 'inactive' ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-red-500/20 text-red-400'
                }`}>
                  {tracker.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SuperAdminDashboard;
