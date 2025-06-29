import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/termsuse')({
  component: TermsUsePage,
});

function TermsUsePage() {
  return (
    <div className='termsuse-page'>
      <h1>Terms of Use</h1>
      <p>Terms and conditions for using Fung.es</p>
      {/* Terms of use content will go here */}
    </div>
  );
}
