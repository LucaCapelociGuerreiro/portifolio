/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  
  // Otimização de imagens desativada para build mais rápido
  images: {
    unoptimized: true,
  },
  
  // Ignorar verificações durante build para acelerar
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // Otimizações de build
  experimental: {
    // Reduz tamanho do bundle
    optimizeCss: true,
  },
  
  // Otimizações de webpack
  webpack: (config, { isServer }) => {
    // Polyfills desnecessários
    config.resolve.fallback = {
      fs: false,
      net: false,
      tls: false,
      child_process: false,
      perf_hooks: false,
    };
    
    // Reduzir tamanho do bundle
    config.optimization = {
      ...config.optimization,
      minimize: true,
    };
    
    return config;
  },
};

// next.config.js
const path = require('path');

module.exports = {
  webpack(config) {
    config.resolve.alias['@'] = path.resolve('/home/lucacg/portifolio/portifolio/app/src'); // Caminho absoluto fornecido
    return config;
  },
};

