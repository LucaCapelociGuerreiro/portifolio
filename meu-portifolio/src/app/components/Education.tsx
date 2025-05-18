'use client';

import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { GraduationCap, Calendar, MapPin } from 'lucide-react';

const Education = () => {
  const { t } = useLanguage();

  const education = [
    {
      degree: t('education.bachelorDegree'),
      field: t('education.computerScience'),
      institution: t('education.institution'),
      location: t('education.location'),
      period: t('education.period'),
      description: t('education.description'),
    }
  ];

  return (
    <section id="education" className="py-20 bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-500">
              {t('education.title')}
            </span>
          </h2>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto">
            {t('education.subtitle')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-8">
          {education.map((edu, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-gray-800 rounded-xl shadow-xl p-6 border border-gray-700 hover:border-blue-500 transition-all"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                <div>
                  <div className="flex items-center mb-2">
                    <GraduationCap className="w-6 h-6 text-blue-400 mr-2" />
                    <h3 className="text-xl font-bold text-white">{edu.degree}</h3>
                  </div>
                  <p className="text-lg font-semibold text-blue-300 mb-1">{edu.field}</p>
                  <p className="text-gray-400">{edu.institution}</p>
                </div>
                <div className="mt-4 md:mt-0">
                  <div className="flex items-center text-gray-400 mb-1">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>{edu.period}</span>
                  </div>
                  <div className="flex items-center text-gray-400">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span>{edu.location}</span>
                  </div>
                </div>
              </div>
              <p className="text-gray-300">{edu.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Education; 