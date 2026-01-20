import { createFileRoute } from '@tanstack/react-router';
import { useCore } from '@/hooks/use-core';
import { Resume } from '@/components/features/resume/resume-container';
import { ResumeHeader } from '@/components/features/resume/resume-header';
import { StatsOverview } from '@/components/features/resume/stats-overview';
import { ProfessionalSummary } from '@/components/features/resume/professional-summary';
import { TechnicalSkills } from '@/components/features/resume/technical-skills';
import { ProfessionalExperience } from '@/components/features/resume/professional-experience';
import { ProjectPortfolio } from '@/components/features/resume/project-portfolio';
import { EducationCertifications } from '@/components/features/resume/education-certifications';
import type { Technology } from '@/services/core/types';

export const Route = createFileRoute('/resume-preview')({
  component: ResumePreview,
});

function ResumePreview() {
  const { 
    queryProfile, 
    queryTechnologies, 
    queryExperiences, 
    queryProjects, 
    queryCertifications,
    downloadResumeMutation 
  } = useCore();
  const { data: profile, isLoading, error } = queryProfile();
  const { data: technologies } = queryTechnologies();
  const { data: experiences } = queryExperiences();
  const { data: projects } = queryProjects();
  const { data: certifications } = queryCertifications();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-custom-background">
        <div className="text-center">
          <div className="text-xl font-semibold text-resume-primary mb-2">
            Loading Resume...
          </div>
          <div className="text-sm text-resume-secondary">
            Please wait while we fetch your profile
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-custom-background">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-xl font-semibold text-red-500 mb-2">
            Error Loading Profile
          </div>
          <div className="text-sm text-resume-secondary">
            {error instanceof Error ? error.message : 'Failed to load profile data'}
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-custom-background">
        <div className="text-center">
          <div className="text-xl font-semibold text-resume-secondary">
            No profile data available
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-custom-background py-8 px-4">
      <Resume.Container>
        {/* Phase 1.2: Resume Header */}
        <ResumeHeader
          name={profile.name}
          title={profile.title}
          contact={{
            email: profile.email,
            phone: profile.phone,
            location: profile.location,
            github: profile.github,
            linkedin: profile.linkedin,
          }}
          onDownloadPDF={() => downloadResumeMutation.mutate()}
        />

        {/* Phase 6: Stats Overview */}
        <StatsOverview
          stats={{
            yearsExperience: profile.highlights.yearsExperience || 0,
            projectsCompleted: profile.highlights.projectsCompleted || 0,
            technologiesCount: technologies?.length || 0,
            certificationsCount: certifications?.length || 0,
          }}
        />

        {/* Phase 1.3: Professional Summary */}
        <ProfessionalSummary
          summary={profile.summary}
          highlights={profile.highlights}
        />

        {/* Phase 2.1: Technical Skills */}
        {technologies && technologies.length > 0 && (
          <TechnicalSkills 
            technologies={technologies.filter(t => t.proficiency !== undefined) as Array<Technology & { proficiency: number }>} 
          />
        )}

        {/* Phase 3.1: Professional Experience */}
        {experiences && experiences.length > 0 && (
          <ProfessionalExperience experiences={experiences} />
        )}

        {/* Phase 4: Project Portfolio */}
        {projects && projects.length > 0 && (
          <ProjectPortfolio projects={projects} />
        )}

        {/* Phase 5: Education & Certifications */}
        {profile.education && certifications && (
          <EducationCertifications 
            education={profile.education} 
            certifications={certifications} 
          />
        )}
      </Resume.Container>
    </div>
  );
}

export default ResumePreview;
