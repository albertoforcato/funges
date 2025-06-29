import { Link } from '@tanstack/react-router';

export const Footer = () => {
  return (
    <footer className="fixed bottom-0 left-0 right-0 h-10 bg-[rgba(255,252,239,1)] flex justify-center items-center shadow-md z-40">
      <div className="flex gap-4">
        <Link
          to="/impressum"
          className="text-xs text-gray-700 no-underline hover:underline"
        >
          Impressum
        </Link>
        <Link
          to="/privacy-policy"
          className="text-xs text-gray-700 no-underline hover:underline"
        >
          Privacy Policy
        </Link>
        <Link
          to="/termsuse"
          className="text-xs text-gray-700 no-underline hover:underline"
        >
          Terms of Use
        </Link>
      </div>
    </footer>
  );
}; 