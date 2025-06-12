import React, { useState } from 'react';
import { Briefcase, MapPin, Calendar, ChevronDown, ChevronUp } from 'lucide-react';
import { motion } from 'framer-motion';

interface ExperienceItemProps {
  title: string;
  company: string;
  location: string;
  period: string;
  bullets: string[];
  tags: string[];
}

export default function ExperienceItem({
  title,
  company,
  location,
  period,
  bullets,
  tags,
}: ExperienceItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const itemVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const bulletVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3 } }
  };

  return (
    <div className="relative">
      <motion.div 
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="absolute left-0 top-3"
      >
        <span className="inline-block w-3 h-3 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full shadow-lg shadow-blue-500/20" />
      </motion.div>

      {/* Card with improved styling */}
      <motion.div 
        whileHover={{ y: -5 }}
        className="ml-8 w-full max-w-3xl bg-gray-800 p-6 rounded-xl shadow-xl border border-gray-700 hover:border-blue-500 transition-all duration-300"
      >
        <h3 className="text-white text-xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">{title}</h3>

        {/* Meta info with improved styling */}
        <div className="flex flex-wrap items-center text-gray-300 text-sm mb-4 gap-4">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="flex items-center bg-gray-900/50 px-3 py-1 rounded-lg">
            <Briefcase className="w-4 h-4 mr-2 text-blue-500" />
            <span>{company}</span>
          </motion.div>
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="flex items-center bg-gray-900/50 px-3 py-1 rounded-lg">
            <MapPin className="w-4 h-4 mr-2 text-blue-500" />
            <span>{location}</span>
          </motion.div>
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="flex items-center bg-gray-900/50 px-3 py-1 rounded-lg">
            <Calendar className="w-4 h-4 mr-2 text-blue-500" />
            <span>{period}</span>
          </motion.div>
        </div>

        {/* Expand/Collapse button with improved styling */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center bg-gray-900 text-gray-300 hover:text-blue-500 px-4 py-2 rounded-lg transition-colors duration-300 mb-4 border border-gray-700 hover:border-blue-500"
        >
          <span className="mr-2">{isExpanded ? 'Ver menos' : 'Ver mais'}</span>
          {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </motion.button>

        {/* Responsibilities with animation */}
        <motion.div
          initial="hidden"
          animate={isExpanded ? "visible" : "hidden"}
          variants={itemVariants}
          className="overflow-hidden"
          style={{ height: isExpanded ? 'auto' : 0 }}
        >
          <ul className="space-y-3 mb-4 overflow-hidden">
            {bullets.map((text, i) => (
              <motion.li 
                key={i} 
                variants={bulletVariants}
                className="flex items-start text-gray-200 bg-gray-900/30 p-3 rounded-lg border-l-2 border-blue-500"
              >
                <span className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3" />
                <p className="leading-relaxed">{text}</p>
              </motion.li>
            ))}
          </ul>
        </motion.div>

        {/* Tags with improved styling */}
        <div className="flex flex-wrap gap-2 mt-4">
          {tags.map((tag, i) => (
            <motion.span
              key={i}
              whileHover={{ scale: 1.1, y: -2 }}
              className="bg-gray-900 text-gray-300 text-xs px-3 py-1 rounded-md border border-gray-700 hover:border-blue-500 hover:text-blue-400 transition-all duration-300 shadow-md"
            >
              {tag}
            </motion.span>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
