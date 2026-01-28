import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAutoTheme } from '@/hooks/useAutoTheme';
import { useAuthStore } from '@/store/authStore';

// Layouts
import { MainLayout } from '@/layouts/MainLayout';
import { DashboardLayout } from '@/layouts/DashboardLayout';

// Pages
import { LandingPage } from '@/pages/LandingPage';
import { LoginPage } from '@/pages/auth/LoginPage';
import { RegisterPage } from '@/pages/auth/RegisterPage';
import { VerifyEmailPage } from '@/pages/auth/VerifyEmailPage';

// Dashboards
import { SuperAdminDashboard } from '@/pages/dashboards/SuperAdminDashboard';
import { PartnerDashboard } from '@/pages/dashboards/PartnerDashboard';
import { EndUserDashboard } from '@/pages/dashboards/EndUserDashboard';

// Tracker Management
import { TrackersPage } from '@/pages/trackers/TrackersPage';
import { AddTrackerPage } from '@/pages/trackers/AddTrackerPage';
import { BulkAddTrackersPage } from '@/pages/trackers/BulkAddTrackersPage';
import { TrackerDetailsPage } from '@/pages/trackers/TrackerDetailsPage';

// Other Pages
import { WalletPage } from '@/pages/wallet/WalletPage';
import { SubscriptionPage } from '@/pages/subscription/SubscriptionPage';
import { SettingsPage } from '@/pages/settings/SettingsPage';
import { NotificationsPage } from '@/pages/notifications/NotificationsPage';
import { GeofencingPage } from '@/pages/geofencing/GeofencingPage';
import { AnalyticsPage } from '@/pages/analytics/AnalyticsPage';
import { UsersManagementPage } from '@/pages/admin/UsersManagementPage';
import { NotFoundPage } from '@/pages/NotFoundPage';

// Protected Route Component
interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: ('super_admin' | 'office_admin' | 'partner' | 'end_user')[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { isAuthenticated, user, isLoading } = useAuthStore();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0B0C0F]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C8FF2E]"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

function App() {
  const theme = useAutoTheme();
  const { user } = useAuthStore();

  // Apply theme class to document
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    document.documentElement.classList.toggle('light', theme === 'light');
  }, [theme]);

  // Get default dashboard based on user role
  const getDefaultDashboard = () => {
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

  return (
    <Router>
      <div className={`min-h-screen ${theme === 'dark' ? 'bg-[#0B0C0F] text-[#F2F4F8]' : 'bg-gray-50 text-gray-900'}`}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<MainLayout />}>
            <Route index element={<LandingPage />} />
          </Route>

          {/* Auth Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/verify-email" element={<VerifyEmailPage />} />

          {/* Dashboard Routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }>
            <Route index element={<Navigate to={getDefaultDashboard()} replace />} />
          </Route>

          {/* Super Admin Routes */}
          <Route path="/admin" element={
            <ProtectedRoute allowedRoles={['super_admin']}>
              <DashboardLayout />
            </ProtectedRoute>
          }>
            <Route path="dashboard" element={<SuperAdminDashboard />} />
            <Route path="users" element={<UsersManagementPage />} />
            <Route path="analytics" element={<AnalyticsPage />} />
            <Route path="trackers" element={<TrackersPage />} />
            <Route path="notifications" element={<NotificationsPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>

          {/* Partner Routes */}
          <Route path="/partner" element={
            <ProtectedRoute allowedRoles={['partner', 'office_admin']}>
              <DashboardLayout />
            </ProtectedRoute>
          }>
            <Route path="dashboard" element={<PartnerDashboard />} />
            <Route path="trackers" element={<TrackersPage />} />
            <Route path="trackers/add" element={<AddTrackerPage />} />
            <Route path="trackers/bulk-add" element={<BulkAddTrackersPage />} />
            <Route path="trackers/:id" element={<TrackerDetailsPage />} />
            <Route path="geofencing" element={<GeofencingPage />} />
            <Route path="wallet" element={<WalletPage />} />
            <Route path="subscription" element={<SubscriptionPage />} />
            <Route path="notifications" element={<NotificationsPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>

          {/* End User Routes */}
          <Route path="/user" element={
            <ProtectedRoute allowedRoles={['end_user']}>
              <DashboardLayout />
            </ProtectedRoute>
          }>
            <Route path="dashboard" element={<EndUserDashboard />} />
            <Route path="trackers" element={<TrackersPage />} />
            <Route path="trackers/add" element={<AddTrackerPage />} />
            <Route path="trackers/:id" element={<TrackerDetailsPage />} />
            <Route path="wallet" element={<WalletPage />} />
            <Route path="subscription" element={<SubscriptionPage />} />
            <Route path="notifications" element={<NotificationsPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>

          {/* 404 */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
