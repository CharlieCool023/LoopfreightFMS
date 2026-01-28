// Database schema types for Supabase
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          full_name: string;
          phone: string | null;
          role: 'super_admin' | 'office_admin' | 'partner' | 'end_user';
          is_verified: boolean;
          avatar_url: string | null;
          notification_settings: Json | null;
          created_at: string;
          updated_at: string;
          last_login: string | null;
        };
        Insert: {
          id?: string;
          email: string;
          full_name: string;
          phone?: string | null;
          role: 'super_admin' | 'office_admin' | 'partner' | 'end_user';
          is_verified?: boolean;
          avatar_url?: string | null;
          notification_settings?: Json | null;
          created_at?: string;
          updated_at?: string;
          last_login?: string | null;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string;
          phone?: string | null;
          role?: 'super_admin' | 'office_admin' | 'partner' | 'end_user';
          is_verified?: boolean;
          avatar_url?: string | null;
          notification_settings?: Json | null;
          created_at?: string;
          updated_at?: string;
          last_login?: string | null;
        };
      };
      partners: {
        Row: {
          id: string;
          user_id: string;
          company_name: string;
          business_type: string;
          fleet_size: number;
          contact_email: string;
          contact_phone: string;
          address: string | null;
          city: string | null;
          country: string | null;
          is_active: boolean;
          wallet_balance: number;
          subscription_status: 'active' | 'expired' | 'suspended' | 'trial';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          company_name: string;
          business_type: string;
          fleet_size: number;
          contact_email: string;
          contact_phone: string;
          address?: string | null;
          city?: string | null;
          country?: string | null;
          is_active?: boolean;
          wallet_balance?: number;
          subscription_status?: 'active' | 'expired' | 'suspended' | 'trial';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          company_name?: string;
          business_type?: string;
          fleet_size?: number;
          contact_email?: string;
          contact_phone?: string;
          address?: string | null;
          city?: string | null;
          country?: string | null;
          is_active?: boolean;
          wallet_balance?: number;
          subscription_status?: 'active' | 'expired' | 'suspended' | 'trial';
          created_at?: string;
          updated_at?: string;
        };
      };
      trackers: {
        Row: {
          id: string;
          device_id: string;
          name: string;
          owner_id: string;
          owner_type: 'partner' | 'end_user';
          asset_type: 'car' | 'bike' | 'suv' | 'van' | 'truck' | 'boat' | 'helicopter' | 'plane' | 'ship' | 'heavy_equipment';
          vehicle_name: string | null;
          vehicle_registration: string | null;
          driver_name: string | null;
          driver_phone: string | null;
          photos: string[] | null;
          status: 'active' | 'inactive' | 'offline' | 'expired';
          last_location: Json | null;
          last_seen: string | null;
          speed: number | null;
          ignition_status: boolean | null;
          subscription_expires_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          device_id: string;
          name: string;
          owner_id: string;
          owner_type: 'partner' | 'end_user';
          asset_type: 'car' | 'bike' | 'suv' | 'van' | 'truck' | 'boat' | 'helicopter' | 'plane' | 'ship' | 'heavy_equipment';
          vehicle_name?: string | null;
          vehicle_registration?: string | null;
          driver_name?: string | null;
          driver_phone?: string | null;
          photos?: string[] | null;
          status?: 'active' | 'inactive' | 'offline' | 'expired';
          last_location?: Json | null;
          last_seen?: string | null;
          speed?: number | null;
          ignition_status?: boolean | null;
          subscription_expires_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          device_id?: string;
          name?: string;
          owner_id?: string;
          owner_type?: 'partner' | 'end_user';
          asset_type?: 'car' | 'bike' | 'suv' | 'van' | 'truck' | 'boat' | 'helicopter' | 'plane' | 'ship' | 'heavy_equipment';
          vehicle_name?: string | null;
          vehicle_registration?: string | null;
          driver_name?: string | null;
          driver_phone?: string | null;
          photos?: string[] | null;
          status?: 'active' | 'inactive' | 'offline' | 'expired';
          last_location?: Json | null;
          last_seen?: string | null;
          speed?: number | null;
          ignition_status?: boolean | null;
          subscription_expires_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      subscriptions: {
        Row: {
          id: string;
          user_id: string;
          tracker_id: string | null;
          tier: 'class_a' | 'class_b' | 'class_c';
          status: 'active' | 'expired' | 'suspended' | 'trial';
          billing_cycle: 'monthly' | 'quarterly' | 'biannual' | 'yearly';
          amount: number;
          currency: string;
          starts_at: string;
          expires_at: string;
          auto_renew: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          tracker_id?: string | null;
          tier: 'class_a' | 'class_b' | 'class_c';
          status?: 'active' | 'expired' | 'suspended' | 'trial';
          billing_cycle: 'monthly' | 'quarterly' | 'biannual' | 'yearly';
          amount: number;
          currency: string;
          starts_at: string;
          expires_at: string;
          auto_renew?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          tracker_id?: string | null;
          tier?: 'class_a' | 'class_b' | 'class_c';
          status?: 'active' | 'expired' | 'suspended' | 'trial';
          billing_cycle?: 'monthly' | 'quarterly' | 'biannual' | 'yearly';
          amount?: number;
          currency?: string;
          starts_at?: string;
          expires_at?: string;
          auto_renew?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      wallet_transactions: {
        Row: {
          id: string;
          user_id: string;
          type: 'deposit' | 'withdrawal' | 'subscription_payment' | 'refund';
          amount: number;
          currency: string;
          status: 'pending' | 'completed' | 'failed';
          description: string | null;
          reference: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          type: 'deposit' | 'withdrawal' | 'subscription_payment' | 'refund';
          amount: number;
          currency: string;
          status?: 'pending' | 'completed' | 'failed';
          description?: string | null;
          reference?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          type?: 'deposit' | 'withdrawal' | 'subscription_payment' | 'refund';
          amount?: number;
          currency?: string;
          status?: 'pending' | 'completed' | 'failed';
          description?: string | null;
          reference?: string | null;
          created_at?: string;
        };
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          type: 'speed_alert' | 'geofence_breach' | 'subscription_expiry' | 'curfew_breach' | 'system' | 'maintenance';
          title: string;
          message: string;
          data: Json | null;
          is_read: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          type: 'speed_alert' | 'geofence_breach' | 'subscription_expiry' | 'curfew_breach' | 'system' | 'maintenance';
          title: string;
          message: string;
          data?: Json | null;
          is_read?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          type?: 'speed_alert' | 'geofence_breach' | 'subscription_expiry' | 'curfew_breach' | 'system' | 'maintenance';
          title?: string;
          message?: string;
          data?: Json | null;
          is_read?: boolean;
          created_at?: string;
        };
      };
      geofences: {
        Row: {
          id: string;
          name: string;
          tracker_id: string | null;
          owner_id: string;
          type: 'circle' | 'polygon';
          coordinates: Json;
          is_active: boolean;
          alert_on_enter: boolean;
          alert_on_exit: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          tracker_id?: string | null;
          owner_id: string;
          type: 'circle' | 'polygon';
          coordinates: Json;
          is_active?: boolean;
          alert_on_enter?: boolean;
          alert_on_exit?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          tracker_id?: string | null;
          owner_id?: string;
          type?: 'circle' | 'polygon';
          coordinates?: Json;
          is_active?: boolean;
          alert_on_enter?: boolean;
          alert_on_exit?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}

type Json = string | number | boolean | null | { [key: string]: Json } | Json[];
