import { Outlet } from 'react-router-dom';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';

export function MainLayout() {
  return (
    <div className="min-h-screen bg-[#0B0C0F] grain-overlay">
      <Navigation />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default MainLayout;
