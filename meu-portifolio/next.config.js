/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  swcMinify: true,
  
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
    // Acelera compilação
    turbotrace: {
      logLevel: 'error',
    },
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

module.exports = nextConfig;