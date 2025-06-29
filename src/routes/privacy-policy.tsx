import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/privacy-policy')({
  component: PrivacyPolicyPage,
});

function PrivacyPolicyPage() {
  return (
    <div className='privacy-policy-page'>
      <h1>Privacy Policy</h1>
      <p>How we handle your data and privacy</p>
      {/* Privacy policy content will go here */}
    </div>
  );
}
