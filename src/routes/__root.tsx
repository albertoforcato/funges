import { createRootRoute, Outlet } from '@tanstack/react-router';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Sidebar } from '@/components/Sidebar';

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <div className='app-root h-screen flex'>
      {/* Sidebar */}
      <Sidebar
        onImageUpload={() => {}}
        onRegionSelect={() => {}}
        onLocateUser={() => {}}
        onToggleNumbers={() => {}}
        onToggleNearby={() => {}}
        onToggleSupport={() => {}}
      />

      {/* Main content area */}
      <div className='flex-1 flex flex-col'>
        {/* Header */}
        <Header />

        {/* Scrollable content */}
        <main className='flex-1 overflow-y-auto pt-12 pb-10 pl-20'>
          <Outlet />
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
}
