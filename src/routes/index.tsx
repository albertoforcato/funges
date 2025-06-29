import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
  component: IndexPage,
});

function IndexPage() {
  return (
    <div className='index-page'>
      <h1>Welcome to Fung.es</h1>
      <p>Your guide to foraging and wild edibles</p>
      {/* Main page content will go here */}
    </div>
  );
}
