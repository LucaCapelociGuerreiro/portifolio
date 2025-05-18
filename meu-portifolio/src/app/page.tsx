'use client';

import React from 'react';
import Skills from '@/app/components/Skills';
import Experience from '@/app/components/Experience';
import Contact from '@/app/components/Contact';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Projects from './components/Projects';
import Certifications from './components/Certifications';
import Education from './components/Education';
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

      {/* Education Section */}
      <Education />

      {/* Experience Section */}
      <Experience />

      {/* Contact Section */}
      <Contact />

      {/* Footer */}
      <footer className="py-6 bg-gray-900 text-center text-white">
        <p className="text-sm">
          © {new Date().getFullYear()} Luca<span className="text-blue-400">.cloud</span>. {t('footer.rights')}
        </p>
      </footer>
    </main>
  );
}