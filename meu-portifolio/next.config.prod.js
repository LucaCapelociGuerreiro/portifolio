/** @type {import('next').NextConfig} */

// Configuração otimizada para produção
const nextConfig = {
  // Gerar HTML estático quando possível
  output: 'standalone',
  
  // Configurações de imagens otimizadas
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  
  // Desativar verificações de ESLint em produção
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // Desativar verificações de TypeScript em produção
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // Configurações experimentais para otimização
  experimental: {
    // Otimizar CSS para reduzir tamanho
    optimizeCss: true,
    
    // Comprimir imagens automaticamente
    optimizeImages: true,
    
    // Otimizar fontes
    optimizeFonts: true,
    
    // Reduzir tamanho do bundle
    serverMinification: true,
    
    // Melhorar performance de carregamento
    serverSourceMaps: false,
    
    // Reduzir tamanho do bundle
    bundlePagesExternals: true,
  },
  
  // Configurações de webpack para otimização
  webpack: (config, { isServer }) => {
    // Otimizar para módulos que podem causar problemas
    config.resolve.fallback = {
      fs: false,
      path: false,
      crypto: false,
    };
    
    // Otimizar tamanho do bundle
    if (!isServer) {
      config.optimization.minimize = true;
      config.optimization.minimizer.push(
        new (require('terser-webpack-plugin'))({
          terserOptions: {
            compress: {
              drop_console: true,
            },
          },
        })
      );
    }
    
    return config;
  },
};

module.exports = nextConfig;