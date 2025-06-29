import { createRootRoute, Outlet } from '@tanstack/react-router';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Sidebar } from '@/components/Sidebar';

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <div className='app-root'>
      {/* Sidebar */}
      <Sidebar
        onImageUpload={() => {}}
        onRegionSelect={() => {}}
        onLocateUser={() => {}}
        onToggleDarkMode={() => {}}
        onToggleNumbers={() => {}}
        onToggleNearby={() => {}}
        onToggleSupport={() => {}}
      />

      {/* Header */}
      <Header />

      {/* Main content */}
      <main className='main-content pt-12 pb-10 pl-20'>
        <Outlet />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
