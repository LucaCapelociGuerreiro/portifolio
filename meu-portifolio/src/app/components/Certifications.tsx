'use client';

import { motion } from 'framer-motion';
import { Award, CheckCircle } from 'lucide-react';
import CredlyBadge from './CredlyBadge';
import { useLanguage } from '../context/LanguageContext';

interface Certification {
  name: string;
  date: string;
  id: string;
  credlyBadgeId?: string;
}

interface ProviderCertifications {
  provider: string;
  certifications: Certification[];
}

const certifications: ProviderCertifications[] = [
  {
    provider: 'AWS',
    certifications: [
      {
        name: 'AWS Solutions Architect Professional',
        date: '2024',
        id: 'ec7d10a7-893c-40f5-8585-a3d11aac604a',
        credlyBadgeId: 'ec7d10a7-893c-40f5-8585-a3d11aac604a'
      },
      // Adicione mais certificações AWS aqui
    ],
  },
  {
    provider: 'Azure',
    certifications: [
      {
        name: 'Azure Solutions Architect Expert',
        date: '2024',
        id: 'Adicione o ID da certificação aqui',
      },
      // Adicione mais certificações Azure aqui
    ],
  },
  {
    provider: 'Kubernetes',
    certifications: [
      {
        name: 'Certified Kubernetes Administrator (CKA)',
        date: '2024',
        id: 'Adicione o ID da certificação aqui',
      },
      // Adicione mais certificações Kubernetes aqui
    ],
  },
  {
    provider: 'HashiCorp',
    certifications: [
      {
        name: 'HashiCorp Certified: Terraform Associate',
        date: '2024',
        id: 'Adicione o ID da certificação aqui',
      },
      // Adicione mais certificações HashiCorp aqui
    ],
  },
];

const Certifications = () => {
  const { t } = useLanguage();

  return (
    <section id="certifications" className="py-20 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">{t('certifications.title')}</h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            {t('certifications.subtitle')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {certifications.map((provider, index) => (
            <motion.div
              key={provider.provider}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white dark:bg-gray-700 rounded-lg shadow-lg p-6"
            >
              <div className="flex items-center mb-6">
                <Award className="w-8 h-8 text-blue-600 dark:text-blue-400 mr-3" />
                <h3 className="text-xl font-semibold">{provider.provider}</h3>
              </div>
              <div className="space-y-6">
                {provider.certifications.map((cert) => (
                  <div
                    key={cert.name}
                    className="flex flex-col md:flex-row items-start space-y-4 md:space-y-0 md:space-x-4 p-4 bg-gray-50 dark:bg-gray-600 rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="flex items-start space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-500 mt-1" />
                        <div>
                          <h4 className="font-medium">{cert.name}</h4>
                          <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            <span>ID: {cert.id}</span>
                            <span className="mx-2">•</span>
                            <span>{cert.date}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    {cert.credlyBadgeId && (
                      <div className="flex-shrink-0">
                        <CredlyBadge badgeId={cert.credlyBadgeId} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Certifications; 