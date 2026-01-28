// User Types
export type UserRole = 'super_admin' | 'office_admin' | 'partner' | 'end_user';

export interface User {
  id: string;
  email: string;
  full_name: string;
  phone?: string;
  role: UserRole;
  is_verified: boolean;
  verification_token?: string;
  created_at: string;
  updated_at: string;
  last_login?: string;
  avatar_url?: string;
  notification_settings?: NotificationSettings;
}

// Partner/Merchant Types
export interface Partner {
  id: string;
  user_id: string;
  company_name: string;
  business_type: string;
  fleet_size: number;
  contact_email: string;
  contact_phone: string;
  address?: string;
  city?: string;
  country?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  wallet_balance: number;
  subscription_status: SubscriptionStatus;
}

// End User Types
export interface EndUser {
  id: string;
  user_id: string;
  tracker_id: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  wallet_balance: number;
  subscription_status: SubscriptionStatus;
}

// Tracker Types
export type AssetType = 'car' | 'bike' | 'suv' | 'van' | 'truck' | 'boat' | 'helicopter' | 'plane' | 'ship' | 'heavy_equipment';
export type TrackerStatus = 'active' | 'inactive' | 'offline' | 'expired';

export interface Tracker {
  id: string;
  device_id: string;
  name: string;
  owner_id: string;
  owner_type: 'partner' | 'end_user';
  asset_type: AssetType;
  vehicle_name?: string | null;
  vehicle_registration?: string | null;
  driver_name?: string | null;
  driver_phone?: string | null;
  photos?: string[] | null;
  status: TrackerStatus;
  last_location?: GeoLocation | null;
  last_seen?: string | null;
  speed?: number | null;
  ignition_status?: boolean;
  subscription_expires_at?: string;
  geofences?: Geofence[];
  created_at: string;
  updated_at: string;
}

export interface GeoLocation {
  lat: number;
  lng: number;
  accuracy?: number;
  timestamp: string;
}

// Geofence Types
export type GeofenceType = 'circle' | 'polygon';

export interface Geofence {
  id: string;
  name: string;
  tracker_id?: string;
  owner_id: string;
  type: GeofenceType;
  coordinates: [number, number][] | { lat: number; lng: number; radius: number };
  is_active: boolean;
  alert_on_enter: boolean;
  alert_on_exit: boolean;
  created_at: string;
  updated_at: string;
}

// Subscription Types
export type SubscriptionStatus = 'active' | 'expired' | 'suspended' | 'trial';
export type SubscriptionTier = 'class_a' | 'class_b' | 'class_c';
export type BillingCycle = 'monthly' | 'quarterly' | 'biannual' | 'yearly';

export interface Subscription {
  id: string;
  user_id: string;
  tracker_id?: string;
  tier: SubscriptionTier;
  status: SubscriptionStatus;
  billing_cycle: BillingCycle;
  amount: number;
  currency: string;
  starts_at: string;
  expires_at: string;
  auto_renew: boolean;
  created_at: string;
  updated_at: string;
}

// Payment/Wallet Types
export type TransactionType = 'deposit' | 'withdrawal' | 'subscription_payment' | 'refund';
export type TransactionStatus = 'pending' | 'completed' | 'failed';

export interface WalletTransaction {
  id: string;
  user_id: string;
  type: TransactionType;
  amount: number;
  currency: string;
  status: TransactionStatus;
  description?: string;
  reference?: string;
  created_at: string;
}

// Notification Types
export type NotificationType = 'speed_alert' | 'geofence_breach' | 'subscription_expiry' | 'curfew_breach' | 'system' | 'maintenance';

export interface Notification {
  id: string;
  user_id: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, any>;
  is_read: boolean;
  created_at: string;
}

export interface NotificationSettings {
  email_notifications: boolean;
  sms_notifications: boolean;
  push_notifications: boolean;
  speed_alerts: boolean;
  geofence_alerts: boolean;
  subscription_alerts: boolean;
  curfew_alerts: boolean;
  maintenance_alerts: boolean;
}

// Office Admin Types
export interface OfficeAdmin {
  id: string;
  user_id: string;
  created_by: string; // super_admin id
  permissions: OfficeAdminPermission;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface OfficeAdminPermission {
  can_manage_users: boolean;
  can_manage_subscriptions: boolean;
  can_view_analytics: boolean;
  can_resolve_issues: boolean;
  can_manage_trackers: boolean;
}

// Analytics Types
export interface DashboardAnalytics {
  total_users: number;
  active_users: number;
  expired_subscriptions: number;
  total_trackers: number;
  active_trackers: number;
  offline_trackers: number;
  total_revenue: number;
  monthly_recurring_revenue: number;
  recent_signups: User[];
  recent_transactions: WalletTransaction[];
}

// Dummy Tracker Simulation
export interface SimulatedTracker {
  id: string;
  device_id: string;
  name: string;
  asset_type: AssetType;
  currentLocation: GeoLocation;
  route: GeoLocation[];
  speed: number;
  heading: number;
  is_moving: boolean;
  ignition_status: boolean;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Form Types
export interface PartnerRegistrationForm {
  full_name: string;
  email: string;
  phone: string;
  password: string;
  company_name: string;
  business_type: string;
  fleet_size: number;
}

export interface EndUserRegistrationForm {
  full_name: string;
  email: string;
  phone: string;
  password: string;
  tracker_id: string;
}

export interface TrackerSetupForm {
  device_id: string;
  name: string;
  asset_type: AssetType;
  vehicle_name: string;
  vehicle_registration: string;
  driver_name?: string;
  driver_phone?: string;
  photos?: File[];
}

export interface LoginForm {
  email: string;
  password: string;
}

// Map Types
export interface MapBounds {
  north: number;
  south: number;
  east: number;
  west: number;
}

export interface MapViewport {
  center: [number, number];
  zoom: number;
}
