'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'pt';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    // Hero Section
    'hero.greeting': 'Hi, I\'m',
    'hero.title': 'Solutions Architect | DevOps | Cloud',
    'hero.description': 'Specializing in cloud-native architecture, infrastructure automation, and DevOps practices. I transform complex challenges into scalable and resilient solutions, leveraging cutting-edge technologies and best practices in cloud computing.',
    'hero.contact': 'Contact Me',
    'hero.projects': 'View Projects',
    
    // Skills
    'skills.cloudArchitecture': 'Cloud Architecture',
    'skills.devops': 'DevOps',
    'skills.infrastructure': 'Infrastructure',
    'skills.security': 'Security',
    'skills.title': 'Skills',
    'skills.subtitle': 'Technologies and tools I work with',

    // Certifications
    'certifications.title': 'Certifications',
    'certifications.subtitle': 'Professional qualifications and certifications',

    // Projects
    'projects.title': 'Projects',
    'projects.subtitle': 'Some of my recent work and case studies',
    'projects.viewLive': 'View Live',
    'projects.viewCode': 'View Code',

    // Contact
    'contact.title': 'Get in Touch',
    'contact.subtitle': 'Interested in working together? Contact me!',
    'contact.email': 'Email',
    'contact.linkedin': 'LinkedIn',
    'contact.github': 'GitHub',
    
    // Footer
    'footer.rights': 'All rights reserved.',

    // Navigation
    'nav.home': 'Home',
    'nav.about': 'About',
    'nav.projects': 'Projects',
    'nav.skills': 'Skills',
    'nav.contact': 'Contact',
    'nav.certifications': 'Certifications',
  },
  pt: {
    // Hero Section
    'hero.greeting': 'Olá, eu sou',
    'hero.title': 'Arquiteto de Soluções | DevOps | Cloud',
    'hero.description': 'Especialista em arquitetura de soluções cloud-native, automação de infraestrutura e práticas DevOps. Transformando desafios complexos em soluções escaláveis e resilientes.',
    'hero.contact': 'Contate-me',
    'hero.projects': 'Ver Projetos',
    
    // Skills
    'skills.cloudArchitecture': 'Arquitetura Cloud',
    'skills.devops': 'DevOps',
    'skills.infrastructure': 'Infraestrutura',
    'skills.security': 'Segurança',
    'skills.title': 'Habilidades',
    'skills.subtitle': 'Tecnologias e ferramentas com as quais trabalho',

    // Certifications
    'certifications.title': 'Certificações',
    'certifications.subtitle': 'Qualificações e certificações profissionais',

    // Projects
    'projects.title': 'Projetos',
    'projects.subtitle': 'Alguns dos meus trabalhos recentes e estudos de caso',
    'projects.viewLive': 'Ver Demo',
    'projects.viewCode': 'Ver Código',

    // Contact
    'contact.title': 'Entre em Contato',
    'contact.subtitle': 'Interessado em trabalharmos juntos? Fale comigo!',
    'contact.email': 'Email',
    'contact.linkedin': 'LinkedIn',
    'contact.github': 'GitHub',
    
    // Footer
    'footer.rights': 'Todos os direitos reservados.',

    // Navigation
    'nav.home': 'Início',
    'nav.about': 'Sobre',
    'nav.projects': 'Projetos',
    'nav.skills': 'Habilidades',
    'nav.contact': 'Contato',
    'nav.certifications': 'Certificações',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[typeof language]] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
} 