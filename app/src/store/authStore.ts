import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, UserRole, Partner, EndUser } from '@/types';
import { mockUsers, mockPartners, mockEndUsers, getUserByEmail } from '@/lib/mockData';
import { emailService } from '@/lib/email';
import { v4 as uuidv4 } from 'uuid';

interface AuthState {
  // State
  user: User | null;
  partner: Partner | null;
  endUser: EndUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  verificationPending: boolean;
  pendingUserEmail: string | null;

  // Actions
  login: (email: string, password: string) => Promise<boolean>;
  registerPartner: (data: PartnerRegistrationData) => Promise<boolean>;
  registerEndUser: (data: EndUserRegistrationData) => Promise<boolean>;
  verifyEmail: (token: string) => Promise<boolean>;
  resendVerification: (email: string) => Promise<boolean>;
  logout: () => void;
  clearError: () => void;
  updateUser: (updates: Partial<User>) => void;
  updateNotificationSettings: (settings: Partial<NotificationSettings>) => void;
}

interface PartnerRegistrationData {
  full_name: string;
  email: string;
  phone: string;
  password: string;
  company_name: string;
  business_type: string;
  fleet_size: number;
}

interface EndUserRegistrationData {
  full_name: string;
  email: string;
  phone: string;
  password: string;
  tracker_id: string;
}

interface NotificationSettings {
  email_notifications: boolean;
  sms_notifications: boolean;
  push_notifications: boolean;
  speed_alerts: boolean;
  geofence_alerts: boolean;
  subscription_alerts: boolean;
  curfew_alerts: boolean;
  maintenance_alerts: boolean;
}

// Generate verification token
const generateVerificationToken = (): string => {
  return uuidv4();
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      partner: null,
      endUser: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      verificationPending: false,
      pendingUserEmail: null,

      // Login action
      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        
        try {
          // Simulate API delay
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Find user by email
          const user = getUserByEmail(email);
          
          if (!user) {
            set({ isLoading: false, error: 'Invalid email or password' });
            return false;
          }
          
          // Check if verified
          if (!user.is_verified) {
            set({ 
              isLoading: false, 
              error: 'Please verify your email before logging in',
              verificationPending: true,
              pendingUserEmail: email,
            });
            return false;
          }
          
          // Get additional profile data based on role
          let partner = null;
          let endUser = null;
          
          if (user.role === 'partner') {
            partner = mockPartners.find(p => p.user_id === user.id) || null;
          } else if (user.role === 'end_user') {
            endUser = mockEndUsers.find(e => e.user_id === user.id) || null;
          }
          
          set({
            user,
            partner,
            endUser,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
          
          return true;
        } catch (error) {
          set({ isLoading: false, error: 'An error occurred during login' });
          return false;
        }
      },

      // Register partner
      registerPartner: async (data) => {
        set({ isLoading: true, error: null });
        
        try {
          await new Promise(resolve => setTimeout(resolve, 1500));
          
          // Check if email exists
          const existingUser = getUserByEmail(data.email);
          if (existingUser) {
            set({ isLoading: false, error: 'Email already registered' });
            return false;
          }
          
          // Create new user
          const newUser: User = {
            id: uuidv4(),
            email: data.email,
            full_name: data.full_name,
            phone: data.phone,
            role: 'partner',
            is_verified: false,
            verification_token: generateVerificationToken(),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            notification_settings: {
              email_notifications: true,
              sms_notifications: true,
              push_notifications: true,
              speed_alerts: true,
              geofence_alerts: true,
              subscription_alerts: true,
              curfew_alerts: true,
              maintenance_alerts: true,
            },
          };
          
          // Create partner profile
          const newPartner: Partner = {
            id: uuidv4(),
            user_id: newUser.id,
            company_name: data.company_name,
            business_type: data.business_type,
            fleet_size: data.fleet_size,
            contact_email: data.email,
            contact_phone: data.phone,
            is_active: false,
            wallet_balance: 0,
            subscription_status: 'trial',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          };
          
          // Add to mock data (in real app, this would be a database insert)
          mockUsers.push(newUser);
          mockPartners.push(newPartner);
          
          // Send verification email
          await emailService.sendVerificationEmail(
            data.email,
            data.full_name,
            newUser.verification_token!
          );
          
          set({
            isLoading: false,
            verificationPending: true,
            pendingUserEmail: data.email,
          });
          
          return true;
        } catch (error) {
          set({ isLoading: false, error: 'An error occurred during registration' });
          return false;
        }
      },

      // Register end user
      registerEndUser: async (data) => {
        set({ isLoading: true, error: null });
        
        try {
          await new Promise(resolve => setTimeout(resolve, 1500));
          
          // Check if email exists
          const existingUser = getUserByEmail(data.email);
          if (existingUser) {
            set({ isLoading: false, error: 'Email already registered' });
            return false;
          }
          
          // Create new user
          const newUser: User = {
            id: uuidv4(),
            email: data.email,
            full_name: data.full_name,
            phone: data.phone,
            role: 'end_user',
            is_verified: false,
            verification_token: generateVerificationToken(),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            notification_settings: {
              email_notifications: true,
              sms_notifications: false,
              push_notifications: true,
              speed_alerts: true,
              geofence_alerts: true,
              subscription_alerts: true,
              curfew_alerts: false,
              maintenance_alerts: false,
            },
          };
          
          // Create end user profile
          const newEndUser: EndUser = {
            id: uuidv4(),
            user_id: newUser.id,
            tracker_id: data.tracker_id,
            is_active: false,
            wallet_balance: 0,
            subscription_status: 'trial',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          };
          
          // Add to mock data
          mockUsers.push(newUser);
          mockEndUsers.push(newEndUser);
          
          // Send verification email
          await emailService.sendVerificationEmail(
            data.email,
            data.full_name,
            newUser.verification_token!
          );
          
          set({
            isLoading: false,
            verificationPending: true,
            pendingUserEmail: data.email,
          });
          
          return true;
        } catch (error) {
          set({ isLoading: false, error: 'An error occurred during registration' });
          return false;
        }
      },

      // Verify email
      verifyEmail: async (token: string) => {
        set({ isLoading: true, error: null });
        
        try {
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Find user with matching token
          const user = mockUsers.find(u => u.verification_token === token);
          
          if (!user) {
            set({ isLoading: false, error: 'Invalid or expired verification token' });
            return false;
          }
          
          // Update user
          user.is_verified = true;
          user.verification_token = undefined;
          user.updated_at = new Date().toISOString();
          
          // Activate profile
          if (user.role === 'partner') {
            const partner = mockPartners.find(p => p.user_id === user.id);
            if (partner) {
              partner.is_active = true;
              partner.updated_at = new Date().toISOString();
            }
          } else if (user.role === 'end_user') {
            const endUser = mockEndUsers.find(e => e.user_id === user.id);
            if (endUser) {
              endUser.is_active = true;
              endUser.updated_at = new Date().toISOString();
            }
          }
          
          // Send welcome email
          await emailService.sendWelcomeEmail(user.email, user.full_name);
          
          set({
            isLoading: false,
            verificationPending: false,
            pendingUserEmail: null,
          });
          
          return true;
        } catch (error) {
          set({ isLoading: false, error: 'An error occurred during verification' });
          return false;
        }
      },

      // Resend verification email
      resendVerification: async (email: string) => {
        set({ isLoading: true, error: null });
        
        try {
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          const user = getUserByEmail(email);
          
          if (!user) {
            set({ isLoading: false, error: 'Email not found' });
            return false;
          }
          
          if (user.is_verified) {
            set({ isLoading: false, error: 'Email is already verified' });
            return false;
          }
          
          // Generate new token
          user.verification_token = generateVerificationToken();
          
          // Send verification email
          await emailService.sendVerificationEmail(
            email,
            user.full_name,
            user.verification_token
          );
          
          set({ isLoading: false });
          return true;
        } catch (error) {
          set({ isLoading: false, error: 'An error occurred' });
          return false;
        }
      },

      // Logout
      logout: () => {
        set({
          user: null,
          partner: null,
          endUser: null,
          isAuthenticated: false,
          error: null,
        });
      },

      // Clear error
      clearError: () => {
        set({ error: null });
      },

      // Update user
      updateUser: (updates: Partial<User>) => {
        const { user } = get();
        if (user) {
          set({ user: { ...user, ...updates } });
        }
      },

      // Update notification settings
      updateNotificationSettings: (settings: Partial<NotificationSettings>) => {
        const { user } = get();
        if (user && user.notification_settings) {
          const updatedSettings = { ...user.notification_settings, ...settings };
          set({
            user: { ...user, notification_settings: updatedSettings },
          });
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        partner: state.partner,
        endUser: state.endUser,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export default useAuthStore;
