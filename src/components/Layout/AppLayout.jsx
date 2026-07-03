import { Outlet } from 'react-router-dom';
import { Sidebar } from '../Sidebar/Sidebar';
import { Header } from '../Header/Header';
import { MobileNav } from '../Sidebar/MobileNav';

export function AppLayout() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background">
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <img
          src="/logo.png"
          alt=""
          className="absolute right-[-11rem] top-20 w-[min(78vw,780px)] max-w-none opacity-[0.08] mix-blend-screen sm:right-[-9rem] lg:right-[-6rem]"
        />
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen max-w-[1600px] min-w-0">
        <Sidebar />
        <div className="flex min-h-screen min-w-0 flex-1 flex-col">
          <Header />
          <main className="min-w-0 flex-1 px-4 pb-28 pt-2 sm:px-6 sm:pb-24 lg:px-8 lg:pb-6">
            <Outlet />
          </main>
        </div>
      </div>
      <div className="relative z-20">
        <MobileNav />
      </div>
    </div>
  );
}
