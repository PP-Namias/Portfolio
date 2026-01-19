import { createFileRoute } from '@tanstack/react-router';
import { useCore } from '@/hooks/use-core';
import { Resume } from '@/components/features/resume/resume-container';
import { ResumeHeader } from '@/components/features/resume/resume-header';
import { ProfessionalSummary } from '@/components/features/resume/professional-summary';
import { TechnicalSkills } from '@/components/features/resume/technical-skills';
import type { Technology } from '@/services/core/types';

export const Route = createFileRoute('/resume-preview')({
  component: ResumePreview,
});

function ResumePreview() {
  const { queryProfile, queryTechnologies, downloadResumeMutation } = useCore();
  const { data: profile, isLoading, error } = queryProfile();
  const { data: technologies } = queryTechnologies();

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
      </Resume.Container>
    </div>
  );
}

export default ResumePreview;
