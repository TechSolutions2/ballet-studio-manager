import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { useStore } from '@/store/useStore';
import { cn } from '@/lib/utils';

export function AppLayout() {
  const { sidebarOpen } = useStore();

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      <Sidebar />
      <div className={cn(
        "flex flex-1 flex-col min-w-0 transition-all duration-300"
      )}>
        <Header />
        <main className="flex-1 overflow-auto p-4 lg:p-6 scrollbar-thin">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
