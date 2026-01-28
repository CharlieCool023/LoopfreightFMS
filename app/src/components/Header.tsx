import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bell, User, Search, Menu } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useNotificationStore } from '@/store/notificationStore';

export function Header() {
  const { user } = useAuthStore();
  const { unreadCount } = useNotificationStore();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const getDashboardLink = () => {
    if (!user) return '/login';
    switch (user.role) {
      case 'super_admin':
        return '/admin/dashboard';
      case 'partner':
        return '/partner/dashboard';
      case 'end_user':
        return '/user/dashboard';
      default:
        return '/dashboard';
    }
  };

  const getNotificationLink = () => {
    if (!user) return '/login';
    switch (user.role) {
      case 'super_admin':
        return '/admin/notifications';
      case 'partner':
        return '/partner/notifications';
      case 'end_user':
        return '/user/notifications';
      default:
        return '/notifications';
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-[#0B0C0F]/95 backdrop-blur-lg border-b border-[#C8FF2E]/10 z-50">
      <div className="flex items-center justify-between h-full px-4 lg:px-6">
        {/* Left - Logo & Search */}
        <div className="flex items-center gap-4">
          <Link to={getDashboardLink()} className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#C8FF2E]/10 border border-[#C8FF2E]/30 flex items-center justify-center">
              <span className="text-[#C8FF2E] font-bold text-sm">LF</span>
            </div>
            <span className="hidden sm:block text-lg font-bold text-[#F2F4F8]">LoopFreight</span>
          </Link>

          {/* Search */}
          <div className="hidden md:flex items-center">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A6AEB8]" />
              <input
                type="text"
                placeholder="Search..."
                className="input-dark pl-10 pr-4 py-2 text-sm w-64"
              />
            </div>
          </div>
        </div>

        {/* Right - Actions */}
        <div className="flex items-center gap-3">
          {/* Notifications */}
          <Link
            to={getNotificationLink()}
            className="relative p-2 text-[#A6AEB8] hover:text-[#F2F4F8] transition-colors"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-[#C8FF2E] text-[#0B0C0F] text-xs font-bold rounded-full flex items-center justify-center">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </Link>

          {/* Profile */}
          <div className="relative">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-2 p-1 rounded-lg hover:bg-[#1a1f2a] transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-[#C8FF2E]/10 border border-[#C8FF2E]/30 flex items-center justify-center">
                <User className="w-4 h-4 text-[#C8FF2E]" />
              </div>
              <span className="hidden sm:block text-sm text-[#F2F4F8]">{user?.full_name || 'User'}</span>
            </button>

            {/* Profile Dropdown */}
            {isProfileOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-[#12151C] border border-[#C8FF2E]/20 rounded-lg shadow-xl z-50">
                <div className="p-3 border-b border-[#C8FF2E]/10">
                  <p className="text-sm font-medium text-[#F2F4F8]">{user?.full_name}</p>
                  <p className="text-xs text-[#A6AEB8]">{user?.email}</p>
                </div>
                <div className="p-2">
                  <Link
                    to={getDashboardLink().replace('/dashboard', '/settings')}
                    className="block px-3 py-2 text-sm text-[#A6AEB8] hover:text-[#F2F4F8] hover:bg-[#1a1f2a] rounded transition-colors"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    Settings
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
