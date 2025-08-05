import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Header from './Header';
import Footer from './Footer';
import Articles from '../Articles';

type LayoutProps = {
  children: React.ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  const router = useRouter();
  const [isArticlesOpen, setIsArticlesOpen] = useState(false);

  useEffect(() => {
    // 处理页面加载时的滚动行为
    const handleRouteChange = () => {
      // 如果URL中没有锚点，确保滚动到顶部
      if (!window.location.hash) {
        window.scrollTo(0, 0);
      }
      // 如果有锚点，允许正常跳转
    };

    // 监听路由变化
    router.events.on('routeChangeComplete', handleRouteChange);

    // 强制滚动到顶部的函数
    const forceScrollToTop = () => {
      // 只在没有锚点的情况下清除URL和强制滚动
      if (!window.location.hash) {
        // 使用即时滚动，避免自动跳转问题
        window.scrollTo(0, 0);
      }
    };

    // 多重保护机制 - 减少频率，避免过于激进
    const timers = [
      setTimeout(forceScrollToTop, 0),    // 立即执行
      setTimeout(forceScrollToTop, 200)   // 延迟200ms
    ];

    // 监听页面加载完成事件
    window.addEventListener('load', forceScrollToTop);

    // 监听DOM内容加载完成
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', forceScrollToTop);
    } else {
      forceScrollToTop();
    }

    // 监听用户滚动，避免自动跳转
    let userScrolling = false;
    let scrollTimeout: NodeJS.Timeout;

    const handleScroll = () => {
      userScrolling = true;
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        userScrolling = false;
      }, 300); // 增加时间，确保用户滚动完成
    };

    window.addEventListener('scroll', handleScroll);

    // 监听锚点变化，允许正常的锚点跳转
    const handleHashChange = () => {
      // 如果有锚点，允许正常跳转，不进行强制滚动
      if (window.location.hash) {
        userScrolling = true;
        setTimeout(() => {
          userScrolling = false;
        }, 1000); // 增加时间，确保锚点跳转完成
      }
    };

    window.addEventListener('hashchange', handleHashChange);

    // 额外的保护：监听DOM变化，但只在非用户滚动时执行
    const observer = new MutationObserver(() => {
      // 允许锚点跳转，只在没有锚点且非用户滚动时强制滚动到顶部
      if (!window.location.hash && window.scrollY > 0 && !userScrolling) {
        // 使用即时滚动，避免自动跳转问题
        window.scrollTo(0, 0);
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    // 监听文章切换事件
    const handleToggleArticles = () => {
      setIsArticlesOpen(prev => !prev);
    };

    window.addEventListener('toggleArticles', handleToggleArticles);

    // 监听文章关闭事件
    const handleCloseArticles = () => {
      setIsArticlesOpen(false);
    };

    window.addEventListener('closeArticles', handleCloseArticles);

    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
      window.removeEventListener('toggleArticles', handleToggleArticles);
      window.removeEventListener('closeArticles', handleCloseArticles);
      window.removeEventListener('load', forceScrollToTop);
      document.removeEventListener('DOMContentLoaded', forceScrollToTop);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('hashchange', handleHashChange);
      timers.forEach(timer => clearTimeout(timer));
      clearTimeout(scrollTimeout);
      observer.disconnect();
    };
  }, [router]);

  return (
    <div className="bg-slate-50 dark:bg-gray-900 min-h-screen flex flex-col transition-colors duration-300">
      <Header />
      <main className={`flex-grow transition-all duration-700 ease-in-out ${isArticlesOpen ? 'transform -translate-x-8 scale-95' : ''}`}>
        {children}
      </main>
      <Footer />
      <Articles 
        isOpen={isArticlesOpen} 
        onClose={() => {
          console.log('Layout Articles onClose called');
          window.dispatchEvent(new CustomEvent('closeArticles'));
        }} 
      />
    </div>
  );
};

export default Layout;