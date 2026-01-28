import { useEffect, useState } from 'react';
import { TrendingUp, Users, MapPin, CreditCard, Calendar } from 'lucide-react';
import { mockAnalytics, mockTrackers, mockUsers } from '@/lib/mockData';
import { useTrackerSimulation } from '@/hooks/useTrackerSimulation';

export function AnalyticsPage() {
  const { getStatistics } = useTrackerSimulation();
  const stats = getStatistics();
  const [timeRange, setTimeRange] = useState('7d');

  const analytics = mockAnalytics;

  const statCards = [
    {
      title: 'Total Users',
      value: analytics.total_users,
      change: '+12%',
      icon: Users,
      color: 'text-[#C8FF2E]',
    },
    {
      title: 'Active Trackers',
      value: stats.moving + stats.idle,
      change: '+8%',
      icon: MapPin,
      color: 'text-[#C8FF2E]',
    },
    {
      title: 'Total Revenue',
      value: `₦${analytics.total_revenue.toLocaleString()}`,
      change: '+23%',
      icon: CreditCard,
      color: 'text-[#C8FF2E]',
    },
    {
      title: 'Monthly MRR',
      value: `₦${analytics.monthly_recurring_revenue.toLocaleString()}`,
      change: '+5%',
      icon: TrendingUp,
      color: 'text-[#C8FF2E]',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#F2F4F8]">Analytics</h1>
          <p className="text-sm text-[#A6AEB8]">Platform performance and insights</p>
        </div>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="input-dark"
        >
          <option value="24h">Last 24 hours</option>
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
          <option value="90d">Last 90 days</option>
        </select>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, i) => (
          <div key={i} className="glass-panel p-5">
            <div className="flex items-start justify-between mb-4">
              <div className={`w-10 h-10 rounded-lg bg-[#C8FF2E]/10 flex items-center justify-center`}>
                <card.icon className={`w-5 h-5 ${card.color}`} />
              </div>
              <span className="text-xs text-green-400">{card.change}</span>
            </div>
            <p className="text-2xl font-bold text-[#F2F4F8]">{card.value}</p>
            <p className="text-sm text-[#A6AEB8]">{card.title}</p>
          </div>
        ))}
      </div>

      {/* Charts Placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-panel p-6">
          <h2 className="text-lg font-semibold text-[#F2F4F8] mb-4">Revenue Over Time</h2>
          <div className="h-64 flex items-center justify-center bg-[#0B0C0F]/50 rounded-lg">
            <div className="text-center">
              <TrendingUp className="w-12 h-12 text-[#A6AEB8] mx-auto mb-3" />
              <p className="text-sm text-[#A6AEB8]">Revenue chart will be displayed here</p>
            </div>
          </div>
        </div>

        <div className="glass-panel p-6">
          <h2 className="text-lg font-semibold text-[#F2F4F8] mb-4">User Growth</h2>
          <div className="h-64 flex items-center justify-center bg-[#0B0C0F]/50 rounded-lg">
            <div className="text-center">
              <Users className="w-12 h-12 text-[#A6AEB8] mx-auto mb-3" />
              <p className="text-sm text-[#A6AEB8]">User growth chart will be displayed here</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tracker Activity */}
      <div className="glass-panel p-6">
        <h2 className="text-lg font-semibold text-[#F2F4F8] mb-4">Tracker Activity</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-[#0B0C0F]/50 rounded-lg p-4 text-center">
            <p className="text-3xl font-bold text-[#C8FF2E]">{stats.moving}</p>
            <p className="text-sm text-[#A6AEB8]">Moving</p>
          </div>
          <div className="bg-[#0B0C0F]/50 rounded-lg p-4 text-center">
            <p className="text-3xl font-bold text-yellow-400">{stats.idle}</p>
            <p className="text-sm text-[#A6AEB8]">Idle</p>
          </div>
          <div className="bg-[#0B0C0F]/50 rounded-lg p-4 text-center">
            <p className="text-3xl font-bold text-red-400">{stats.offline}</p>
            <p className="text-sm text-[#A6AEB8]">Offline</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AnalyticsPage;
