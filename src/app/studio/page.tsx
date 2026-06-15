import Link from 'next/link';
import { redirect } from 'next/navigation';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

const studioHref =
  (process.env.SANITY_STUDIO_URL || process.env.NEXT_PUBLIC_SANITY_STUDIO_URL)?.trim() ||
  'https://namias-cms.sanity.studio/';

export default function StudioLandingPage() {
  if (process.env.NODE_ENV === 'production' && process.env.SANITY_STUDIO_URL) {
    redirect(process.env.SANITY_STUDIO_URL);
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col justify-center px-6 py-16 text-center">
      <p className="mb-3 text-sm uppercase tracking-[0.24em] text-text-muted-light dark:text-text-muted-dark">
        Sanity Studio
      </p>
      <h1 className="text-3xl font-semibold text-text-primary-light dark:text-text-primary-dark sm:text-5xl">
        CMS and CRM operations live here.
      </h1>
      <p className="mt-4 text-sm leading-7 text-text-secondary-light dark:text-text-secondary-dark sm:text-base">
        The portfolio content is powered by Sanity, and the full editorial workflow is deployed separately for content management.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <a
          href={studioHref}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-lg bg-accent-pink px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-accent-pink-hover"
        >
          Open Studio
        </a>
        <Link
          href="/"
          className="rounded-lg border border-border-light px-5 py-3 text-sm font-medium text-text-primary-light transition-colors hover:border-accent-pink hover:text-accent-pink dark:border-border-dark dark:text-text-primary-dark"
        >
          Back to Portfolio
        </Link>
      </div>
    </main>
  );
}
