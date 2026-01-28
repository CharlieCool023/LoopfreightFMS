import { Outlet } from 'react-router-dom';
import { Sidebar } from '@/components/Sidebar';
import { Header } from '@/components/Header';
import { useAuthStore } from '@/store/authStore';

export function DashboardLayout() {
  const { user } = useAuthStore();

  return (
    <div className="min-h-screen bg-[#0B0C0F]">
      <Header />
      <div className="flex">
        <Sidebar userRole={user?.role} />
        <main className="flex-1 ml-64 p-6 min-h-[calc(100vh-64px)] pt-16">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;
