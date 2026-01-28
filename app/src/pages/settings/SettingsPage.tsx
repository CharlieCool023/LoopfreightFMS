import { useState } from 'react';
import { Bell, Mail, MessageSquare, Shield, User, Save } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

export function SettingsPage() {
  const { user, updateNotificationSettings } = useAuthStore();
  
  const [settings, setSettings] = useState({
    email_notifications: user?.notification_settings?.email_notifications ?? true,
    sms_notifications: user?.notification_settings?.sms_notifications ?? false,
    push_notifications: user?.notification_settings?.push_notifications ?? true,
    speed_alerts: user?.notification_settings?.speed_alerts ?? true,
    geofence_alerts: user?.notification_settings?.geofence_alerts ?? true,
    subscription_alerts: user?.notification_settings?.subscription_alerts ?? true,
    curfew_alerts: user?.notification_settings?.curfew_alerts ?? false,
    maintenance_alerts: user?.notification_settings?.maintenance_alerts ?? false,
  });

  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleToggle = (key: keyof typeof settings) => {
    setSettings({ ...settings, [key]: !settings[key] });
  };

  const handleSave = async () => {
    setIsSaving(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    updateNotificationSettings(settings);
    
    setIsSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const notificationGroups = [
    {
      title: 'General Notifications',
      icon: Bell,
      items: [
        { key: 'email_notifications', label: 'Email notifications', description: 'Receive updates via email' },
        { key: 'sms_notifications', label: 'SMS notifications', description: 'Receive updates via SMS' },
        { key: 'push_notifications', label: 'Push notifications', description: 'Receive browser push notifications' },
      ],
    },
    {
      title: 'Alert Types',
      icon: MessageSquare,
      items: [
        { key: 'speed_alerts', label: 'Speed alerts', description: 'Get notified when vehicles exceed speed limits' },
        { key: 'geofence_alerts', label: 'Geofence alerts', description: 'Get notified about zone entry/exit' },
        { key: 'subscription_alerts', label: 'Subscription alerts', description: 'Get notified about subscription expiry' },
        { key: 'curfew_alerts', label: 'Curfew alerts', description: 'Get notified about after-hours activity' },
        { key: 'maintenance_alerts', label: 'Maintenance alerts', description: 'Get notified about scheduled maintenance' },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#F2F4F8]">Settings</h1>
        <p className="text-sm text-[#A6AEB8]">Manage your account and notification preferences</p>
      </div>

      {/* Profile Section */}
      <div className="glass-panel p-6">
        <div className="flex items-center gap-3 mb-4">
          <User className="w-5 h-5 text-[#C8FF2E]" />
          <h2 className="text-lg font-semibold text-[#F2F4F8]">Profile Information</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[#F2F4F8] mb-2">
              Full Name
            </label>
            <input
              type="text"
              value={user?.full_name || ''}
              disabled
              className="input-dark w-full opacity-50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#F2F4F8] mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={user?.email || ''}
              disabled
              className="input-dark w-full opacity-50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#F2F4F8] mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              value={user?.phone || ''}
              disabled
              className="input-dark w-full opacity-50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#F2F4F8] mb-2">
              Account Type
            </label>
            <input
              type="text"
              value={user?.role || ''}
              disabled
              className="input-dark w-full opacity-50 capitalize"
            />
          </div>
        </div>
      </div>

      {/* Notification Settings */}
      {notificationGroups.map((group, groupIndex) => (
        <div key={groupIndex} className="glass-panel p-6">
          <div className="flex items-center gap-3 mb-4">
            <group.icon className="w-5 h-5 text-[#C8FF2E]" />
            <h2 className="text-lg font-semibold text-[#F2F4F8]">{group.title}</h2>
          </div>
          
          <div className="space-y-4">
            {group.items.map((item) => {
              const key = item.key as keyof typeof settings;
              return (
                <div
                  key={item.key}
                  className="flex items-center justify-between p-4 bg-[#0B0C0F]/50 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-[#F2F4F8]">{item.label}</p>
                    <p className="text-xs text-[#A6AEB8]">{item.description}</p>
                  </div>
                  <button
                    onClick={() => handleToggle(key)}
                    className={`relative w-12 h-6 rounded-full transition-colors ${
                      settings[key] ? 'bg-[#C8FF2E]' : 'bg-[#A6AEB8]/30'
                    }`}
                  >
                    <span
                      className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                        settings[key] ? 'translate-x-7' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {/* Security Section */}
      <div className="glass-panel p-6">
        <div className="flex items-center gap-3 mb-4">
          <Shield className="w-5 h-5 text-[#C8FF2E]" />
          <h2 className="text-lg font-semibold text-[#F2F4F8]">Security</h2>
        </div>
        
        <div className="space-y-3">
          <button className="w-full flex items-center justify-between p-4 bg-[#0B0C0F]/50 rounded-lg hover:bg-[#C8FF2E]/5 transition-colors">
            <div>
              <p className="font-medium text-[#F2F4F8]">Change Password</p>
              <p className="text-xs text-[#A6AEB8]">Update your account password</p>
            </div>
            <span className="text-[#C8FF2E]">→</span>
          </button>
          
          <button className="w-full flex items-center justify-between p-4 bg-[#0B0C0F]/50 rounded-lg hover:bg-[#C8FF2E]/5 transition-colors">
            <div>
              <p className="font-medium text-[#F2F4F8]">Two-Factor Authentication</p>
              <p className="text-xs text-[#A6AEB8]">Add an extra layer of security</p>
            </div>
            <span className="text-[#C8FF2E]">→</span>
          </button>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex items-center justify-end gap-4">
        {saved && (
          <span className="text-sm text-green-400">Settings saved successfully!</span>
        )}
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="btn-primary flex items-center gap-2 disabled:opacity-50"
        >
          {isSaving ? (
            <div className="w-4 h-4 border-2 border-[#0B0C0F] border-t-transparent rounded-full animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          Save Changes
        </button>
      </div>
    </div>
  );
}

export default SettingsPage;
