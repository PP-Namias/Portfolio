import { useQuery } from '@tanstack/react-query';
import { client } from '@/lib/sanity';
import type { Resume } from '@/types/resume';

const RESUME_QUERY = `*[_type == "resume" && isActive == true][0]{
  _id,
  resumeFile{
    asset->{
      _id,
      url,
      originalFilename
    }
  },
  isActive
}`;

export function useActiveResume() {
  return useQuery({
    queryKey: ['activeResume'],
    queryFn: async (): Promise<Resume | null> => {
      try {
        const resume = await client.fetch(RESUME_QUERY);
        return resume;
      } catch (error) {
        console.error('Error fetching active resume:', error);
        throw error;
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 2,
  });
}

// Helper function to get the resume URL for iframe
export function getResumeUrl(resume: Resume | null): string {
  if (!resume?.resumeFile?.asset?.url) {
    // Fallback to static resume if no CMS resume is available
    return '/resume.pdf';
  }
  return resume.resumeFile.asset.url;
}
