import { Link } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';

export const Footer = () => {
  const { t } = useTranslation();

  const linkClasses =
    'text-xs text-text-secondary no-underline hover:underline focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 rounded';

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
              className={linkClasses}
              aria-label='View legal information'
            >
              {t('footer.impressum')}
            </Link>
          </li>
          <li>
            <Link
              to='/privacy-policy'
              className={linkClasses}
              aria-label='View privacy policy'
            >
              {t('footer.privacyPolicy')}
            </Link>
          </li>
          <li>
            <Link
              to='/termsuse'
              className={linkClasses}
              aria-label='View terms of use'
            >
              {t('footer.termsOfUse')}
            </Link>
          </li>
        </ul>
      </nav>
    </footer>
  );
};
