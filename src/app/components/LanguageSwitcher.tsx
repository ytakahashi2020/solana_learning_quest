"use client";

import React, { useState } from "react";
import { Icon } from "@iconify/react";
import { useTranslation } from '../hooks/useTranslation';

const LanguageSwitcher: React.FC = () => {
  const { locale, changeLocale } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const languages = [
    { code: 'en' as const, name: 'English', flag: '🇺🇸' },
    { code: 'ja' as const, name: '日本語', flag: '🇯🇵' }
  ];

  const currentLanguage = languages.find(lang => lang.code === locale) || languages[0];

  const handleLanguageChange = (newLocale: 'en' | 'ja') => {
    changeLocale(newLocale);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-[rgba(255,255,255,0.1)] hover:bg-[rgba(255,255,255,0.2)] border border-[rgba(255,255,255,0.1)] transition-all"
      >
        <span className="text-lg">{currentLanguage.flag}</span>
        <span className="text-white text-sm font-medium hidden sm:block">
          {currentLanguage.name}
        </span>
        <Icon 
          icon={isOpen ? "solar:chevron-up-bold" : "solar:chevron-down-bold"} 
          className="text-white text-sm"
        />
      </button>

      {isOpen && (
        <div className="absolute top-full mt-2 right-0 bg-[#20242D] border border-[rgba(255,255,255,0.1)] rounded-lg shadow-lg overflow-hidden z-[70] min-w-[140px]">
          {languages.map((language) => (
            <button
              key={language.code}
              onClick={() => handleLanguageChange(language.code)}
              className={`w-full flex items-center space-x-3 px-4 py-3 hover:bg-[rgba(255,255,255,0.1)] transition-colors ${
                language.code === locale ? 'bg-purple-500/20 text-purple-400' : 'text-gray-300'
              }`}
            >
              <span className="text-lg">{language.flag}</span>
              <span className="text-sm font-medium">{language.name}</span>
              {language.code === locale && (
                <Icon icon="solar:check-circle-bold" className="text-purple-400 ml-auto" />
              )}
            </button>
          ))}
        </div>
      )}

      {/* 背景クリックで閉じる */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-[65]" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default LanguageSwitcher;