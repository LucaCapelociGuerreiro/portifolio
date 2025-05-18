'use client';

import { useEffect, useState, useRef } from 'react';

interface CredlyBadgeProps {
  badgeId: string;
  width?: number;
  height?: number;
}

const CredlyBadge = ({ badgeId, width = 120, height = 120 }: CredlyBadgeProps) => {
  const [loaded, setLoaded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Função para inicializar o badge
    const initBadge = () => {
      // Certifique-se que o window._credly existe
      if (window._credly && containerRef.current) {
        // Limpa o container para evitar duplicação
        while (containerRef.current.firstChild) {
          containerRef.current.removeChild(containerRef.current.firstChild);
        }
        
        // Força o Credly a renderizar novamente
        window._credly.render_badge && window._credly.render_badge();
        setLoaded(true);
      }
    };

    // Carrega o script do Credly
    if (!document.getElementById('credly-script')) {
      const script = document.createElement('script');
      script.id = 'credly-script';
      script.src = 'https://cdn.credly.com/assets/utilities/embed.js';
      script.async = true;
      script.onload = () => {
        // Define um pequeno timeout para garantir que o script seja processado completamente
        setTimeout(initBadge, 300);
      };
      document.body.appendChild(script);
    } else {
      // Script já existe, apenas inicializa o badge
      initBadge();
    }

    // Cleanup: não remova o script, pois isso afetaria outros badges
  }, [badgeId]);

  return (
    <div className="relative rounded-md overflow-hidden" style={{ width, height, maxWidth: '100%' }}>
      <div
        ref={containerRef}
        data-iframe-width={width}
        data-iframe-height={height}
        data-share-badge-id={badgeId}
        data-share-badge-host="https://www.credly.com"
        className="credly-badge overflow-hidden rounded-md"
      />
      {!loaded && (
        <div 
          className="absolute inset-0 bg-gray-100 dark:bg-gray-700 rounded-md flex items-center justify-center"
          style={{ width, height }}
        >
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
};

// Adiciona a definição global para o tipo _credly do window
declare global {
  interface Window {
    _credly?: {
      render_badge?: () => void;
    };
  }
}

export default CredlyBadge; 