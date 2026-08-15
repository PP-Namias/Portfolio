import { notFound } from 'next/navigation'
import { getProjectBySlug, getProjectSlugsForStaticParams } from '@/lib/cms-content.server'
import { ProjectDetailPage } from '@/components/sections/ProjectDetailPage'
import { IS_PROJECTS_REVAMP_ENABLED } from '@/lib/features'
import { SITE_URL } from '@/lib/site-config'

export const revalidate = 3600

export async function generateStaticParams() {
  if (!IS_PROJECTS_REVAMP_ENABLED) return []
  return getProjectSlugsForStaticParams()
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const project = await getProjectBySlug(slug)
  if (!project) return { title: 'Project Not Found | Jhon Keneth Ryan Namias' }

  return {
    title: `${project.title} | Jhon Keneth Ryan Namias`,
    description: project.description,
    alternates: {
      canonical: `${SITE_URL}/projects/${slug}`,
    },
    openGraph: {
      title: project.title,
      description: project.description,
      url: `${SITE_URL}/projects/${slug}`,
      type: 'article',
      ...(project.image
        ? {
            images: [
              {
                url: project.image,
                width: 1200,
                height: 630,
                alt: project.imageAlt || project.title,
              },
            ],
          }
        : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title: project.title,
      description: project.description,
      ...(project.image ? { images: [project.image] } : {}),
    },
  }
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  if (!IS_PROJECTS_REVAMP_ENABLED) notFound()

  const { slug } = await params
  const project = await getProjectBySlug(slug)

  if (!project || !project.showcaseDetail) notFound()

  return <ProjectDetailPage project={project} />
}
