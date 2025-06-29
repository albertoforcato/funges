import { createRootRoute, Outlet } from '@tanstack/react-router';

export const Route = createRootRoute({
  component: RootComponent,
});

export const rootRoute = Route;

function RootComponent() {
  return (
    <div className="app-root">
      <Outlet />
    </div>
  );
} 