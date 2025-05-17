import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { LanguageProvider } from './context/LanguageContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Luca Capeloci Guerreiro | Solutions Architect',
  description: 'Solutions Architect specializing in DevOps and Cloud. Experienced in AWS, Azure, and modern cloud technologies.',
  keywords: ['Solutions Architect', 'DevOps', 'Cloud', 'AWS', 'Azure', 'Infrastructure as Code', 'CI/CD', 'Kubernetes'],
  authors: [{ name: 'Luca Capeloci Guerreiro' }],
  creator: 'Luca Capeloci Guerreiro',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://lucaguerreiro.com',
    title: 'Luca Capeloci Guerreiro | Solutions Architect',
    description: 'Solutions Architect specializing in DevOps and Cloud. Experienced in AWS, Azure, and modern cloud technologies.',
    siteName: 'Luca Capeloci Guerreiro Portfolio',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Luca Capeloci Guerreiro | Solutions Architect',
    description: 'Solutions Architect specializing in DevOps and Cloud. Experienced in AWS, Azure, and modern cloud technologies.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-100`}>
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}