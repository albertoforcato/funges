import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/species')({
  component: SpeciesPage,
});

function SpeciesPage() {
  return (
    <div className='species-page'>
      <h1>Species Database</h1>
      <p>Explore mushrooms, plants, berries, and herbs</p>
      {/* Species database content will go here */}
    </div>
  );
}
