import { create } from 'zustand';
import type { Notification, NotificationType } from '@/types';
import { mockNotifications, getNotificationsByUser } from '@/lib/mockData';
import { v4 as uuidv4 } from 'uuid';

interface NotificationState {
  // State
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;

  // Actions
  loadNotifications: (userId: string) => void;
  addNotification: (notification: Omit<Notification, 'id' | 'created_at'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: (userId: string) => void;
  deleteNotification: (id: string) => void;
  clearAll: (userId: string) => void;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  // Initial state
  notifications: [],
  unreadCount: 0,
  isLoading: false,

  // Load notifications for a user
  loadNotifications: (userId: string) => {
    set({ isLoading: true });
    
    const notifications = getNotificationsByUser(userId);
    const unreadCount = notifications.filter(n => !n.is_read).length;
    
    set({ 
      notifications, 
      unreadCount,
      isLoading: false,
    });
  },

  // Add new notification
  addNotification: (notificationData) => {
    const newNotification: Notification = {
      ...notificationData,
      id: uuidv4(),
      created_at: new Date().toISOString(),
    };
    
    mockNotifications.push(newNotification);
    
    set(state => ({
      notifications: [newNotification, ...state.notifications],
      unreadCount: state.unreadCount + 1,
    }));
  },

  // Mark notification as read
  markAsRead: (id: string) => {
    const notification = mockNotifications.find(n => n.id === id);
    
    if (notification && !notification.is_read) {
      notification.is_read = true;
      
      set(state => ({
        notifications: state.notifications.map(n => 
          n.id === id ? { ...n, is_read: true } : n
        ),
        unreadCount: Math.max(0, state.unreadCount - 1),
      }));
    }
  },

  // Mark all notifications as read
  markAllAsRead: (userId: string) => {
    mockNotifications.forEach(n => {
      if (n.user_id === userId) {
        n.is_read = true;
      }
    });
    
    set(state => ({
      notifications: state.notifications.map(n => 
        n.user_id === userId ? { ...n, is_read: true } : n
      ),
      unreadCount: 0,
    }));
  },

  // Delete notification
  deleteNotification: (id: string) => {
    const index = mockNotifications.findIndex(n => n.id === id);
    
    if (index !== -1) {
      const wasUnread = !mockNotifications[index].is_read;
      mockNotifications.splice(index, 1);
      
      set(state => ({
        notifications: state.notifications.filter(n => n.id !== id),
        unreadCount: wasUnread ? Math.max(0, state.unreadCount - 1) : state.unreadCount,
      }));
    }
  },

  // Clear all notifications for a user
  clearAll: (userId: string) => {
    const indicesToRemove: number[] = [];
    mockNotifications.forEach((n, index) => {
      if (n.user_id === userId) {
        indicesToRemove.push(index);
      }
    });
    
    // Remove in reverse order to maintain indices
    indicesToRemove.reverse().forEach(index => {
      mockNotifications.splice(index, 1);
    });
    
    set({
      notifications: [],
      unreadCount: 0,
    });
  },
}));

export default useNotificationStore;
