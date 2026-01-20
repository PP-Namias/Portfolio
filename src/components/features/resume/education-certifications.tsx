import { motion } from 'framer-motion';
import { Chip } from '@heroui/react';
import { GraduationCap, Award, MapPin, Calendar } from 'lucide-react';
import { Resume } from './resume-container';
import type { Education, Certification } from '@/services/core/types';

interface EducationCertificationsProps {
  education: Education[];
  certifications: Certification[];
}

// Helper function to format dates
function formatDate(dateString: string): string {
  const [year, month] = dateString.split('-');
  const date = new Date(parseInt(year), parseInt(month) - 1);
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
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

export const EducationCertifications = ({ 
  education, 
  certifications 
}: EducationCertificationsProps) => {
  return (
    <Resume.Section id="education" aria-label="Education and Certifications">
      <Resume.Header>Education & Certifications</Resume.Header>

      {/* Education Section */}
      {education && education.length > 0 && (
        <div className="mb-10">
          <h3 className="text-xl font-semibold text-resume-primary mb-6 flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-resume-accent" />
            Education
          </h3>
          
          <div className="space-y-6">
            {education.map((edu, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="border-l-2 border-resume-accent pl-6 pb-6 last:pb-0"
              >
                {/* Degree and Institution */}
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2 mb-2">
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-resume-primary">
                      {edu.degree}
                    </h4>
                    <p className="text-base font-medium text-resume-secondary">
                      {edu.institution}
                    </p>
                  </div>
                  
                  <div className="text-sm text-resume-secondary flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {formatDate(edu.startedAt)} - {edu.endedAt ? formatDate(edu.endedAt) : 'Present'}
                  </div>
                </div>

                {/* Location and GPA */}
                <div className="flex flex-wrap items-center gap-4 text-sm text-resume-secondary mb-3">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4 text-resume-accent" />
                    {edu.location}
                  </div>
                  {edu.gpa && (
                    <div className="font-medium">
                      GPA: {edu.gpa}/4.0
                    </div>
                  )}
                </div>

                {/* Honors */}
                {edu.honors && edu.honors.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {edu.honors.map((honor, honorIndex) => (
                      <Chip
                        key={honorIndex}
                        size="sm"
                        color="success"
                        variant="flat"
                        className="font-medium"
                      >
                        <Award className="w-3 h-3 mr-1 inline" />
                        {honor}
                      </Chip>
                    ))}
                  </div>
                )}

                {/* Relevant Courses */}
                {edu.relevantCourses && edu.relevantCourses.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-resume-secondary mb-2">
                      Relevant Courses:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {edu.relevantCourses.map((course, courseIndex) => (
                        <Chip
                          key={courseIndex}
                          size="sm"
                          variant="bordered"
                          className="text-xs"
                        >
                          {course}
                        </Chip>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Divider between sections */}
      {education.length > 0 && certifications.length > 0 && (
        <div className="border-t border-resume-border my-8" />
      )}

      {/* Certifications Section */}
      {certifications && certifications.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold text-resume-primary mb-6 flex items-center gap-2">
            <Award className="w-5 h-5 text-resume-accent" />
            Certifications
          </h3>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 gap-4 print:grid-cols-1"
          >
            {certifications.map((cert, index) => (
              <motion.article
                key={index}
                variants={itemVariants}
                className="border border-resume-border rounded-lg p-4 hover:shadow-md hover:border-resume-accent transition-all duration-300 page-break-inside-avoid"
              >
                {/* Certification Title and Issuer */}
                <div className="mb-3">
                  <h4 className="text-base font-semibold text-resume-primary mb-1">
                    {cert.title}
                  </h4>
                  <p className="text-sm text-resume-secondary font-medium">
                    {cert.issuer}
                  </p>
                </div>

                {/* Issue Date */}
                <div className="flex items-center gap-1 text-sm text-resume-secondary mb-3">
                  <Calendar className="w-4 h-4 text-resume-accent" />
                  Issued {formatDate(cert.issuedAt)}
                </div>

                {/* Tags */}
                {cert.tags && cert.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {cert.tags.slice(0, 3).map((tag, tagIndex) => (
                      <Chip
                        key={tagIndex}
                        size="sm"
                        variant="flat"
                        color="primary"
                        className="text-xs"
                      >
                        {tag}
                      </Chip>
                    ))}
                    {cert.tags.length > 3 && (
                      <Chip
                        size="sm"
                        variant="flat"
                        className="text-xs text-resume-secondary"
                      >
                        +{cert.tags.length - 3} more
                      </Chip>
                    )}
                  </div>
                )}
              </motion.article>
            ))}
          </motion.div>
        </div>
      )}
    </Resume.Section>
  );
};
