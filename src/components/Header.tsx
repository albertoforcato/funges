import { Link } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '@/components/LanguageSwitcher';

export const Header = () => {
  const { t } = useTranslation();

  return (
    <header
      className='fixed top-0 left-20 right-0 h-12 bg-[rgba(255,252,239,0.95)] flex items-center justify-between px-4 z-50 font-bold shadow-sm'
      role='banner'
      aria-label='Main navigation'
    >
      <nav role='navigation' aria-label='Primary navigation'>
        <ul className='flex items-center gap-16 list-none m-0 p-0'>
          <li>
            <Link
              to='/instructions'
              className='text-gray-800 no-underline text-lg px-8 py-2 rounded-md transition-colors hover:bg-[#f0eada] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
              aria-label='Learn how Fung.es works'
            >
              {t('navigation.instructions')}
            </Link>
          </li>
          <li>
            <Link
              to='/map'
              className='text-gray-800 no-underline text-lg px-8 py-2 rounded-md transition-colors hover:bg-[#f0eada] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
              aria-label='View foraging map'
            >
              {t('navigation.map')}
            </Link>
          </li>
          <li>
            <Link
              to='/identify'
              className='text-gray-800 no-underline text-lg px-8 py-2 rounded-md transition-colors hover:bg-[#f0eada] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
              aria-label='AI mushroom identification'
            >
              {t('navigation.identify')}
            </Link>
          </li>
          <li>
            <Link
              to='/species'
              className='text-gray-800 no-underline text-lg px-8 py-2 rounded-md transition-colors hover:bg-[#f0eada] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
              aria-label='Browse wild species database'
            >
              {t('navigation.species')}
            </Link>
          </li>
          <li>
            <Link
              to='/recipes'
              className='text-gray-800 no-underline text-lg px-8 py-2 rounded-md transition-colors hover:bg-[#f0eada] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
              aria-label='View cooking recipes'
            >
              {t('navigation.recipes')}
            </Link>
          </li>
        </ul>
      </nav>

      <div className='flex items-center'>
        <LanguageSwitcher />
      </div>
    </header>
  );
};
