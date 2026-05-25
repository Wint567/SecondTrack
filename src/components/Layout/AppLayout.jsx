import { Outlet } from 'react-router-dom';
import { Sidebar } from '../Sidebar/Sidebar';
import { Header } from '../Header/Header';
import { MobileNav } from '../Sidebar/MobileNav';

export function AppLayout() {
  return (
    <div className="min-h-screen bg-hero-grid">
      <div className="mx-auto flex min-h-screen max-w-[1600px]">
        <Sidebar />
        <div className="flex min-h-screen flex-1 flex-col">
          <Header />
          <main className="flex-1 px-4 pb-24 pt-2 sm:px-6 lg:px-8 lg:pb-6">
            <Outlet />
          </main>
        </div>
      </div>
      <MobileNav />
    </div>
  );
}
