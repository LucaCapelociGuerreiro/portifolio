'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Cloud, Server, Database, Shield } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const Hero = () => {
  const { t } = useLanguage();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <section id="home" className="min-h-screen flex items-center justify-center py-20">
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center"
      >
        <div className="flex-1 text-center md:text-left">
          <motion.h1 
            variants={itemVariants}
            className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6"
          >
            {t('hero.greeting')}
            <span className="text-blue-600 dark:text-blue-400"> Luca Capeloci Guerreiro</span>
          </motion.h1>
          <motion.h2 
            variants={itemVariants}
            className="text-xl sm:text-2xl md:text-3xl text-gray-600 dark:text-gray-300 mb-8"
          >
            {t('hero.title')}
          </motion.h2>
          <motion.p 
            variants={itemVariants}
            className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl"
          >
            {t('hero.description')}
          </motion.p>
          <motion.div 
            variants={itemVariants}
            className="flex flex-wrap gap-4 justify-center md:justify-start mb-8"
          >
            <a
              href="#contact"
              className="px-8 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-all hover:scale-105"
            >
              {t('hero.contact')}
            </a>
            <a
              href="#projects"
              className="px-8 py-3 border-2 border-blue-600 text-blue-600 dark:text-blue-400 rounded-full hover:bg-blue-600 hover:text-white transition-all hover:scale-105"
            >
              {t('hero.projects')}
            </a>
          </motion.div>
          <motion.div 
            variants={itemVariants}
            className="flex flex-wrap gap-6 justify-center md:justify-start"
          >
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 p-2 rounded-lg"
            >
              <Cloud className="w-6 h-6 text-blue-600" />
              <span>{t('skills.cloudArchitecture')}</span>
            </motion.div>
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 p-2 rounded-lg"
            >
              <Server className="w-6 h-6 text-blue-600" />
              <span>{t('skills.devops')}</span>
            </motion.div>
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 p-2 rounded-lg"
            >
              <Database className="w-6 h-6 text-blue-600" />
              <span>{t('skills.infrastructure')}</span>
            </motion.div>
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 p-2 rounded-lg"
            >
              <Shield className="w-6 h-6 text-blue-600" />
              <span>{t('skills.security')}</span>
            </motion.div>
          </motion.div>
        </div>

        <motion.div
          variants={itemVariants}
          className="flex-1 mt-12 md:mt-0"
        >
          <motion.div 
            className="relative w-72 h-72 mx-auto"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Image
              src="/images/profile.jpg"
              alt="Luca Guerreiro - Solutions Architect"
              fill
              className="rounded-full object-cover shadow-2xl"
              priority
            />
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero; 