'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Calendar, Hash } from 'lucide-react';
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
        name: 'AWS Cerertified Cloud Practioner',
        date: '2024',
        id: 'ec7d10a7-893c-40f5-8585-a3d11aac604a',
        credlyBadgeId: 'ec7d10a7-893c-40f5-8585-a3d11aac604a'
      },
      {
        name: 'AWS Certified DevOps Engineer - Professional',
        date: '2023',
        id: 'devops-prof-123',
        credlyBadgeId: 'devops-prof-123'
      },
      {
        name: 'AWS Certified Security - Specialty',
        date: '2023',
        id: 'security-spec-456',
      },
    ],
  },
  {
    provider: 'Azure',
    certifications: [
      {
        name: 'Azure Solutions Architect Expert',
        date: '2024',
        id: 'azure-arch-789',
      },
      {
        name: 'Azure DevOps Engineer Expert',
        date: '2023',
        id: 'azure-devops-012',
      },
      {
        name: 'Azure Security Engineer Associate',
        date: '2022',
        id: 'azure-security-345',
      },
    ],
  },
  {
    provider: 'Kubernetes',
    certifications: [
      {
        name: 'Certified Kubernetes Administrator (CKA)',
        date: '2024',
        id: 'cka-678',
      },
      {
        name: 'Certified Kubernetes Application Developer (CKAD)',
        date: '2023',
        id: 'ckad-901',
      },
      {
        name: 'Certified Kubernetes Security Specialist (CKS)',
        date: '2022',
        id: 'cks-234',
      },
    ],
  },
  {
    provider: 'HashiCorp',
    certifications: [
      {
        name: 'HashiCorp Certified: Terraform Associate',
        date: '2024',
        id: 'terraform-567',
      },
      {
        name: 'HashiCorp Certified: Vault Associate',
        date: '2023',
        id: 'vault-890',
      },
    ],
  },
  {
    provider: 'Google Cloud',
    certifications: [
      {
        name: 'Google Cloud Professional Cloud Architect',
        date: '2023',
        id: 'gcp-arch-123',
      },
      {
        name: 'Google Cloud Professional Data Engineer',
        date: '2022',
        id: 'gcp-data-456',
      },
    ],
  },
  {
    provider: 'DevOps & SRE',
    certifications: [
      {
        name: 'Certified Jenkins Engineer',
        date: '2022',
        id: 'jenkins-789',
      },
      {
        name: 'Docker Certified Associate',
        date: '2022',
        id: 'docker-012',
      },
      {
        name: 'Prometheus Certified Associate',
        date: '2023',
        id: 'prometheus-345',
      },
    ],
  },
];

// Componente de certificação individual
const CertificationCard = ({ cert }: { cert: Certification }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    className="bg-white dark:bg-gray-700 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all"
  >
    <div className="p-4 flex flex-col h-full">
      <div className="flex-1">
        <h4 className="font-bold text-lg mb-2 text-gray-900 dark:text-white">{cert.name}</h4>
        <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-2 text-blue-500" />
            <span>{cert.date}</span>
          </div>
          <div className="flex items-center">
            <Hash className="w-4 h-4 mr-2 text-blue-500" />
            <span className="truncate">{cert.id}</span>
          </div>
        </div>
      </div>
      
      {cert.credlyBadgeId && (
        <div className="mt-4 flex justify-center">
          <CredlyBadge badgeId={cert.credlyBadgeId} width={120} height={120} />
        </div>
      )}
    </div>
  </motion.div>
);

const Certifications = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<string>(certifications[0].provider);

  // Variantes para animações
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 }
    }
  };

  return (
    <section id="certifications" className="py-20 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">{t('certifications.title')}</h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            {t('certifications.subtitle')}
          </p>
        </motion.div>

        {/* Navegação por abas */}
        <div className="mb-8">
          <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mb-8">
            {certifications.map((provider) => (
              <button
                key={provider.provider}
                onClick={() => setActiveTab(provider.provider)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all
                  ${activeTab === provider.provider 
                    ? 'bg-blue-600 text-white shadow-md transform scale-105' 
                    : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
                  }`}
              >
                {provider.provider}
              </button>
            ))}
          </div>

          {/* Conteúdo da aba ativa */}
          {certifications.map((provider) => (
            <div 
              key={provider.provider}
              className={activeTab === provider.provider ? 'block' : 'hidden'}
            >
              <motion.div 
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {provider.certifications.map((cert) => (
                  <motion.div 
                    key={cert.id} 
                    variants={itemVariants}
                  >
                    <CertificationCard cert={cert} />
                  </motion.div>
                ))}
              </motion.div>
            </div>
          ))}
        </div>

        {/* Contador de certificações */}
        <div className="mt-12 flex justify-center">
          <div className="inline-flex items-center px-4 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium">
            <Check className="w-5 h-5 mr-2" />
            {certifications.reduce((total, provider) => total + provider.certifications.length, 0)} {t('certifications.count', { defaultValue: 'Certificações validadas' })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Certifications; 