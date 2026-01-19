import { motion } from 'framer-motion';
import { Resume } from './resume-container';

interface Technology {
  name: string;
  category: string;
  proficiency: number;
  logo: string;
}

interface TechnicalSkillsProps {
  technologies: Technology[];
}

export const TechnicalSkills = ({ technologies }: TechnicalSkillsProps) => {
  // Group technologies by category
  const groupedTechnologies = technologies.reduce((acc, tech) => {
    if (!acc[tech.category]) {
      acc[tech.category] = [];
    }
    acc[tech.category].push(tech);
    return acc;
  }, {} as Record<string, Technology[]>);

  // Sort categories for consistent display order
  const categoryOrder = ['Frontend', 'Backend', 'Languages', 'Databases', 'Tools'];
  const sortedCategories = Object.keys(groupedTechnologies).sort((a, b) => {
    const indexA = categoryOrder.indexOf(a);
    const indexB = categoryOrder.indexOf(b);
    if (indexA === -1) return 1;
    if (indexB === -1) return -1;
    return indexA - indexB;
  });

  return (
    <Resume.Section id="technical-skills">
      <Resume.Header>Technical Skills</Resume.Header>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="grid md:grid-cols-2 gap-6"
      >
        {sortedCategories.map((category, categoryIndex) => (
          <div
            key={category}
            data-category={category}
            className="space-y-4 page-break-inside-avoid"
          >
            {/* Category Header */}
            <h3 className="text-lg font-semibold text-resume-primary border-b border-resume-border pb-2">
              {category}
            </h3>

            {/* Technologies in Category */}
            <div className="space-y-3">
              {groupedTechnologies[category]
                .sort((a, b) => b.proficiency - a.proficiency) // Sort by proficiency descending
                .map((tech, techIndex) => (
                  <motion.div
                    key={tech.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      duration: 0.4,
                      delay: categoryIndex * 0.1 + techIndex * 0.05,
                    }}
                    className="space-y-1"
                  >
                    {/* Skill Name and Proficiency */}
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-resume-primary">
                        {tech.name}
                      </span>
                      <span className="text-xs text-resume-secondary font-semibold">
                        {tech.proficiency}%
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div
                      role="progressbar"
                      aria-label={`${tech.name} proficiency: ${tech.proficiency}%`}
                      aria-valuenow={tech.proficiency}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      className="h-2 bg-resume-border rounded-full overflow-hidden"
                    >
                      <motion.div
                        data-proficiency
                        initial={{ width: 0 }}
                        animate={{ width: `${tech.proficiency}%` }}
                        transition={{
                          duration: 1,
                          delay: categoryIndex * 0.2 + techIndex * 0.1,
                          ease: 'easeOut',
                        }}
                        className={`h-full rounded-full ${getProficiencyColor(tech.proficiency)}`}
                        style={{ width: `${tech.proficiency}%` }}
                      />
                    </div>
                  </motion.div>
                ))}
            </div>
          </div>
        ))}
      </motion.div>

      {/* Empty State */}
      {technologies.length === 0 && (
        <div className="text-center py-8 text-resume-secondary">
          No technologies to display
        </div>
      )}
    </Resume.Section>
  );
};

// Helper function to determine progress bar color based on proficiency
function getProficiencyColor(proficiency: number): string {
  if (proficiency >= 80) return 'bg-green-500';
  if (proficiency >= 60) return 'bg-blue-500';
  if (proficiency >= 40) return 'bg-yellow-500';
  return 'bg-orange-500';
}
