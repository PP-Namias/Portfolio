import { motion, type Variants } from 'framer-motion';
import { TrendingUp, Briefcase, Code, Award } from 'lucide-react';
import { Resume } from './resume-container';

interface Stats {
  yearsExperience: number;
  projectsCompleted: number;
  technologiesCount: number;
  certificationsCount: number;
}

interface StatsOverviewProps {
  stats: Stats;
}

// Animation variants
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring' as const,
      damping: 20,
      stiffness: 100,
    },
  },
};

export const StatsOverview = ({ stats }: StatsOverviewProps) => {
  const metrics = [
    {
      icon: TrendingUp,
      value: `${stats.yearsExperience}+`,
      label: 'Years Experience',
      color: 'text-green-500',
      bgColor: 'bg-green-50',
      ariaLabel: `${stats.yearsExperience} plus years of experience`
    },
    {
      icon: Briefcase,
      value: `${stats.projectsCompleted}+`,
      label: 'Projects Completed',
      color: 'text-blue-500',
      bgColor: 'bg-blue-50',
      ariaLabel: `${stats.projectsCompleted} plus projects completed`
    },
    {
      icon: Code,
      value: stats.technologiesCount.toString(),
      label: 'Technologies Mastered',
      color: 'text-purple-500',
      bgColor: 'bg-purple-50',
      ariaLabel: `${stats.technologiesCount} technologies mastered`
    },
    {
      icon: Award,
      value: stats.certificationsCount.toString(),
      label: 'Certifications Earned',
      color: 'text-orange-500',
      bgColor: 'bg-orange-50',
      ariaLabel: `${stats.certificationsCount} certifications earned`
    },
  ];

  return (
    <Resume.Section id="stats" className="bg-resume-bg-alt page-break-inside-avoid">
      <Resume.Header>Key Metrics</Resume.Header>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 print:grid-cols-2"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <motion.article
              key={index}
              variants={cardVariants}
              className="stat-card bg-white border border-resume-border rounded-lg p-6 
                         hover:shadow-lg hover:border-resume-accent transition-all duration-300
                         flex flex-col items-center text-center page-break-inside-avoid"
              aria-label={metric.ariaLabel}
            >
              {/* Icon */}
              <div className={`${metric.bgColor} p-4 rounded-full mb-4`}>
                <Icon 
                  className={`${metric.color} w-8 h-8`}
                  aria-hidden="true"
                />
              </div>

              {/* Value */}
              <div className="text-4xl font-bold text-resume-primary mb-2">
                {metric.value}
              </div>

              {/* Label */}
              <div className="text-sm text-resume-secondary font-medium">
                {metric.label}
              </div>
            </motion.article>
          );
        })}
      </motion.div>
    </Resume.Section>
  );
};
