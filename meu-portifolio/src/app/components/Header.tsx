"use client";

import React from 'react';

const Skills = () => {
  const skillCategories = [
    {
      name: "Frontend",
      skills: [
        { name: "HTML5", level: 90 },
        { name: "CSS3", level: 85 },
        { name: "JavaScript", level: 90 },
        { name: "TypeScript", level: 80 },
        { name: "React", level: 85 },
        { name: "Next.js", level: 85 },
        { name: "Tailwind CSS", level: 80 }
      ]
    },
    {
      name: "Backend",
      skills: [
        { name: "Node.js", level: 75 },
        { name: "Express", level: 70 },
        { name: "REST APIs", level: 80 },
        { name: "MongoDB", level: 65 },
        { name: "PostgreSQL", level: 60 }
      ]
    },
    {
      name: "Ferramentas & Outros",
      skills: [
        { name: "Git & GitHub", level: 85 },
        { name: "VS Code", level: 90 },
        { name: "Figma", level: 70 },
        { name: "Testes (Jest/RTL)", level: 65 },
        { name: "Responsividade", level: 85 }
      ]
    }
  ];

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

export default Skills;