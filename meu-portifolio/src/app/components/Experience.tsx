import React from 'react';

const Experience = () => {
  const experiences = [
    {
      role: 'Senior Frontend Developer',
      company: 'Tech Solutions Inc.',
      period: 'Jan 2022 - Present',
      description: 'Lead frontend development for enterprise applications using React, TypeScript and Next.js. Implemented CI/CD pipelines and improved app performance by 40%.',
      technologies: ['React', 'TypeScript', 'Next.js', 'Tailwind CSS']
    },
    {
      role: 'Full Stack Developer',
      company: 'Digital Innovations',
      period: 'Mar 2019 - Dec 2021',
      description: 'Developed and maintained multiple web applications with React and Node.js. Collaborated with design team to implement responsive UI/UX.',
      technologies: ['React', 'Node.js', 'Express', 'MongoDB']
    },
    {
      role: 'Junior Web Developer',
      company: 'Creative Web Studio',
      period: 'Jun 2017 - Feb 2019',
      description: 'Built dynamic websites and implemented e-commerce solutions. Worked with LAMP stack and migrated legacy projects to modern frameworks.',
      technologies: ['JavaScript', 'PHP', 'MySQL', 'WordPress']
    }
  ];

  return (
<section id="experience" className="py-16 bg-black text-white">
  <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
    <h2 className="text-3xl font-bold text-center text-white mb-12">Experience</h2>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {experiences.map((exp, idx) => (
        <div key={idx} className="hover:scale-105 transition-all duration-300 bg-gray-800 p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold text-white">{exp.role}</h3>
          <span className="text-gray-400">{exp.period}</span>
          <p className="text-gray-300 mb-3">{exp.company}</p>
          <p className="text-gray-400">{exp.description}</p>
          <div className="flex flex-wrap gap-2 mt-4">
            {exp.technologies.map((tech, techIdx) => (
              <span key={techIdx} className="bg-gray-600 text-white px-3 py-1 rounded-full text-sm">
                {tech}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
</section>

  );
};

export default Experience;