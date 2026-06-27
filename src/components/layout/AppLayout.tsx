import { Outlet } from 'react-router-dom';
import Topbar from './Topbar';
import Sidebar from './Sidebar';
import { Toaster } from '@/components/ui/sonner';

export default function AppLayout() {
  return (
    <div className="h-screen flex flex-col bg-tm-bg-base overflow-hidden">
      <Topbar />
      <div className="flex-1 flex overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-auto bg-tm-bg-base p-5">
          <Outlet />
        </main>
      </div>
      <Toaster 
        position="bottom-right" 
        toastOptions={{
          style: {
            background: '#0F1422',
            border: '1px solid #1A2038',
            color: '#E4E8F8',
          },
        }}
      />
    </div>
  );
}
