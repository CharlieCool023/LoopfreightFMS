import type { 
  User, Partner, EndUser, Tracker, Subscription, 
  WalletTransaction, Notification, DashboardAnalytics,
  SimulatedTracker, GeoLocation
} from '@/types';
import { v4 as uuidv4 } from 'uuid';

// Re-export uuidv4 for use in other files
export { uuidv4 };

// Mock Users
export const mockUsers: User[] = [
  {
    id: 'super-admin-1',
    email: 'superadmin@loopfreight.io',
    full_name: 'Super Administrator',
    phone: '+2348012345678',
    role: 'super_admin',
    is_verified: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    last_login: '2024-01-28T10:00:00Z',
    notification_settings: {
      email_notifications: true,
      sms_notifications: true,
      push_notifications: true,
      speed_alerts: true,
      geofence_alerts: true,
      subscription_alerts: true,
      curfew_alerts: true,
      maintenance_alerts: true,
    }
  },
  {
    id: 'office-admin-1',
    email: 'officeadmin@loopfreight.io',
    full_name: 'Office Admin',
    phone: '+2348012345679',
    role: 'office_admin',
    is_verified: true,
    created_at: '2024-01-15T00:00:00Z',
    updated_at: '2024-01-15T00:00:00Z',
    last_login: '2024-01-28T09:00:00Z',
    notification_settings: {
      email_notifications: true,
      sms_notifications: false,
      push_notifications: true,
      speed_alerts: true,
      geofence_alerts: true,
      subscription_alerts: true,
      curfew_alerts: false,
      maintenance_alerts: true,
    }
  },
  {
    id: 'partner-1',
    email: 'partner@eastridge.com',
    full_name: 'Amina K.',
    phone: '+2348012345680',
    role: 'partner',
    is_verified: true,
    created_at: '2024-01-10T00:00:00Z',
    updated_at: '2024-01-10T00:00:00Z',
    last_login: '2024-01-28T08:00:00Z',
    notification_settings: {
      email_notifications: true,
      sms_notifications: true,
      push_notifications: true,
      speed_alerts: true,
      geofence_alerts: true,
      subscription_alerts: true,
      curfew_alerts: true,
      maintenance_alerts: true,
    }
  },
  {
    id: 'enduser-1',
    email: 'user@example.com',
    full_name: 'John Doe',
    phone: '+2348012345681',
    role: 'end_user',
    is_verified: true,
    created_at: '2024-01-20T00:00:00Z',
    updated_at: '2024-01-20T00:00:00Z',
    last_login: '2024-01-28T07:00:00Z',
    notification_settings: {
      email_notifications: true,
      sms_notifications: false,
      push_notifications: true,
      speed_alerts: true,
      geofence_alerts: true,
      subscription_alerts: true,
      curfew_alerts: false,
      maintenance_alerts: false,
    }
  },
];

// Mock Partners
export const mockPartners: Partner[] = [
  {
    id: 'partner-profile-1',
    user_id: 'partner-1',
    company_name: 'Eastridge Logistics',
    business_type: 'Logistics & Transportation',
    fleet_size: 50,
    contact_email: 'partner@eastridge.com',
    contact_phone: '+2348012345680',
    address: '123 Industrial Road',
    city: 'Lagos',
    country: 'Nigeria',
    is_active: true,
    created_at: '2024-01-10T00:00:00Z',
    updated_at: '2024-01-10T00:00:00Z',
    wallet_balance: 250000,
    subscription_status: 'active',
  },
];

// Mock End Users
export const mockEndUsers: EndUser[] = [
  {
    id: 'enduser-profile-1',
    user_id: 'enduser-1',
    tracker_id: 'TRACKER-001',
    is_active: true,
    created_at: '2024-01-20T00:00:00Z',
    updated_at: '2024-01-20T00:00:00Z',
    wallet_balance: 15000,
    subscription_status: 'active',
  },
];

// Mock Trackers
export const mockTrackers: Tracker[] = [
  {
    id: 'tracker-1',
    device_id: 'DEV-001-ABC',
    name: 'Toyota Hilux - Lagos Fleet',
    owner_id: 'partner-profile-1',
    owner_type: 'partner',
    asset_type: 'truck',
    vehicle_name: 'Toyota Hilux',
    vehicle_registration: 'LAG-123-XY',
    driver_name: 'Michael Johnson',
    driver_phone: '+2348012345682',
    photos: [],
    status: 'active',
    last_location: {
      lat: 6.5244,
      lng: 3.3792,
      timestamp: '2024-01-28T10:00:00Z',
    },
    last_seen: '2024-01-28T10:00:00Z',
    speed: 45,
    ignition_status: true,
    subscription_expires_at: '2025-01-28T00:00:00Z',
    created_at: '2024-01-10T00:00:00Z',
    updated_at: '2024-01-28T10:00:00Z',
  },
  {
    id: 'tracker-2',
    device_id: 'DEV-002-DEF',
    name: 'Mercedes Sprinter - Delivery',
    owner_id: 'partner-profile-1',
    owner_type: 'partner',
    asset_type: 'van',
    vehicle_name: 'Mercedes Sprinter',
    vehicle_registration: 'LAG-456-AB',
    driver_name: 'Sarah Williams',
    driver_phone: '+2348012345683',
    photos: [],
    status: 'active',
    last_location: {
      lat: 6.5350,
      lng: 3.3680,
      timestamp: '2024-01-28T10:05:00Z',
    },
    last_seen: '2024-01-28T10:05:00Z',
    speed: 30,
    ignition_status: true,
    subscription_expires_at: '2025-01-28T00:00:00Z',
    created_at: '2024-01-10T00:00:00Z',
    updated_at: '2024-01-28T10:05:00Z',
  },
  {
    id: 'tracker-3',
    device_id: 'DEV-003-GHI',
    name: 'Honda Accord - Personal',
    owner_id: 'enduser-profile-1',
    owner_type: 'end_user',
    asset_type: 'car',
    vehicle_name: 'Honda Accord',
    vehicle_registration: 'LAG-789-CD',
    driver_name: 'John Doe',
    driver_phone: '+2348012345681',
    photos: [],
    status: 'active',
    last_location: {
      lat: 6.5100,
      lng: 3.3900,
      timestamp: '2024-01-28T09:55:00Z',
    },
    last_seen: '2024-01-28T09:55:00Z',
    speed: 0,
    ignition_status: false,
    subscription_expires_at: '2025-01-20T00:00:00Z',
    created_at: '2024-01-20T00:00:00Z',
    updated_at: '2024-01-28T09:55:00Z',
  },
  {
    id: 'tracker-4',
    device_id: 'DEV-004-JKL',
    name: 'Yamaha Motorcycle - Courier',
    owner_id: 'partner-profile-1',
    owner_type: 'partner',
    asset_type: 'bike',
    vehicle_name: 'Yamaha MT-07',
    vehicle_registration: 'LAG-321-EF',
    driver_name: 'David Okafor',
    driver_phone: '+2348012345684',
    photos: [],
    status: 'active',
    last_location: {
      lat: 6.5500,
      lng: 3.3500,
      timestamp: '2024-01-28T10:10:00Z',
    },
    last_seen: '2024-01-28T10:10:00Z',
    speed: 55,
    ignition_status: true,
    subscription_expires_at: '2025-01-28T00:00:00Z',
    created_at: '2024-01-15T00:00:00Z',
    updated_at: '2024-01-28T10:10:00Z',
  },
  {
    id: 'tracker-5',
    device_id: 'DEV-005-MNO',
    name: 'Ford F-150 - Heavy Duty',
    owner_id: 'partner-profile-1',
    owner_type: 'partner',
    asset_type: 'truck',
    vehicle_name: 'Ford F-150',
    vehicle_registration: 'LAG-654-GH',
    driver_name: 'Emmanuel Chi',
    driver_phone: '+2348012345685',
    photos: [],
    status: 'active',
    last_location: {
      lat: 6.4800,
      lng: 3.4200,
      timestamp: '2024-01-28T10:02:00Z',
    },
    last_seen: '2024-01-28T10:02:00Z',
    speed: 60,
    ignition_status: true,
    subscription_expires_at: '2025-01-28T00:00:00Z',
    created_at: '2024-01-12T00:00:00Z',
    updated_at: '2024-01-28T10:02:00Z',
  },
  {
    id: 'tracker-6',
    device_id: 'DEV-006-PQR',
    name: 'Speed Boat - Marine Ops',
    owner_id: 'partner-profile-1',
    owner_type: 'partner',
    asset_type: 'boat',
    vehicle_name: 'Coastal Speed Boat',
    vehicle_registration: 'MAR-001-XY',
    driver_name: 'Captain James',
    driver_phone: '+2348012345686',
    photos: [],
    status: 'active',
    last_location: {
      lat: 6.4333,
      lng: 3.4000,
      timestamp: '2024-01-28T09:45:00Z',
    },
    last_seen: '2024-01-28T09:45:00Z',
    speed: 25,
    ignition_status: true,
    subscription_expires_at: '2025-01-28T00:00:00Z',
    created_at: '2024-01-08T00:00:00Z',
    updated_at: '2024-01-28T09:45:00Z',
  },
  {
    id: 'tracker-7',
    device_id: 'DEV-007-STU',
    name: 'Helicopter - Air Fleet',
    owner_id: 'partner-profile-1',
    owner_type: 'partner',
    asset_type: 'helicopter',
    vehicle_name: 'Bell 407',
    vehicle_registration: '5N-ABC',
    driver_name: 'Pilot Ahmed',
    driver_phone: '+2348012345687',
    photos: [],
    status: 'active',
    last_location: {
      lat: 6.5000,
      lng: 3.4500,
      timestamp: '2024-01-28T09:30:00Z',
    },
    last_seen: '2024-01-28T09:30:00Z',
    speed: 180,
    ignition_status: true,
    subscription_expires_at: '2025-01-28T00:00:00Z',
    created_at: '2024-01-05T00:00:00Z',
    updated_at: '2024-01-28T09:30:00Z',
  },
  {
    id: 'tracker-8',
    device_id: 'DEV-008-VWX',
    name: 'Excavator - Construction',
    owner_id: 'partner-profile-1',
    owner_type: 'partner',
    asset_type: 'heavy_equipment',
    vehicle_name: 'Caterpillar 320D',
    vehicle_registration: 'EQP-001-XY',
    driver_name: 'Operator Peter',
    driver_phone: '+2348012345688',
    photos: [],
    status: 'offline',
    last_location: {
      lat: 6.4600,
      lng: 3.3800,
      timestamp: '2024-01-27T18:00:00Z',
    },
    last_seen: '2024-01-27T18:00:00Z',
    speed: 0,
    ignition_status: false,
    subscription_expires_at: '2025-01-28T00:00:00Z',
    created_at: '2024-01-03T00:00:00Z',
    updated_at: '2024-01-27T18:00:00Z',
  },
  {
    id: 'tracker-9',
    device_id: 'DEV-009-YZA',
    name: 'Private Jet - Executive',
    owner_id: 'partner-profile-1',
    owner_type: 'partner',
    asset_type: 'plane',
    vehicle_name: 'Gulfstream G450',
    vehicle_registration: '5N-XYZ',
    driver_name: 'Captain Sarah',
    driver_phone: '+2348012345689',
    photos: [],
    status: 'active',
    last_location: {
      lat: 6.5770,
      lng: 3.3210,
      timestamp: '2024-01-28T08:00:00Z',
    },
    last_seen: '2024-01-28T08:00:00Z',
    speed: 0,
    ignition_status: false,
    subscription_expires_at: '2025-01-28T00:00:00Z',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-28T08:00:00Z',
  },
  {
    id: 'tracker-10',
    device_id: 'DEV-010-BCD',
    name: 'Cargo Ship - Maritime',
    owner_id: 'partner-profile-1',
    owner_type: 'partner',
    asset_type: 'ship',
    vehicle_name: 'MV Lagos Trader',
    vehicle_registration: 'IMO-1234567',
    driver_name: 'Captain Okon',
    driver_phone: '+2348012345690',
    photos: [],
    status: 'active',
    last_location: {
      lat: 6.4167,
      lng: 3.3667,
      timestamp: '2024-01-28T09:00:00Z',
    },
    last_seen: '2024-01-28T09:00:00Z',
    speed: 12,
    ignition_status: true,
    subscription_expires_at: '2025-01-28T00:00:00Z',
    created_at: '2023-12-15T00:00:00Z',
    updated_at: '2024-01-28T09:00:00Z',
  },
];

// Mock Subscriptions
export const mockSubscriptions: Subscription[] = [
  {
    id: 'sub-1',
    user_id: 'partner-profile-1',
    tracker_id: 'tracker-1',
    tier: 'class_b',
    status: 'active',
    billing_cycle: 'yearly',
    amount: 75000,
    currency: 'NGN',
    starts_at: '2024-01-28T00:00:00Z',
    expires_at: '2025-01-28T00:00:00Z',
    auto_renew: true,
    created_at: '2024-01-28T00:00:00Z',
    updated_at: '2024-01-28T00:00:00Z',
  },
  {
    id: 'sub-2',
    user_id: 'enduser-profile-1',
    tracker_id: 'tracker-3',
    tier: 'class_a',
    status: 'active',
    billing_cycle: 'yearly',
    amount: 12000,
    currency: 'NGN',
    starts_at: '2024-01-20T00:00:00Z',
    expires_at: '2025-01-20T00:00:00Z',
    auto_renew: true,
    created_at: '2024-01-20T00:00:00Z',
    updated_at: '2024-01-20T00:00:00Z',
  },
];

// Mock Wallet Transactions
export const mockTransactions: WalletTransaction[] = [
  {
    id: 'txn-1',
    user_id: 'partner-profile-1',
    type: 'deposit',
    amount: 500000,
    currency: 'NGN',
    status: 'completed',
    description: 'Initial wallet funding',
    reference: 'WAL-001',
    created_at: '2024-01-10T00:00:00Z',
  },
  {
    id: 'txn-2',
    user_id: 'partner-profile-1',
    type: 'subscription_payment',
    amount: 75000,
    currency: 'NGN',
    status: 'completed',
    description: 'Yearly subscription - Toyota Hilux',
    reference: 'SUB-001',
    created_at: '2024-01-28T00:00:00Z',
  },
  {
    id: 'txn-3',
    user_id: 'enduser-profile-1',
    type: 'deposit',
    amount: 20000,
    currency: 'NGN',
    status: 'completed',
    description: 'Wallet funding',
    reference: 'WAL-002',
    created_at: '2024-01-20T00:00:00Z',
  },
  {
    id: 'txn-4',
    user_id: 'enduser-profile-1',
    type: 'subscription_payment',
    amount: 12000,
    currency: 'NGN',
    status: 'completed',
    description: 'Yearly subscription - Honda Accord',
    reference: 'SUB-002',
    created_at: '2024-01-20T00:00:00Z',
  },
];

// Mock Notifications
export const mockNotifications: Notification[] = [
  {
    id: 'notif-1',
    user_id: 'partner-1',
    type: 'speed_alert',
    title: 'Speed Alert',
    message: 'Toyota Hilux exceeded speed limit (120 km/h)',
    data: { tracker_id: 'tracker-1', speed: 120 },
    is_read: false,
    created_at: '2024-01-28T09:30:00Z',
  },
  {
    id: 'notif-2',
    user_id: 'partner-1',
    type: 'geofence_breach',
    title: 'Geofence Alert',
    message: 'Mercedes Sprinter entered restricted zone',
    data: { tracker_id: 'tracker-2', zone: 'Restricted Area A' },
    is_read: true,
    created_at: '2024-01-27T14:00:00Z',
  },
  {
    id: 'notif-3',
    user_id: 'enduser-1',
    type: 'subscription_expiry',
    title: 'Subscription Expiring Soon',
    message: 'Your subscription expires in 7 days. Renew now to avoid service interruption.',
    data: { tracker_id: 'tracker-3', days_remaining: 7 },
    is_read: false,
    created_at: '2024-01-21T00:00:00Z',
  },
];

// Mock Analytics
export const mockAnalytics: DashboardAnalytics = {
  total_users: 4,
  active_users: 4,
  expired_subscriptions: 0,
  total_trackers: 10,
  active_trackers: 8,
  offline_trackers: 2,
  total_revenue: 607000,
  monthly_recurring_revenue: 7250,
  recent_signups: mockUsers.slice(-2),
  recent_transactions: mockTransactions.slice(-4),
};

// Helper functions
export const getUserByEmail = (email: string): User | undefined => {
  return mockUsers.find(u => u.email === email);
};

export const getUserById = (id: string): User | undefined => {
  return mockUsers.find(u => u.id === id);
};

export const getPartnerByUserId = (userId: string): Partner | undefined => {
  return mockPartners.find(p => p.user_id === userId);
};

export const getEndUserByUserId = (userId: string): EndUser | undefined => {
  return mockEndUsers.find(e => e.user_id === userId);
};

export const getTrackersByOwner = (ownerId: string, ownerType: 'partner' | 'end_user'): Tracker[] => {
  return mockTrackers.filter(t => t.owner_id === ownerId && t.owner_type === ownerType);
};

export const getTrackerById = (id: string): Tracker | undefined => {
  return mockTrackers.find(t => t.id === id);
};

export const getNotificationsByUser = (userId: string): Notification[] => {
  return mockNotifications.filter(n => n.user_id === userId).sort((a, b) => 
    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
};

export const getTransactionsByUser = (userId: string): WalletTransaction[] => {
  return mockTransactions.filter(t => t.user_id === userId).sort((a, b) => 
    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
};

// Simulated Trackers for Real-time Demo
export const createSimulatedTrackers = (): SimulatedTracker[] => {
  return mockTrackers.map((tracker) => ({
    id: tracker.id,
    device_id: tracker.device_id,
    name: tracker.name,
    asset_type: tracker.asset_type,
    currentLocation: tracker.last_location || { lat: 6.5244, lng: 3.3792, timestamp: new Date().toISOString() },
    route: generateRandomRoute(tracker.last_location || { lat: 6.5244, lng: 3.3792, timestamp: new Date().toISOString() }, 20),
    speed: tracker.speed || 0,
    heading: Math.random() * 360,
    is_moving: tracker.ignition_status || false,
    ignition_status: tracker.ignition_status || false,
  }));
};

// Generate random route points around a center
const generateRandomRoute = (center: GeoLocation, points: number): GeoLocation[] => {
  const route: GeoLocation[] = [center];
  let currentLat = center.lat;
  let currentLng = center.lng;
  
  for (let i = 1; i < points; i++) {
    // Random movement within ~500m
    currentLat += (Math.random() - 0.5) * 0.01;
    currentLng += (Math.random() - 0.5) * 0.01;
    route.push({
      lat: currentLat,
      lng: currentLng,
      timestamp: new Date(Date.now() + i * 60000).toISOString(),
    });
  }
  
  return route;
};
