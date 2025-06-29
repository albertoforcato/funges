import { Link } from '@tanstack/react-router';

export const Header = () => {
  return (
    <header className="fixed top-0 left-20 right-0 h-12 bg-[rgba(255,252,239,0.95)] flex items-center justify-center gap-16 z-50 font-bold shadow-sm">
      <Link
        to="/instructions"
        className="text-gray-800 no-underline text-lg px-8 py-2 rounded-md transition-colors hover:bg-[#f0eada]"
      >
        How It Works
      </Link>
      <Link
        to="/species"
        className="text-gray-800 no-underline text-lg px-8 py-2 rounded-md transition-colors hover:bg-[#f0eada]"
      >
        Wild Species
      </Link>
      <Link
        to="/recipes"
        className="text-gray-800 no-underline text-lg px-8 py-2 rounded-md transition-colors hover:bg-[#f0eada]"
      >
        Recipes
      </Link>
    </header>
  );
}; 