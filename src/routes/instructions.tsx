import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/instructions')({
  component: InstructionsPage,
});

function InstructionsPage() {
  return (
    <div className='instructions-page'>
      <h1>How It Works</h1>
      <p>Learn how to use Fung.es for successful foraging</p>
      {/* Instructions content will go here */}
    </div>
  );
}
