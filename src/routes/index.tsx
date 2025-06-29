import { createRoute } from '@tanstack/react-router';
import { rootRoute } from './__root';

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: IndexPage,
});

function IndexPage() {
  return (
    <div className="index-page">
      <h1>Welcome to Fung.es</h1>
      <p>Your guide to foraging and wild edibles</p>
      {/* Main page content will go here */}
    </div>
  );
} 