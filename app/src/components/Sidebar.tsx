import { Link, useLocation } from 'react-router-dom';
import type { UserRole } from '@/types';
import {
  LayoutDashboard,
  MapPin,
  Wallet,
  CreditCard,
  Bell,
  Settings,
  Users,
  BarChart3,
  Hexagon,
  Plus,
  LogOut,
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

interface SidebarProps {
  userRole?: UserRole;
}

export function Sidebar({ userRole }: SidebarProps) {
  const location = useLocation();
  const { logout } = useAuthStore();

  const isActive = (path: string) => location.pathname.startsWith(path);

  const getNavItems = () => {
    const basePath = userRole === 'super_admin' ? '/admin' : userRole === 'partner' ? '/partner' : '/user';

    const commonItems = [
      { label: 'Dashboard', icon: LayoutDashboard, href: `${basePath}/dashboard` },
      { label: 'Trackers', icon: MapPin, href: `${basePath}/trackers` },
      { label: 'Wallet', icon: Wallet, href: `${basePath}/wallet` },
      { label: 'Subscription', icon: CreditCard, href: `${basePath}/subscription` },
      { label: 'Notifications', icon: Bell, href: `${basePath}/notifications` },
      { label: 'Settings', icon: Settings, href: `${basePath}/settings` },
    ];

    if (userRole === 'super_admin') {
      return [
        { label: 'Dashboard', icon: LayoutDashboard, href: '/admin/dashboard' },
        { label: 'Users', icon: Users, href: '/admin/users' },
        { label: 'Analytics', icon: BarChart3, href: '/admin/analytics' },
        { label: 'All Trackers', icon: MapPin, href: '/admin/trackers' },
        { label: 'Notifications', icon: Bell, href: '/admin/notifications' },
        { label: 'Settings', icon: Settings, href: '/admin/settings' },
      ];
    }

    if (userRole === 'partner') {
      return [
        ...commonItems.slice(0, 2),
        { label: 'Geofencing', icon: Hexagon, href: '/partner/geofencing' },
        ...commonItems.slice(2),
      ];
    }

    return commonItems;
  };

  const navItems = getNavItems();

  return (
    <aside className="fixed left-0 top-16 w-64 h-[calc(100vh-64px)] bg-[#12151C] border-r border-[#C8FF2E]/10 overflow-y-auto z-40">
      <div className="p-4">
        {/* Quick Actions */}
        {userRole === 'partner' && (
          <div className="mb-6">
            <Link
              to="/partner/trackers/add"
              className="flex items-center gap-2 w-full px-4 py-2 bg-[#C8FF2E] text-[#0B0C0F] rounded-lg font-medium text-sm hover:bg-[#d4ff4d] transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Tracker
            </Link>
          </div>
        )}

        {/* Navigation */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            return (
              <Link
                key={item.label}
                to={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                  active
                    ? 'bg-[#C8FF2E]/10 text-[#C8FF2E] border border-[#C8FF2E]/30'
                    : 'text-[#A6AEB8] hover:bg-[#1a1f2a] hover:text-[#F2F4F8]'
                }`}
              >
                <Icon className={`w-5 h-5 ${active ? 'text-[#C8FF2E]' : ''}`} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="mt-8 pt-6 border-t border-[#C8FF2E]/10">
          <button
            onClick={logout}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-sm font-medium text-[#A6AEB8] hover:bg-red-500/10 hover:text-red-400 transition-all"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
