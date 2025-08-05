import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import en from '../public/locales/en.json';
import zh from '../public/locales/zh-CN.json';

const translations = { en, 'zh-CN': zh };

export const useTranslation = () => {
  const router = useRouter();
  const { locale } = router;
  
  const [lang, setLang] = useState(locale || 'zh-CN');

  useEffect(() => {
    if(locale) {
      setLang(locale);
    }
  }, [locale]);

  const t = (key: keyof typeof en) => {
    if (!translations[lang as keyof typeof translations] || !translations[lang as keyof typeof translations][key]) {
      return key;
    }
    return translations[lang as keyof typeof translations][key];
  };

  return { t, lang };
};