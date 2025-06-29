import { Link } from '@tanstack/react-router';

export const Footer = () => {
  return (
    <footer
      className='fixed bottom-0 left-0 right-0 h-10 bg-[rgba(255,252,239,1)] flex justify-center items-center shadow-md z-40'
      role='contentinfo'
      aria-label='Site footer'
    >
      <nav role='navigation' aria-label='Footer navigation'>
        <ul className='flex gap-4 list-none m-0 p-0'>
          <li>
            <Link
              to='/impressum'
              className='text-xs text-gray-700 no-underline hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 rounded'
              aria-label='View legal information'
            >
              Impressum
            </Link>
          </li>
          <li>
            <Link
              to='/privacy-policy'
              className='text-xs text-gray-700 no-underline hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 rounded'
              aria-label='View privacy policy'
            >
              Privacy Policy
            </Link>
          </li>
          <li>
            <Link
              to='/termsuse'
              className='text-xs text-gray-700 no-underline hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 rounded'
              aria-label='View terms of use'
            >
              Terms of Use
            </Link>
          </li>
        </ul>
      </nav>
    </footer>
  );
};
