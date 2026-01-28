import { useEffect } from 'react';
import { Bell, CheckCircle, Trash2, AlertTriangle, MapPin, Clock, Gauge } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useNotificationStore } from '@/store/notificationStore';

export function NotificationsPage() {
  const { user } = useAuthStore();
  const { notifications, loadNotifications, markAsRead, markAllAsRead, deleteNotification, clearAll } = useNotificationStore();

  useEffect(() => {
    if (user) {
      loadNotifications(user.id);
    }
  }, [user]);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'speed_alert':
        return <Gauge className="w-5 h-5 text-red-400" />;
      case 'geofence_breach':
        return <MapPin className="w-5 h-5 text-yellow-400" />;
      case 'subscription_expiry':
        return <Clock className="w-5 h-5 text-orange-400" />;
      case 'curfew_breach':
        return <AlertTriangle className="w-5 h-5 text-purple-400" />;
      default:
        return <Bell className="w-5 h-5 text-[#C8FF2E]" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'speed_alert':
        return 'border-red-500/30 bg-red-500/5';
      case 'geofence_breach':
        return 'border-yellow-500/30 bg-yellow-500/5';
      case 'subscription_expiry':
        return 'border-orange-500/30 bg-orange-500/5';
      case 'curfew_breach':
        return 'border-purple-500/30 bg-purple-500/5';
      default:
        return 'border-[#C8FF2E]/30 bg-[#C8FF2E]/5';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#F2F4F8]">Notifications</h1>
          <p className="text-sm text-[#A6AEB8]">Stay updated on your fleet activity</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => user && markAllAsRead(user.id)}
            className="btn-secondary text-sm"
          >
            Mark all read
          </button>
          <button
            onClick={() => user && clearAll(user.id)}
            className="text-sm text-red-400 hover:text-red-300 px-4 py-2"
          >
            Clear all
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="glass-panel p-6">
        {notifications.length > 0 ? (
          <div className="space-y-3">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`flex items-start gap-4 p-4 rounded-lg border ${
                  notification.is_read
                    ? 'border-[#C8FF2E]/10 bg-[#0B0C0F]/30'
                    : getNotificationColor(notification.type)
                }`}
              >
                <div className="w-10 h-10 rounded-lg bg-[#12151C] flex items-center justify-center flex-shrink-0">
                  {getNotificationIcon(notification.type)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className={`font-medium ${notification.is_read ? 'text-[#A6AEB8]' : 'text-[#F2F4F8]'}`}>
                        {notification.title}
                      </p>
                      <p className="text-sm text-[#A6AEB8] mt-1">{notification.message}</p>
                    </div>
                    <span className="text-xs text-[#A6AEB8] whitespace-nowrap">
                      {new Date(notification.created_at).toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  {!notification.is_read && (
                    <button
                      onClick={() => markAsRead(notification.id)}
                      className="p-2 text-[#C8FF2E] hover:bg-[#C8FF2E]/10 rounded-lg transition-colors"
                      title="Mark as read"
                    >
                      <CheckCircle className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={() => deleteNotification(notification.id)}
                    className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Bell className="w-12 h-12 text-[#A6AEB8] mx-auto mb-3" />
            <p className="text-[#A6AEB8]">No notifications yet</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default NotificationsPage;
