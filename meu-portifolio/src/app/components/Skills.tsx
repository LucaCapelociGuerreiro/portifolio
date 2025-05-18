'use client';

import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import Image from 'next/image';
import { 
  Cloud, 
  Server, 
  Shield, 
  GitBranch, 
  Activity
} from 'lucide-react';

// Definição das habilidades com níveis de proficiência e logos
const skillCategories = [
  {
    title: 'Cloud Platforms',
    icon: <Cloud className="w-6 h-6" />,
    skills: [
      { name: 'AWS', level: 95, logo: '/skills/aws.svg' },
      { name: 'Azure', level: 90, logo: '/skills/azure.svg' },
      { name: 'Google Cloud', level: 85, logo: '/skills/gcp.svg' },
      { name: 'Kubernetes', level: 90, logo: '/skills/kubernetes.svg' },
      { name: 'OpenStack', level: 75, logo: '/skills/openstack.svg' },
    ],
  },
  {
    title: 'DevOps & CI/CD',
    icon: <GitBranch className="w-6 h-6" />,
    skills: [
      { name: 'Jenkins', level: 90, logo: '/skills/jenkins.svg' },
      { name: 'GitLab CI', level: 85, logo: '/skills/gitlab.svg' },
      { name: 'GitHub Actions', level: 95, logo: '/skills/github.svg' },
      { name: 'ArgoCD', level: 80, logo: '/skills/argocd.svg' },
      { name: 'Docker', level: 95, logo: '/skills/docker.svg' },
    ],
  },
  {
    title: 'Infrastructure as Code',
    icon: <Server className="w-6 h-6" />,
    skills: [
      { name: 'Terraform', level: 95, logo: '/skills/terraform.svg' },
      { name: 'CloudFormation', level: 85, logo: '/skills/cloudformation.svg' },
      { name: 'Ansible', level: 90, logo: '/skills/ansible.svg' },
      { name: 'Puppet', level: 75, logo: '/skills/puppet.svg' },
      { name: 'Chef', level: 70, logo: '/skills/chef.svg' },
    ],
  },
  {
    title: 'Monitoring & Observability',
    icon: <Activity className="w-6 h-6" />,
    skills: [
      { name: 'Prometheus', level: 90, logo: '/skills/prometheus.svg' },
      { name: 'Grafana', level: 90, logo: '/skills/grafana.svg' },
      { name: 'ELK Stack', level: 85, logo: '/skills/elastic.svg' },
      { name: 'Datadog', level: 85, logo: '/skills/datadog.svg' },
      { name: 'New Relic', level: 80, logo: '/skills/newrelic.svg' },
    ],
  },
  {
    title: 'Security & Compliance',
    icon: <Shield className="w-6 h-6" />,
    skills: [
      { name: 'HashiCorp Vault', level: 85, logo: '/skills/vault.svg' },
      { name: 'AWS IAM', level: 95, logo: '/skills/aws-iam.svg' },
      { name: 'Azure AD', level: 90, logo: '/skills/azure-ad.svg' },
      { name: 'Security Groups', level: 90, logo: '/skills/security.svg' },
      { name: 'Compliance Frameworks', level: 85, logo: '/skills/compliance.svg' },
    ],
  },
];

// Componente para exibir a barra de progresso animada
const SkillProgressBar = ({ name, level, logo }: { name: string, level: number, logo: string }) => {
  return (
    <div className="mb-4">
      <div className="flex items-center">
        <div className="relative w-8 h-8 mr-3 flex-shrink-0">
          <div className="absolute inset-0 bg-blue-100 dark:bg-blue-900/30 rounded-md flex items-center justify-center">
            {logo ? (
              <Image 
                src={logo} 
                alt={name} 
                width={24} 
                height={24} 
                className="object-contain"
                onError={(e) => {
                  // Fallback para texto quando a imagem falha
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  target.parentElement!.innerHTML = name.substring(0, 2);
                }}
              />
            ) : (
              <span className="text-xs font-bold">{name.substring(0, 2)}</span>
            )}
          </div>
        </div>
        <div className="flex justify-between w-full">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{name}</span>
        </div>
      </div>
    </div>
  );
};

const Skills = () => {
  const { t } = useLanguage();

  return (
    <section id="skills" className="py-20 bg-gradient-to-b from-gray-50 to-white dark:from-gray-800 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-indigo-600 dark:from-blue-400 dark:to-indigo-500">
              {t('skills.title')}
            </span>
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            {t('skills.subtitle')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {skillCategories.map((category, index) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 border border-gray-100 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-800 transition-all"
            >
              <div className="flex items-center mb-6">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg mr-3 text-blue-600 dark:text-blue-400">
                  {category.icon}
                </div>
                <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
                  {category.title}
                </h3>
              </div>
              <div className="space-y-1">
                {category.skills.map((skill) => (
                  <SkillProgressBar
                    key={skill.name}
                    name={skill.name}
                    level={skill.level}
                    logo={skill.logo}
                  />
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;