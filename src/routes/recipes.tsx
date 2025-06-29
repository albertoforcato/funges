import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/recipes')({
  component: RecipesPage,
});

function RecipesPage() {
  return (
    <div className='recipes-page'>
      <h1>Recipe Collection</h1>
      <p>Discover delicious recipes using wild edibles</p>
      {/* Recipe collection content will go here */}
    </div>
  );
}
