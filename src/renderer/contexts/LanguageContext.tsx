import React, { createContext, useContext, useState, useEffect } from 'react';
const { ipcRenderer } = window.require('electron');

type Language = 'zh' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const normalizeLanguage = (lang: string): Language => {
  return lang.startsWith('zh') ? 'zh' : 'en';
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  console.log('LanguageProvider mounted');
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    console.log('Loading language...');
    // 从主进程加载保存的语言配置
    const loadLanguage = async () => {
      try {
        console.log('Invoking get-store-value...');
        const savedLanguage = await ipcRenderer.invoke('get-store-value', 'language');
        console.log('Saved language:', savedLanguage);
        
        if (savedLanguage) {
          const normalizedLanguage = normalizeLanguage(savedLanguage);
          console.log('Setting normalized language:', normalizedLanguage);
          setLanguageState(normalizedLanguage);
          return;
        }
        
        // 如果没有保存的语言配置，则使用系统语言
        const systemLanguage = navigator.language.toLowerCase();
        console.log('System language:', systemLanguage);
        
        const normalizedLanguage = normalizeLanguage(systemLanguage);
        console.log('Setting normalized language:', normalizedLanguage);
        setLanguageState(normalizedLanguage);
      } catch (error) {
        console.error('Failed to load language:', error);
        // 如果出错，使用默认语言
        setLanguageState('en');
      }
    };
    
    loadLanguage();
  }, []);

  const setLanguage = async (newLanguage: Language) => {
    try {
      await ipcRenderer.invoke('set-store-value', { key: 'language', value: newLanguage });
      setLanguageState(newLanguage);
    } catch (error) {
      console.error('Failed to set language:', error);
    }
  };

  console.log('Current language:', language);

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}; 