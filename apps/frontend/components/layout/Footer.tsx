import { useTranslation } from '../../hooks/useTranslation';

const Footer = () => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();
  return (
    <footer className="border-t border-gray-200 dark:border-gray-800 mt-auto">
      <div className="container mx-auto px-6 py-6 text-center text-gray-600 dark:text-gray-500">
        <p>&copy; {currentYear} {t('heroName')}. All Rights Reserved.</p>
        <p className="text-sm">Built with Next.js, Hono.js & Tailwind CSS</p>
      </div>
    </footer>
  );
};

export default Footer;