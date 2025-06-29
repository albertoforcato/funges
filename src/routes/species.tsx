import { createRoute } from '@tanstack/react-router';
import { rootRoute } from './__root';

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: '/species',
  component: SpeciesPage,
});

function SpeciesPage() {
  return (
    <div className="species-page">
      <h1>Species Database</h1>
      <p>Explore mushrooms, plants, berries, and herbs</p>
      {/* Species database content will go here */}
    </div>
  );
} 