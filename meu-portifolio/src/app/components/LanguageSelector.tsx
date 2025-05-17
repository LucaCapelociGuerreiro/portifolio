'use client';

import { useLanguage } from '../context/LanguageContext';
import { Globe } from 'lucide-react';

const LanguageSelector = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center gap-2">
      <Globe className="w-5 h-5 text-gray-600 dark:text-gray-300" />
      <div className="flex gap-2">
        <button
          onClick={() => setLanguage('en')}
          className={`flex items-center justify-center w-8 h-8 rounded-full transition-all ${
            language === 'en'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
          }`}
          aria-label="Switch to English"
        >
          EN
        </button>
        <button
          onClick={() => setLanguage('pt')}
          className={`flex items-center justify-center w-8 h-8 rounded-full transition-all ${
            language === 'pt'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
          }`}
          aria-label="Switch to Portuguese"
        >
          PT
        </button>
      </div>
    </div>
  );
};

export default LanguageSelector; 