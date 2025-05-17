'use client';

import { motion } from 'framer-motion';
import { Cloud, Server, Lock, GitBranch } from 'lucide-react';

const projects = [
  {
    title: 'Migração para Cloud-Native',
    description: 'Liderou a migração de uma arquitetura monolítica para microserviços na AWS, implementando CI/CD com GitLab e Kubernetes.',
    icon: Cloud,
    tags: ['AWS', 'Kubernetes', 'GitLab CI', 'Terraform', 'Microservices'],
  },
  {
    title: 'Automação de Infraestrutura',
    description: 'Desenvolveu pipeline de IaC para provisionamento automatizado de ambientes multi-cloud usando Terraform e Ansible.',
    icon: Server,
    tags: ['Terraform', 'Ansible', 'Multi-cloud', 'IaC', 'Pipeline'],
  },
  {
    title: 'Segurança e Compliance',
    description: 'Implementou práticas de DevSecOps e garantiu conformidade com padrões de segurança em ambiente regulamentado.',
    icon: Lock,
    tags: ['DevSecOps', 'Compliance', 'Security', 'Vault', 'Monitoring'],
  },
  {
    title: 'GitOps e Continuous Deployment',
    description: 'Estabeleceu práticas de GitOps usando ArgoCD para gerenciamento de configuração e deployment contínuo.',
    icon: GitBranch,
    tags: ['GitOps', 'ArgoCD', 'Kubernetes', 'CI/CD', 'Automation'],
  },
];

const Projects = () => {
  return (
    <section id="projects" className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Projetos em Destaque</h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Soluções inovadoras em Cloud e DevOps
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white dark:bg-gray-700 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center mb-4">
                <project.icon className="w-8 h-8 text-blue-600 dark:text-blue-400 mr-3" />
                <h3 className="text-xl font-semibold">{project.title}</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                {project.description}
              </p>
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects; 