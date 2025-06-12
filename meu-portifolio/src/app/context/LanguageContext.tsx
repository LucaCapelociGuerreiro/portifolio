'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'pt';

interface TranslationOptions {
  defaultValue?: string;
  [key: string]: string | undefined;
}

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, options?: TranslationOptions) => string;
}

const translations = {
  en: {
    // Hero Section
    'hero.greeting': 'Hi, I\'m',
    'hero.name': 'Luca Capeloci Guerreiro',
    'hero.title': 'Solutions Architect | DevOps | Cloud | Security',
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
    'certifications.count': 'Verified Certifications',

    // Projects
    'projects.title': 'Projects',
    'projects.subtitle': 'Some of my recent work and case studies',
    'projects.viewLive': 'View Live',
    'projects.viewCode': 'View Code',

    // Education
    'education.title': 'Education',
    'education.subtitle': 'Academic background and qualifications',
    'education.bachelorDegree': 'Bachelor\'s Degree',
    'education.computerScience': 'Computer Science',
    'education.institution': 'University',
    'education.location': 'Location',
    'education.period': '2016 - 2020',
    'education.description': 'Graduated with a Bachelor\'s degree in Computer Science, focusing on software development, algorithms, and data structures.',
    'education.viewCertificate': 'View Certificate',
    'education.certificateTitle': 'University Certificate',
    'education.downloadCertificate': 'Download Certificate',

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
    'nav.education': 'Education',
  },
  pt: {
    // Hero Section
    'hero.greeting': 'Olá, eu sou',
    'hero.name': 'Luca Capeloci Guerreiro',
    'hero.title': 'Arquiteto de Soluções | DevOps | Cloud | Security',
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
    'certifications.count': 'Certificações Verificadas',

    // Projects
    'projects.title': 'Projetos',
    'projects.subtitle': 'Alguns dos meus trabalhos recentes e estudos de caso',
    'projects.viewLive': 'Ver Demo',
    'projects.viewCode': 'Ver Código',

    // Education
    'education.title': 'Formação Acadêmica',
    'education.subtitle': 'Minha formação e qualificações acadêmicas',
    'education.bachelorDegree': 'Bacharelado',
    'education.computerScience': 'Ciências da Computação',
    'education.institution': 'Universidade Tiradentes',
    'education.location': 'Sergipe,Brasil',
    'education.period': '2020 - 2024',
    'education.description': 'Bacharel em Ciência da Computação, concluído com a 3ª melhor colocação geral do período. Meu Trabalho de Conclusão de Curso foi focado em security assessments em ambientes de nuvem pública, com ênfase na AWS.',
    'education.viewCertificate': 'Ver Certificado',
    'education.certificateTitle': 'Certificado Universitário',
    'education.downloadCertificate': 'Baixar Certificado',

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
    'nav.education': 'Formação',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string, options?: TranslationOptions): string => {
    const translation = translations[language][key as keyof typeof translations[typeof language]];
    
    if (!translation && options?.defaultValue) {
      return options.defaultValue;
    }
    
    return translation || key;
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