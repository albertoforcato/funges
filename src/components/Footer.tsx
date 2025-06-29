import { Link } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';

export const Footer = () => {
  const { t } = useTranslation();

  const footerLinkClass =
    'text-xs text-gray-700 no-underline hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 rounded';

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
              className={footerLinkClass}
              aria-label='View legal information'
            >
              {t('footer.impressum')}
            </Link>
          </li>
          <li>
            <Link
              to='/privacy-policy'
              className={footerLinkClass}
              aria-label='View privacy policy'
            >
              {t('footer.privacyPolicy')}
            </Link>
          </li>
          <li>
            <Link
              to='/termsuse'
              className={footerLinkClass}
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
