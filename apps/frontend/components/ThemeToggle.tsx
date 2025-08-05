import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  const handleToggle = () => {
    console.log('Theme toggle clicked, current theme:', theme);
    toggleTheme();
  };

  return (
    <button
      onClick={handleToggle}
      className="flex items-center justify-center w-10 h-10 rounded-lg bg-white/30 dark:bg-gray-800/50 backdrop-blur-sm hover:bg-white/50 dark:hover:bg-gray-700/50 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-all duration-300 border border-gray-300/50 dark:border-gray-700 hover:border-gray-400/50 dark:hover:border-gray-600"
      aria-label={`切换到${theme === 'light' ? '黑夜' : '白天'}模式`}
    >
      {theme === 'light' ? (
        <Moon size={20} className="transition-transform duration-300 hover:scale-110" />
      ) : (
        <Sun size={20} className="transition-transform duration-300 hover:scale-110" />
      )}
    </button>
  );
};

export default ThemeToggle; 