'use client';

import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import Image from 'next/image';
import { Cloud, Server, Database, Shield } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useEffect, useRef, useState } from 'react';

// Componente para exibir logos de tecnologias no fundo
const TechBackgroundLogos = () => {
  // Lista de ícones como componentes React
  const techIcons = [
    {
      name: 'React',
      component: (props) => (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="-11.5 -10.23174 23 20.46348" {...props}>
          <circle cx="0" cy="0" r="2.05" fill="#61dafb"/>
          <g stroke="#61dafb" strokeWidth="1" fill="none">
            <ellipse rx="11" ry="4.2"/>
            <ellipse rx="11" ry="4.2" transform="rotate(60)"/>
            <ellipse rx="11" ry="4.2" transform="rotate(120)"/>
          </g>
        </svg>
      ),
      position: { top: '15%', left: '10%' }, 
      delay: 0, 
      size: 70
    },
    {
      name: 'Node.js',
      component: (props) => (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" {...props}>
          <path fill="#539e43" d="M224 508c-6.7 0-13.5-1.8-19.4-5.2l-61.7-36.5c-9.2-5.2-4.7-7-1.7-8 12.3-4.3 14.8-5.2 27.9-12.7 1.4-.8 3.2-.5 4.6.4l47.4 28.1c1.7 1 4.1 1 5.7 0l184.7-106.6c1.7-1 2.8-3 2.8-5V149.3c0-2.1-1.1-4-2.9-5.1L226.8 37.7c-1.7-1-4-1-5.7 0L36.6 144.3c-1.8 1-2.9 3-2.9 5.1v213.1c0 2 1.1 4 2.9 4.9l50.6 29.2c27.5 13.7 44.3-2.4 44.3-18.7V167.5c0-3 2.4-5.3 5.4-5.3h23.4c2.9 0 5.4 2.3 5.4 5.3V378c0 36.6-20 57.6-54.7 57.6-10.7 0-19.1 0-42.5-11.6l-48.4-27.9C8.1 389.2.7 376.3.7 362.4V149.3c0-13.8 7.4-26.8 19.4-33.7L204.6 9c11.7-6.6 27.2-6.6 38.8 0l184.7 106.7c12 6.9 19.4 19.8 19.4 33.7v213.1c0 13.8-7.4 26.7-19.4 33.7L243.4 502.8c-5.9 3.4-12.6 5.2-19.4 5.2z"/>
        </svg>
      ),
      position: { top: '25%', right: '15%' }, 
      delay: 2, 
      size: 60
    },
    {
      name: 'AWS',
      component: (props) => (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" {...props}>
          <path fill="#f90" d="M180.41 203.01c-.72 22.65 10.6 32.68 10.88 39.05a8.164 8.164 0 0 1-4.1 6.27l-12.8 8.96a10.66 10.66 0 0 1-5.63 1.92c-.43-.02-8.19 1.83-20.48-25.61a78.608 78.608 0 0 1-62.61 29.45c-16.28.89-60.4-9.24-58.13-56.21-1.59-38.28 34.06-62.06 70.93-60.05 7.1.02 21.6.37 46.99 6.27v-15.62c2.69-26.46-14.7-46.99-44.81-43.91-2.4.01-19.4-.5-45.84 10.11-7.36 3.38-8.3 2.82-10.75 2.82-7.41 0-4.36-21.48-2.94-24.2 5.21-6.4 35.86-18.35 65.94-18.18a76.857 76.857 0 0 1 55.69 17.28 70.285 70.285 0 0 1 17.67 52.36l-.01 69.29zM93.99 235.4c32.43-.47 46.16-19.97 49.29-30.47 2.46-10.05 2.05-16.41 2.05-27.4-9.67-2.32-23.59-4.85-39.56-4.87-15.15-1.14-42.82 5.63-41.74 32.26-1.24 16.79 11.12 31.4 29.96 30.48z"/>
        </svg>
      ),
      position: { bottom: '20%', left: '12%' }, 
      delay: 1, 
      size: 60
    },
    {
      name: 'Docker',
      component: (props) => (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" {...props}>
          <path fill="#2396ed" d="M349.9 236.3h-66.1v-59.4h66.1v59.4zm0-204.3h-66.1v60.7h66.1V32zm78.2 144.8H362v59.4h66.1v-59.4zm-156.3-72.1h-66.1v60.1h66.1v-60.1zm78.1 0h-66.1v60.1h66.1v-60.1zm276.8 100c-14.4-9.7-47.6-13.2-73.1-8.4-3.3-24-16.7-44.9-41.1-63.7l-14-9.3-9.3 14c-18.4 27.8-23.4 73.6-3.7 103.8-8.7 4.7-25.8 11.1-48.4 10.7H2.4c-8.7 50.8 5.8 116.8 44 162.1 37.1 43.9 92.7 66.2 165.4 66.2 157.4 0 273.9-72.5 328.4-204.2 21.4.4 67.6.1 91.3-45.2 1.5-2.5 6.6-13.2 8.5-17.1l-13.3-8.9zm-511.1-27.9h-66v59.4h66.1v-59.4zm78.1 0h-66.1v59.4h66.1v-59.4zm78.1 0h-66.1v59.4h66.1v-59.4zm-78.1-72.1h-66.1v60.1h66.1v-60.1z"/>
        </svg>
      ),
      position: { top: '40%', left: '5%' }, 
      delay: 3, 
      size: 55
    },
    {
      name: 'Kubernetes',
      component: (props) => (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 628 628" {...props}>
          <path fill="#326ce5" d="M317.24 30.56c-6.83.04-13.45 1.55-19.5 4.38l-220.1 124.04c-11.35 6.44-19.57 17.52-22.2 30.45l-46.74 236.5c-2.68 12.7.24 25.95 7.87 36.13l132.17 189.1c8.89 10.15 21.77 16.14 35.37 16.14h254.17c13.75 0 26.73-6.13 35.59-16.48l131.44-188.4c8.01-10.32 10.9-23.77 7.94-36.62l-46.74-234.03c-2.67-13.07-10.94-24.26-22.39-30.75L325.7 35.3a46.958 46.958 0 0 0-8.46-4.74 39.345 39.345 0 0 0 0 0 39.345 39.345 0 0 0-8.46-4.74 39.345 39.345 0 0 0 0 0 46.958 46.958 0 0 0-19.53-4.38 46.958 46.958 0 0 0 0 0 47.307 47.307 0 0 0 27.99 9.12Z"/>
        </svg>
      ),
      position: { bottom: '30%', right: '10%' }, 
      delay: 4, 
      size: 65
    },
    {
      name: 'TypeScript',
      component: (props) => (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" {...props}>
          <path fill="#007acc" d="M2 63.91v62.5h125v-125H2zm100.73-5a15.56 15.56 0 0 1 7.82 4.5 20.58 20.58 0 0 1 3 4c0 .16-5.4 3.81-8.69 5.85-.12.08-.6-.44-1.13-1.23a7.09 7.09 0 0 0-5.87-3.53c-3.79-.26-6.23 1.73-6.21 5a4.58 4.58 0 0 0 .54 2.34c.83 1.73 2.38 2.76 7.24 4.86 8.95 3.85 12.78 6.39 15.16 10 2.66 4 3.31 10.46 1.45 15.24-2 5.2-6.9 8.73-13.83 9.9a38.32 38.32 0 0 1-9.52-.1A23 23 0 0 1 80 109.19c-1.15-1.27-3.39-4.58-3.25-4.82a9.34 9.34 0 0 1 1.15-.73l4.6-2.64 3.59-2.08.75 1.11a16.78 16.78 0 0 0 4.74 4.54c4 2.1 9.46 1.81 12.16-.62a5.43 5.43 0 0 0 .69-6.92c-1-1.39-3-2.56-8.59-5-6.45-2.78-9.23-4.5-11.77-7.24a16.48 16.48 0 0 1-3.43-6.25 25 25 0 0 1-.22-8c1.33-6.23 6-10.58 12.82-11.87a31.66 31.66 0 0 1 9.49.26zm-29.34 5.24v5.12H57.16v46.23H45.65V69.26H29.38v-5a49.19 49.19 0 0 1 .14-5.16c.06-.08 10-.12 22-.1h21.81z"/>
        </svg>
      ),
      position: { top: '10%', right: '25%' }, 
      delay: 2.5, 
      size: 50
    },
    {
      name: 'Python',
      component: (props) => (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" {...props}>
          <path fill="#3572A5" d="M63.391 1.988c-4.222.02-8.252.379-11.8 1.007-10.45 1.846-12.346 5.71-12.346 12.837v9.411h24.693v3.137h-33.961c-7.176 0-13.46 4.313-15.426 12.521-2.268 9.405-2.368 15.275 0 25.096 1.755 7.311 5.947 12.519 13.124 12.519h8.491v-11.282c0-8.151 7.051-15.34 15.426-15.34h24.665c6.866 0 12.346-5.654 12.346-12.548v-23.513c0-6.693-5.646-11.72-12.346-12.837-4.244-.706-8.645-1.027-12.866-1.008zm-13.354 7.569c2.55 0 4.634 2.117 4.634 4.721 0 2.593-2.083 4.69-4.634 4.69-2.56 0-4.633-2.097-4.633-4.69-.001-2.604 2.073-4.721 4.633-4.721z"/>
          <path fill="#FFC331" d="M91.682 28.38v10.966c0 8.5-7.208 15.655-15.426 15.655h-24.665c-6.756 0-12.346 5.783-12.346 12.549v23.515c0 6.691 5.818 10.628 12.346 12.547 7.816 2.297 15.312 2.713 24.665 0 6.216-1.801 12.346-5.423 12.346-12.547v-9.412h-24.664v-3.138h37.012c7.176 0 9.852-5.005 12.348-12.519 2.578-7.735 2.467-15.174 0-25.096-1.774-7.145-5.161-12.521-12.348-12.521h-9.268zm-13.873 59.547c2.561 0 4.634 2.097 4.634 4.692 0 2.602-2.074 4.719-4.634 4.719-2.55 0-4.633-2.117-4.633-4.719 0-2.595 2.083-4.692 4.633-4.692z"/>
        </svg>
      ),
      position: { bottom: '15%', right: '20%' }, 
      delay: 1.5, 
      size: 55
    },
    {
      name: 'Terraform',
      component: (props) => (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" {...props}>
          <path fill="#5c4ee5" d="M45.13 35.481v27.768L68.363 77v-27.6zm33.232 13.884v27.6l23.233-13.884V35.481zM22.115 21.47v27.768l23.016 13.748V35.482zm33.23 55.92l23.235 13.884V63.374l-23.233-13.75z"/>
        </svg>
      ),
      position: { top: '50%', right: '5%' }, 
      delay: 3.5, 
      size: 60
    },
    {
      name: 'Git',
      component: (props) => (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" {...props}>
          <path fill="#F34F29" d="M124.742 58.378L69.625 3.264c-3.172-3.174-8.32-3.174-11.497 0L46.685 14.71l14.518 14.518c3.375-1.139 7.243-.375 9.932 2.314 2.703 2.706 3.462 6.607 2.293 9.993L87.42 55.529c3.385-1.167 7.292-.413 9.994 2.295 3.78 3.777 3.78 9.9 0 13.679a9.673 9.673 0 01-13.683 0 9.677 9.677 0 01-2.105-10.521L68.578 47.933l-.002 34.341a9.708 9.708 0 012.559 1.828c3.779 3.777 3.779 9.898 0 13.683-3.779 3.777-9.904 3.777-13.679 0-3.778-3.784-3.778-9.905 0-13.683a9.65 9.65 0 013.167-2.11V47.333a9.581 9.581 0 01-3.167-2.111c-2.862-2.86-3.551-7.06-2.083-10.576L41.056 20.333 3.264 58.123a8.133 8.133 0 000 11.5l55.117 55.114c3.174 3.174 8.32 3.174 11.499 0l54.858-54.858a8.135 8.135 0 00.004-11.501z"/>
        </svg>
      ),
      position: { bottom: '40%', left: '20%' }, 
      delay: 2.8, 
      size: 50
    },
    {
      name: 'Next.js',
      component: (props) => (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 180" {...props}>
          <path fill="#000000" d="M 80.95 101.613 l 35.046 -56.113 h 5.38 L 84.97 104.413 l 45.59 71.395 h -5.38 l -43.206 -67.693 l -32.446 67.693 h -5.38 l 34.863 -72.613 l -42.356 -67.895 h 5.38 l 39.883 63.711 Z"/>
        </svg>
      ),
      position: { top: '30%', left: '25%' }, 
      delay: 1.2, 
      size: 50
    }
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 opacity-[0.07] dark:opacity-[0.05]">
      {techIcons.map((tech, index) => {
        const Icon = tech.component;
        return (
          <motion.div
            key={tech.name}
            className="absolute"
            style={{
              ...tech.position,
              width: tech.size,
              height: tech.size,
            }}
            animate={{
              y: [0, 15, 0],
              rotate: [0, 5, 0, -5, 0],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
              delay: tech.delay,
            }}
          >
            <Icon width={tech.size} height={tech.size} className="w-full h-full dark:brightness-150" />
          </motion.div>
        );
      })}
    </div>
  );
};

// Componente de efeito Blob para o fundo
const BlobEffect = ({ mouseX, mouseY }) => {
  // Transformações para os blobs
  const xBlob1 = useTransform(mouseX, [-500, 500], [-30, 30]);
  const yBlob1 = useTransform(mouseY, [-500, 500], [-30, 30]);
  
  const xBlob2 = useTransform(mouseX, [-500, 500], [20, -20]);
  const yBlob2 = useTransform(mouseY, [-500, 500], [20, -20]);
  
  const xBlob3 = useTransform(mouseX, [-500, 500], [-10, 10]);
  const yBlob3 = useTransform(mouseY, [-500, 500], [-10, 10]);
  
  // Spring para movimento mais fluido
  const springX1 = useSpring(xBlob1, { damping: 30, stiffness: 90 });
  const springY1 = useSpring(yBlob1, { damping: 30, stiffness: 90 });
  
  const springX2 = useSpring(xBlob2, { damping: 25, stiffness: 100 });
  const springY2 = useSpring(yBlob2, { damping: 25, stiffness: 100 });
  
  const springX3 = useSpring(xBlob3, { damping: 35, stiffness: 80 });
  const springY3 = useSpring(yBlob3, { damping: 35, stiffness: 80 });

  return (
    <div className="parallax-bg">
      {/* Elemento blob 1 */}
      <motion.div
        className="blob-effect"
        style={{
          x: springX1,
          y: springY1,
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, rgba(59, 130, 246, 0) 70%)',
          width: '80%',
          height: '80%',
          top: '-20%',
          left: '-10%'
        }}
      />
      
      {/* Elemento blob 2 */}
      <motion.div
        className="blob-effect"
        style={{
          x: springX2,
          y: springY2,
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.12) 0%, rgba(99, 102, 241, 0) 70%)',
          width: '70%',
          height: '70%',
          bottom: '-10%',
          right: '-10%'
        }}
      />
      
      {/* Elemento blob 3 */}
      <motion.div
        className="blob-effect"
        style={{
          x: springX3,
          y: springY3,
          background: 'radial-gradient(circle, rgba(147, 197, 253, 0.10) 0%, rgba(147, 197, 253, 0) 70%)',
          width: '50%',
          height: '50%',
          top: '30%',
          left: '20%'
        }}
      />
      
      {/* Camada de distorção */}
      <div className="distortion-layer" />
    </div>
  );
};

const ProfileImage = ({ springImgX, springImgY }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0.5, y: 0.5 });
  const imgRef = useRef(null);
  
  const handleMouseMove = (e) => {
    if (imgRef.current) {
      const rect = imgRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      setMousePosition({ x, y });
    }
  };
  
  useEffect(() => {
    const img = imgRef.current;
    if (img) {
      img.addEventListener('mousemove', handleMouseMove);
      return () => {
        img.removeEventListener('mousemove', handleMouseMove);
      };
    }
  }, []);
  
  return (
    <motion.div 
      className="relative w-72 h-72 mx-auto profile-parallax"
      style={{
        x: springImgX,
        y: springImgY
      }}
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      {/* Sombra externa decorativa */}
      <div className="absolute w-full h-full rounded-full bg-blue-500/20 dark:bg-blue-600/30 blur-xl -z-10 transform scale-95 translate-y-4"></div>
      
      <div 
        ref={imgRef}
        className="w-full h-full rounded-full overflow-hidden shadow-[0_20px_50px_rgba(8,_112,_184,_0.7)] dark:shadow-[0_20px_50px_rgba(37,_99,_235,_0.5)] relative"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-transparent rounded-full z-10 pointer-events-none" />
        <Image
          src="/images/profile.jpg"
          alt="Luca Guerreiro - Solutions Architect"
          fill
          className="rounded-full object-cover"
          priority
        />
      </div>
    </motion.div>
  );
};

const Hero = () => {
  const { t } = useLanguage();
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  // Transformações para a imagem de perfil
  const imgX = useTransform(mouseX, [-500, 500], [-5, 5]);
  const imgY = useTransform(mouseY, [-500, 500], [-5, 5]);
  
  // Adiciona spring para movimento mais suave
  const springImgX = useSpring(imgX, { damping: 25, stiffness: 100 });
  const springImgY = useSpring(imgY, { damping: 25, stiffness: 100 });

  // Manipulador de evento de mouse
  const handleMouseMove = (e: MouseEvent) => {
    // Calcula a posição do mouse relativa ao centro da tela
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    mouseX.set(e.clientX - centerX);
    mouseY.set(e.clientY - centerY);
  };

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <section id="home" className="min-h-screen flex items-center justify-center py-20 relative overflow-hidden">
      {/* Plano de fundo com imagens de tecnologias */}
      <TechBackgroundLogos />
      
      {/* Efeito de blob para o fundo */}
      <BlobEffect mouseX={mouseX} mouseY={mouseY} />
      
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center relative z-10"
      >
        <div className="flex-1 text-center md:text-left">
          <motion.h1 
            variants={itemVariants}
            className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6"
          >
            {t('hero.greeting')}
            <span className="text-blue-600 dark:text-blue-400"> Luca Capeloci Guerreiro</span>
          </motion.h1>
          <motion.h2 
            variants={itemVariants}
            className="text-xl sm:text-2xl md:text-3xl text-gray-600 dark:text-gray-300 mb-8"
          >
            {t('hero.title')}
          </motion.h2>
          <motion.p 
            variants={itemVariants}
            className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl"
          >
            {t('hero.description')}
          </motion.p>
          <motion.div 
            variants={itemVariants}
            className="flex flex-wrap gap-4 justify-center md:justify-start mb-8"
          >
            <a
              href="#contact"
              className="px-8 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-all hover:scale-105"
            >
              {t('hero.contact')}
            </a>
            <a
              href="#projects"
              className="px-8 py-3 border-2 border-blue-600 text-blue-600 dark:text-blue-400 rounded-full hover:bg-blue-600 hover:text-white transition-all hover:scale-105"
            >
              {t('hero.projects')}
            </a>
          </motion.div>
          <motion.div 
            variants={itemVariants}
            className="flex flex-wrap gap-6 justify-center md:justify-start"
          >
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 p-2 rounded-lg"
            >
              <Cloud className="w-6 h-6 text-blue-600" />
              <span>{t('skills.cloudArchitecture')}</span>
            </motion.div>
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 p-2 rounded-lg"
            >
              <Server className="w-6 h-6 text-blue-600" />
              <span>{t('skills.devops')}</span>
            </motion.div>
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 p-2 rounded-lg"
            >
              <Database className="w-6 h-6 text-blue-600" />
              <span>{t('skills.infrastructure')}</span>
            </motion.div>
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 p-2 rounded-lg"
            >
              <Shield className="w-6 h-6 text-blue-600" />
              <span>{t('skills.security')}</span>
            </motion.div>
          </motion.div>
        </div>

        <motion.div
          variants={itemVariants}
          className="flex-1 mt-12 md:mt-0"
        >
          <ProfileImage springImgX={springImgX} springImgY={springImgY} />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero; 