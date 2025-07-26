'use client';

import React, { useState, lazy, Suspense } from 'react';
// Removidas importações não utilizadas para corrigir erros de lint
import { useLanguage } from '../context/LanguageContext';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

// Lazy loading do react-pdf para reduzir bundle inicial
const Document = lazy(() => import('react-pdf').then(module => ({ default: module.Document })));
const Page = lazy(() => import('react-pdf').then(module => ({ default: module.Page })));

// Configurar worker do PDF.js apenas quando necessário
const configurePdfWorker = async () => {
  const { pdfjs } = await import('react-pdf');
  if (!pdfjs.GlobalWorkerOptions.workerSrc) {
    pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
  }
};

interface CertificateViewerProps {
  pdfUrl: string;
}

const CertificateViewer: React.FC<CertificateViewerProps> = ({ pdfUrl }) => {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [error, setError] = useState<string | null>(null);
  const [scale, setScale] = useState<number>(0.8); // Começa com 80% do tamanho
  const [isWorkerConfigured, setIsWorkerConfigured] = useState<boolean>(false);
  const { t } = useLanguage();

  // Configurar worker quando componente for montado
  React.useEffect(() => {
    if (!isWorkerConfigured) {
      configurePdfWorker().then(() => {
        setIsWorkerConfigured(true);
      }).catch((err) => {
        console.error('Error configuring PDF worker:', err);
        setError('Erro ao configurar visualizador de PDF');
      });
    }
  }, [isWorkerConfigured]);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    setNumPages(numPages);
    setError(null);
  }

  function onDocumentLoadError(error: Error): void {
    console.error('Error loading PDF:', error);
    setError('Error loading the certificate. Please try again later.');
  }

  const zoomIn = () => setScale(prev => Math.min(prev + 0.1, 2.0));
  const zoomOut = () => setScale(prev => Math.max(prev - 0.1, 0.5));

  if (error) {
    return (
      <div className="flex flex-col items-center p-4 bg-white rounded-lg shadow-lg">
        <div className="text-red-500 text-center p-4">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center p-4 bg-white rounded-lg shadow-lg max-h-[90vh] overflow-y-auto">
      <h2 className="text-xl font-bold mb-2">{t('education.certificateTitle')}</h2>
      
      <div className="flex gap-2 mb-2">
        <button
          onClick={zoomOut}
          className="px-2 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
          title="Zoom Out"
        >
          -
        </button>
        <span className="px-2 py-1 bg-gray-100 rounded">
          {Math.round(scale * 100)}%
        </span>
        <button
          onClick={zoomIn}
          className="px-2 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
          title="Zoom In"
        >
          +
        </button>
      </div>

      <div className="w-full max-w-2xl overflow-x-auto">
        {!isWorkerConfigured ? (
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <span className="ml-2">Configurando visualizador...</span>
          </div>
        ) : (
          <Suspense fallback={
            <div className="flex items-center justify-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              <span className="ml-2">{t('loading')}</span>
            </div>
          }>
            <Document
              file={pdfUrl}
              onLoadSuccess={onDocumentLoadSuccess}
              onLoadError={onDocumentLoadError}
              className="flex justify-center"
              loading={
                <div className="flex justify-center items-center p-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                </div>
              }
            >
              <Suspense fallback={
                <div className="flex justify-center items-center p-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                </div>
              }>
                <Page
                  pageNumber={pageNumber}
                  renderTextLayer={true}
                  renderAnnotationLayer={true}
                  className="border border-gray-200"
                  scale={scale}
                  loading={
                    <div className="flex justify-center items-center p-4">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                    </div>
                  }
                />
              </Suspense>
            </Document>
          </Suspense>
        )}
      </div>

      <div className="flex flex-wrap justify-center gap-2 mt-2">
        {numPages && numPages > 1 && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPageNumber(prev => Math.max(prev - 1, 1))}
              disabled={pageNumber <= 1}
              className="px-3 py-1 bg-blue-500 text-white text-sm rounded disabled:bg-gray-300"
            >
              Previous
            </button>
            <span className="text-sm">
              {pageNumber} / {numPages}
            </span>
            <button
              onClick={() => setPageNumber(prev => Math.min(prev + 1, numPages))}
              disabled={pageNumber >= numPages}
              className="px-3 py-1 bg-blue-500 text-white text-sm rounded disabled:bg-gray-300"
            >
              Next
            </button>
          </div>
        )}
        
        <a
          href={pdfUrl}
          download
          className="px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600 transition-colors"
        >
          {t('education.downloadCertificate')}
        </a>
      </div>
    </div>
  );
};

export default CertificateViewer;