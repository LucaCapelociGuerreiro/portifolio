/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
      {
        protocol: 'https',
        hostname: 'ui-avatars.com',
      }
    ],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    unoptimized: true,
  },
  output: 'standalone',
  
  // Desabilita cache do servidor para garantir novas versões
  headers: async () => {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, max-age=0, must-revalidate'
          },
          {
            key: 'Pragma',
            value: 'no-cache'
          },
          {
            key: 'Expires',
            value: '0'
          }
        ]
      }
    ]
  },
  
  // Gera valor único por build para forçar refresh de assets
  generateBuildId: async () => {
    // Usa timestamp ou variável de ambiente se definida
    return process.env.NEXT_PUBLIC_BUILD_ID || `build-${Date.now()}`
  },

  webpack: (config) => {
    // Adiciona fallbacks para módulos do Node.js
    config.resolve.fallback = {
      ...config.resolve.fallback,
      canvas: false,
    };
    return config;
  },
}

module.exports = nextConfig 