'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import ExperienceItem from './ExperienceItem';

const experiences = [
  {
    title: 'Arquiteto de Soluções',
    company: 'baasic.',
    location: 'Aracaju, SE, Brasil',
    period: '2023-08 – Present',
    bullets: [
      'Played a crucial role in the development of Codepusher, a CI/CD automation platform that simplifies project creation and deployment.',
      'Developed and optimized the backend using NestJS, ensuring scalability, security, and API performance.',
      'Built key components of the Next.js frontend, delivering an intuitive UI for seamless project management.',
      'Implemented Terraform/Tofu automation, enabling one-click infrastructure provisioning across AWS, Azure, and other cloud providers.',
      'Integrated GitHub API, automating repository creation with pre-configured project templates (Node.js, Python, etc.).',
      'Contributed to cloud infrastructure automation, improving deployment workflows and reducing manual configuration.',
    ],
    tags: ['NestJS', 'Next.js', 'Terraform', 'AWS', 'Azure', 'GitHub API'],
  },
  {
    title: 'Desenvolvedor de Software',
    company: 'Banese',
    location: 'Aracaju, SE, Brasil',
    period: '2022-01 – 2023-07',
    bullets: [
      'Played a crucial role in the development of Codepusher, a CI/CD automation platform that simplifies project creation and deployment.',
      'Developed and optimized the backend using NestJS, ensuring scalability, security, and API performance.',
      'Built key components of the Next.js frontend, delivering an intuitive UI for seamless project management.',
      'Implemented Terraform/Tofu automation, enabling one-click infrastructure provisioning across AWS, Azure, and other cloud providers.',
      'Integrated GitHub API, automating repository creation with pre-configured project templates (Node.js, Python, etc.).',
      'Contributed to cloud infrastructure automation, improving deployment workflows and reducing manual configuration.',
    ],
    tags: ['NestJS', 'Next.js', 'Terraform', 'AWS', 'Azure', 'GitHub API'],
  },
  {
    title: 'Analista de Suporte',
    company: 'Fortuna Informática.',
    location: 'Jardinópolis, SP, Brasil',
    period: '2020-02 – 2022-12',
    bullets: [
      'Played a crucial role in the development of Codepusher, a CI/CD automation platform that simplifies project creation and deployment.',
      'Developed and optimized the backend using NestJS, ensuring scalability, security, and API performance.',
      'Built key components of the Next.js frontend, delivering an intuitive UI for seamless project management.',
      'Implemented Terraform/Tofu automation, enabling one-click infrastructure provisioning across AWS, Azure, and other cloud providers.',
      'Integrated GitHub API, automating repository creation with pre-configured project templates (Node.js, Python, etc.).',
      'Contributed to cloud infrastructure automation, improving deployment workflows and reducing manual configuration.',
    ],
    tags: ['NestJS', 'Next.js', 'Terraform', 'AWS', 'Azure', 'GitHub API'],
  },
];

export default function Experience() {
  const { t } = useLanguage();
  return (
    <section id="experience" className="py-20 bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-600">
              {t('experience.title')}
            </span>
          </h2>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto">
            {t('experience.subtitle') || 'Minha trajetória profissional e projetos'}
          </p>
        </motion.div>

        <div className="relative pl-8 max-w-4xl mx-auto">
          {/* Vertical line */}
          <motion.div 
            initial={{ height: 0 }}
            whileInView={{ height: '100%' }}
            transition={{ duration: 1.5 }}
            viewport={{ once: true }}
            className="absolute left-4 top-0 bottom-0 w-[2px] bg-gradient-to-b from-blue-400 to-blue-600" 
          />

          <div className="space-y-12">
            {experiences.map((exp, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                viewport={{ once: true }}
              >
                <ExperienceItem {...exp} />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}