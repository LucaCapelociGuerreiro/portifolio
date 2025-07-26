'use client';

import { useLanguage } from '../context/LanguageContext';
import { Globe, ChevronDown } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

const LanguageSelector = () => {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Textos das linguagens para exibição
  const languageNames = {
    en: { short: 'EN', full: 'English' },
    pt: { short: 'PT', full: 'Português' }
  };

  // Fechar o dropdown quando clicar fora dele
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleLanguageChange = (lang: 'en' | 'pt') => {
    setLanguage(lang);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        aria-label="Change language"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <Globe className="w-5 h-5 text-gray-600 dark:text-gray-300" />
        <span className="font-medium">{languageNames[language].short}</span>
        <ChevronDown 
          className={`w-4 h-4 text-gray-600 dark:text-gray-300 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-40 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 z-50">
          <div className="py-1" role="menu" aria-orientation="vertical">
            <button
              className={`w-full text-left block px-4 py-2 text-sm ${
                language === 'en'
                  ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
              onClick={() => handleLanguageChange('en')}
              role="menuitem"
            >
              <div className="flex items-center gap-2">
                <span className="w-6 text-center font-semibold">EN</span>
                <span>{languageNames.en.full}</span>
              </div>
            </button>
            <button
              className={`w-full text-left block px-4 py-2 text-sm ${
                language === 'pt'
                  ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
              onClick={() => handleLanguageChange('pt')}
              role="menuitem"
            >
              <div className="flex items-center gap-2">
                <span className="w-6 text-center font-semibold">PT</span>
                <span>{languageNames.pt.full}</span>
              </div>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageSelector; 