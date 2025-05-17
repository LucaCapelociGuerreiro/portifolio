'use client';

import React from 'react';
import Skills from '@/app/components/Skills';
import Experience from '@/app/components/Experience';
import Contact from '@/app/components/Contact';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Projects from './components/Projects';
import Certifications from './components/Certifications';
import { useLanguage } from './context/LanguageContext';

export default function Home() {
  const { t } = useLanguage();

  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      {/* Skills Section */}
      <Skills />
      <Projects />
      <Certifications />

      {/* Experience Section */}
      <Experience />

      {/* Contact Section */}
      <Contact />

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-900 py-8 border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-600 dark:text-gray-400">
            © {new Date().getFullYear()} Luca Capeloci Guerreiro. {t('footer.rights')}
          </p>
          <div className="flex justify-center space-x-6 mt-4">
            <a href="https://github.com/seu-usuario" className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
              GitHub
            </a>
            <a href="https://linkedin.com/in/seu-perfil" className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
              LinkedIn
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}