import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/impressum')({
  component: ImpressumPage,
});

function ImpressumPage() {
  return (
    <div className='impressum-page'>
      <h1>Impressum</h1>
      <p>Legal information and contact details</p>
      {/* Impressum content will go here */}
    </div>
  );
}
