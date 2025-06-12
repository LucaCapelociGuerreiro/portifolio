'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import CredlyBadge from './CredlyBadge';
import { useLanguage } from '../context/LanguageContext';
import Image from 'next/image';

interface Certification {
  name: string;
  date: string;
  id: string;
  credlyBadgeId?: string;
  imagePath?: string;
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
        name: 'AWS Certified Cloud Practitioner',
        date: '2024',
        id: 'ec7d10a7-893c-40f5-8585-a3d11aac604a',
        credlyBadgeId: 'ec7d10a7-893c-40f5-8585-a3d11aac604a',
        imagePath: '/images/aws-certified-cloud-practitioner.png'
      },
      {
        name: 'AWS Certified Security - Specialty',
        date: '2024',
        id: '0b21107a-5e07-417f-a963-ef7a3c17d9dd',
        credlyBadgeId: '0b21107a-5e07-417f-a963-ef7a3c17d9dd',
        imagePath: '/images/aws-academy-graduate-aws-academy-cloud-security-bui.png'
      },
      {
        name: 'AWS Academy Graduate - Cloud Security Foundations',
        date: '2024',
        id: 'd6344a36-46a7-4765-96da-9c9f6142d8e4',
        credlyBadgeId: 'd6344a36-46a7-4765-96da-9c9f6142d8e4',
        imagePath: '/images/aws-academy-graduate-aws-academy-cloud-security-foundations.png'
      },
      {
        name: 'AWS Academy Graduate - Cloud Foundations',
        date: '2024',
        id: 'dafb7d85-e7ab-4474-9a4f-f752668f8b26',
        credlyBadgeId: 'dafb7d85-e7ab-4474-9a4f-f752668f8b26',
        imagePath: '/images/aws-academy-graduate-aws-academy-cloud-foundations.png'
      },
      {
        name: 'AWS Well-Architected Proficient',
        date: '2024',
        id: '8de3ed89-f7e4-480d-be5b-d8a3f647534b',
        credlyBadgeId: '8de3ed89-f7e4-480d-be5b-d8a3f647534b',
        imagePath: '/images/well-architected-proficient.png'
      },
      {
        name: 'AWS Knowledge: Serverless',
        date: '2024',
        id: '12a969d6-153f-4d5d-a634-3fd206d304b6',
        credlyBadgeId: '12a969d6-153f-4d5d-a634-3fd206d304b6',
        imagePath: '/images/aws-knowledge-serverless.png'
      },
      {
        name: 'AWS Knowledge: Cloud Essentials',
        date: '2024',
        id: '9783be72-13c8-4add-ba91-1aceffb8c682',
        credlyBadgeId: '9783be72-13c8-4add-ba91-1aceffb8c682',
        imagePath: '/images/aws-knowledge-cloud-essentials.png'
      }
    ],
  },
  {
    provider: 'Cisco',
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
];

// Componente de certificação individual
const CertificationCard = ({ cert }: { cert: Certification }) => {
  const [imageError, setImageError] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-gradient-to-br from-gray-800/80 to-gray-700/80 backdrop-blur-md rounded-2xl shadow-xl border border-transparent hover:border-blue-500 hover:shadow-2xl transition-all duration-300 overflow-hidden group max-w-xs mx-auto min-h-[180px] flex flex-col justify-center"
    >
      <div className="p-2 flex flex-col items-center space-y-2">
        {/* Nome da Certificação */}
        <h4 className="text-lg font-bold text-blue-400 text-center group-hover:text-blue-500 transition-colors duration-300 drop-shadow">
          {cert.name}
        </h4>

        {/* Imagem da Certificação */}
        {cert.imagePath && !imageError && (
          <div className="relative w-[150px] h-[150px] rounded-lg p-2 transition-transform duration-300 group-hover:scale-105">
            <Image
              src={cert.imagePath}
              alt={cert.name}
              width={150}
              height={150}
              className="object-contain"
              sizes="150px"
              priority
              onError={() => setImageError(true)}
            />
          </div>
        )}
        
        {/* Badge do Credly */}
        {cert.credlyBadgeId && (
          <div className="relative">
            <div className="block transition-transform duration-300 group-hover:scale-105">
              <CredlyBadge badgeId={cert.credlyBadgeId} width={150} height={150} />
            </div>
            <a 
              href={`https://www.credly.com/badges/${cert.credlyBadgeId}/public_url`}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute inset-0"
              aria-label={`Ver certificação ${cert.name} no Credly`}
            />
          </div>
        )}
      </div>
    </motion.div>
  );
};

const Certifications = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<string>(certifications[0].provider);

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
    <section id="certifications" className="py-20 bg-gradient-to-b from-gray-50 to-white dark:from-gray-800 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-400">
            {t('certifications.title')}
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            {t('certifications.subtitle')}
          </p>
        </motion.div>

        {/* Navegação por abas */}
        <div className="mb-12">
          <div className="flex flex-wrap justify-center gap-3">
            {certifications.map((provider) => (
              <button
                key={provider.provider}
                onClick={() => setActiveTab(provider.provider)}
                className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300
                  ${activeTab === provider.provider 
                    ? 'bg-blue-600 text-white shadow-lg transform scale-105 hover:bg-blue-700' 
                    : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 shadow-md'
                  }`}
              >
                {provider.provider}
              </button>
            ))}
          </div>
        </div>

        {/* Grid de certificações */}
        {certifications.map((provider) => (
          <div 
            key={provider.provider}
            className={`transition-all duration-500 ${activeTab === provider.provider ? 'opacity-100' : 'opacity-0 hidden'}`}
          >
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {provider.certifications.map((cert) => (
                <motion.div 
                  key={cert.id} 
                  variants={itemVariants}
                  className="flex"
                >
                  <CertificationCard cert={cert} />
                </motion.div>
              ))}
            </motion.div>
          </div>
        ))}

        {/* Contador de certificações */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-16 flex justify-center"
        >
          <div className="inline-flex items-center px-6 py-3 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium shadow-inner">
            <Check className="w-5 h-5 mr-2" />
            {certifications.reduce((total, provider) => total + provider.certifications.length, 0)} {t('certifications.count')}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Certifications; 