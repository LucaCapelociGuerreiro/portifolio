'use client';

import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';

const skillCategories = [
  {
    title: 'Cloud Platforms',
    skills: ['AWS', 'Azure', 'Google Cloud', 'OpenStack', 'Kubernetes'],
  },
  {
    title: 'DevOps & CI/CD',
    skills: ['Jenkins', 'GitLab CI', 'GitHub Actions', 'ArgoCD', 'Docker'],
  },
  {
    title: 'Infrastructure as Code',
    skills: ['Terraform', 'CloudFormation', 'Ansible', 'Puppet', 'Chef'],
  },
  {
    title: 'Monitoring & Observability',
    skills: ['Prometheus', 'Grafana', 'ELK Stack', 'Datadog', 'New Relic'],
  },
  {
    title: 'Security & Compliance',
    skills: ['HashiCorp Vault', 'AWS IAM', 'Azure AD', 'Security Groups', 'Compliance Frameworks'],
  },
];

const Skills = () => {
  const { t } = useLanguage();

  return (
    <section id="skills" className="py-20 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">{t('skills.title')}</h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            {t('skills.subtitle')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {skillCategories.map((category, index) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white dark:bg-gray-700 rounded-lg shadow-lg p-6"
            >
              <h3 className="text-xl font-semibold mb-4 text-blue-600 dark:text-blue-400">
                {category.title}
              </h3>
              <ul className="space-y-2">
                {category.skills.map((skill) => (
                  <li
                    key={skill}
                    className="flex items-center text-gray-700 dark:text-gray-300"
                  >
                    <svg
                      className="w-4 h-4 mr-2 text-green-500"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M5 13l4 4L19 7"></path>
                    </svg>
                    {skill}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;