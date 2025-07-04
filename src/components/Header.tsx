import { Link } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { Button } from '@/components/ui/button';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/hooks/use-theme';

export const Header = () => {
  const { t } = useTranslation();
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <header
      className='fixed top-0 left-20 right-0 h-12 bg-background-primary/70 backdrop-blur-md flex items-center justify-between px-4 z-50 font-bold shadow-sm'
      role='banner'
      aria-label='Main navigation'
    >
      <nav role='navigation' aria-label='Primary navigation'>
        <ul className='flex items-center gap-16 list-none m-0 p-0'>
          <li>
            <Link
              to='/instructions'
              className='text-text-primary no-underline text-lg px-8 py-2 rounded-md transition-colors hover:bg-hover-primary focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2'
              aria-label='Learn how Fung.es works'
            >
              {t('navigation.instructions')}
            </Link>
          </li>
          <li>
            <Link
              to='/map'
              className='text-text-primary no-underline text-lg px-8 py-2 rounded-md transition-colors hover:bg-hover-primary focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2'
              aria-label='View foraging map'
            >
              {t('navigation.map')}
            </Link>
          </li>
          <li>
            <Link
              to='/identify'
              className='text-text-primary no-underline text-lg px-8 py-2 rounded-md transition-colors hover:bg-hover-primary focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2'
              aria-label='AI mushroom identification'
            >
              {t('navigation.identify')}
            </Link>
          </li>
          <li>
            <Link
              to='/species'
              className='text-text-primary no-underline text-lg px-8 py-2 rounded-md transition-colors hover:bg-hover-primary focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2'
              aria-label='Browse wild species database'
            >
              {t('navigation.species')}
            </Link>
          </li>
          <li>
            <Link
              to='/recipes'
              className='text-text-primary no-underline text-lg px-8 py-2 rounded-md transition-colors hover:bg-hover-primary focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2'
              aria-label='View cooking recipes'
            >
              {t('navigation.recipes')}
            </Link>
          </li>
        </ul>
      </nav>

      <div className='flex items-center gap-2'>
        <Button
          onClick={toggleTheme}
          variant='ghost'
          size='icon'
          className='w-8 h-8 rounded-md hover:bg-hover-primary transition-colors'
          aria-label='Toggle dark mode'
          title='Toggle dark mode'
        >
          {theme === 'dark' ? (
            <Sun className='w-4 h-4' />
          ) : (
            <Moon className='w-4 h-4' />
          )}
        </Button>
        <LanguageSwitcher />
      </div>
    </header>
  );
};
