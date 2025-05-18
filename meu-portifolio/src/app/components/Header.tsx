"use client";

import React from 'react';

const Header = () => {
  return (
    <header className="bg-black text-white py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-5xl font-bold text-center">Developer Portfolio</h1>
        <p className="mt-4 text-xl text-center">Full Stack Developer</p>
        <p className="mt-2 text-center text-gray-400">I build modern, responsive web applications with React, Next.js, and Node.js. Passionate about creating clean, efficient, and user-friendly experiences.</p>
        <div className="mt-8 text-center">
          <a href="#contact" className="text-white hover:text-gray-400 transition-all duration-300">Get In Touch</a>
        </div>
      </div>
    </header>
  );
};

export default Header;