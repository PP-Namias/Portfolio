import { motion } from 'framer-motion';
import { Resume } from './resume-container';
import { Chip } from '@heroui/react';

interface Highlights {
  yearsExperience: number;
  projectsCompleted: number;
  primaryTechnologies: string[];
}

interface ProfessionalSummaryProps {
  summary: string;
  highlights: Highlights;
}

export const ProfessionalSummary = ({ 
  summary, 
  highlights 
}: ProfessionalSummaryProps) => {
  return (
    <Resume.Section id="summary" className="bg-resume-bg-alt">
      <Resume.Header>Professional Summary</Resume.Header>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        {/* Summary Text */}
        <p className="text-base leading-7 text-resume-primary mb-6">
          {summary}
        </p>

        {/* Highlights */}
        <div className="flex flex-wrap gap-4 items-center">
          <Chip 
            color="primary" 
            variant="flat"
            className="font-semibold"
          >
            {highlights.yearsExperience}+ Years Experience
          </Chip>
          
          <Chip 
            color="success" 
            variant="flat"
            className="font-semibold"
          >
            {highlights.projectsCompleted}+ Projects Delivered
          </Chip>
          
          <div className="flex items-center gap-2 ml-auto">
            <span className="text-sm text-resume-secondary">Focus:</span>
            {highlights.primaryTechnologies.map((tech, index) => (
              <Chip 
                key={index}
                size="sm"
                variant="bordered"
              >
                {tech}
              </Chip>
            ))}
          </div>
        </div>
      </motion.div>
    </Resume.Section>
  );
};
