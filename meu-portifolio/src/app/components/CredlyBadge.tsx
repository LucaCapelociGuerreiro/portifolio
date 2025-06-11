'use client';

import { useEffect, useRef, useState } from 'react';

interface CredlyBadgeProps {
  badgeId: string;
  width?: number;
  height?: number;
}

const CredlyBadge = ({ badgeId, width = 120, height = 120 }: CredlyBadgeProps) => {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    setError(false);
    setLoading(true);

    // Limpa o container antes de renderizar um novo badge
    if (containerRef.current) {
      containerRef.current.innerHTML = '';
    }

    const loadCredlyScript = () => {
      return new Promise<void>((resolve, reject) => {
        if (window._credly?.render_badge) {
          resolve();
          return;
        }
        const scriptId = 'credly-script';
        if (document.getElementById(scriptId)) {
          resolve();
          return;
        }
        const script = document.createElement('script');
        script.id = scriptId;
        script.src = 'https://cdn.credly.com/assets/utilities/embed.js';
        script.async = true;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error('Failed to load Credly script'));
        document.body.appendChild(script);
      });
    };

    const renderBadge = async () => {
      try {
        await loadCredlyScript();
        if (!containerRef.current) return;
        // Cria o elemento do badge
        const badgeDiv = document.createElement('div');
        badgeDiv.setAttribute('data-iframe-width', width.toString());
        badgeDiv.setAttribute('data-iframe-height', height.toString());
        badgeDiv.setAttribute('data-share-badge-id', badgeId);
        badgeDiv.setAttribute('data-share-badge-host', 'https://www.credly.com');
        badgeDiv.className = 'credly-badge overflow-hidden rounded-md';
        containerRef.current.appendChild(badgeDiv);
        // Timeout para erro de carregamento
        timeoutId = setTimeout(() => {
          setError(true);
          setLoading(false);
        }, 5000);
        // Renderiza o badge
        setTimeout(() => {
          if (window._credly?.render_badge) {
            window._credly.render_badge();
            setLoading(false);
          } else {
            setError(true);
            setLoading(false);
          }
        }, 300);
      } catch (err) {
        setError(true);
        setLoading(false);
      }
    };

    renderBadge();

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      if (containerRef.current) containerRef.current.innerHTML = '';
    };
  }, [badgeId, width, height]);

  if (error) {
    return (
      <a
        href={`https://www.credly.com/badges/${badgeId}/public_url`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block px-3 py-1 text-xs font-medium text-white bg-blue-500 rounded-full shadow hover:bg-blue-600 transition"
        style={{ minWidth: 0 }}
      >
        Verificar no Credly
      </a>
    );
  }

  return (
    <div className="relative" style={{ width, height, maxWidth: '100%' }}>
      <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
      {loading && (
        <div className="absolute inset-0 bg-gray-100 dark:bg-gray-700 rounded-md flex items-center justify-center" style={{ width, height }}>
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