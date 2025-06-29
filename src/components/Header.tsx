import { Link } from '@tanstack/react-router';

export const Header = () => {
  return (
    <header 
      className="fixed top-0 left-20 right-0 h-12 bg-[rgba(255,252,239,0.95)] flex items-center justify-center gap-16 z-50 font-bold shadow-sm"
      role="banner"
      aria-label="Main navigation"
    >
      <nav role="navigation" aria-label="Primary navigation">
        <ul className="flex items-center gap-16 list-none m-0 p-0">
          <li>
            <Link
              to="/instructions"
              className="text-gray-800 no-underline text-lg px-8 py-2 rounded-md transition-colors hover:bg-[#f0eada] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              aria-label="Learn how Fung.es works"
            >
              How It Works
            </Link>
          </li>
          <li>
            <Link
              to="/species"
              className="text-gray-800 no-underline text-lg px-8 py-2 rounded-md transition-colors hover:bg-[#f0eada] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              aria-label="Browse wild species database"
            >
              Wild Species
            </Link>
          </li>
          <li>
            <Link
              to="/recipes"
              className="text-gray-800 no-underline text-lg px-8 py-2 rounded-md transition-colors hover:bg-[#f0eada] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              aria-label="View cooking recipes"
            >
              Recipes
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}; 