import Link from 'next/link';
import { useRouter } from 'next/router';
import { useTranslation } from '../../hooks/useTranslation';
import { Globe } from 'lucide-react';
import ThemeToggle from '../ThemeToggle';

const Header = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { pathname, asPath, query } = router;

  const handleLanguageChange = (newLocale: string) => {
    // 保存当前滚动位置
    const currentScrollY = window.scrollY;
    
    // 使用更稳定的语言切换方法，避免闪烁
    const newPath = router.asPath;
    router.replace(newPath, newPath, { 
      locale: newLocale,
      scroll: false, // 防止页面滚动
      shallow: true // 浅层路由，不重新获取数据
    }).then(() => {
      // 立即恢复滚动位置，避免闪烁
      requestAnimationFrame(() => {
        window.scrollTo(0, currentScrollY);
      });
    }).catch(() => {
      // 如果失败，使用备用方法
      router.push(newPath, newPath, { 
        locale: newLocale,
        scroll: false
      }).then(() => {
        requestAnimationFrame(() => {
          window.scrollTo(0, currentScrollY);
        });
      });
    });
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-800 shadow-sm transition-colors duration-300">
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
                  <Link href="/" className="text-xl font-bold text-gray-900 dark:text-white">
          {t('heroName')}
        </Link>
        <div className="hidden md:flex items-center space-x-8 text-gray-700 dark:text-gray-300">
          <Link href="/#projects" className="hover:text-sky-400 transition-colors">{t('navProjects')}</Link>
          <Link href="/#skills" className="hover:text-sky-400 transition-colors">{t('navSkills')}</Link>
          <Link href="/#contact" className="hover:text-sky-400 transition-colors">{t('navContact')}</Link>
          <button 
            onClick={() => window.dispatchEvent(new CustomEvent('toggleArticles'))}
            className="hover:text-sky-400 transition-colors cursor-pointer"
          >
            {t('navArticles')}
          </button>
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <div className="relative">
            <button
              onClick={() => handleLanguageChange(router.locale === 'en' ? 'zh-CN' : 'en')}
              className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors p-2 rounded-md bg-white/30 dark:bg-gray-800/30 backdrop-blur-sm hover:bg-white/50 dark:hover:bg-gray-800/50 border border-gray-300/50 dark:border-gray-700/50"
              aria-label="Change language"
            >
              <Globe size={20} />
              <span>{router.locale === 'en' ? 'EN' : '中'}</span>
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;