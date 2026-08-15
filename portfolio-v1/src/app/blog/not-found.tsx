import Link from 'next/link'

export default function BlogNotFound() {
  return (
    <div className="mx-auto max-w-container px-4 sm:px-6 pt-8 lg:pt-12">
      <div className="text-center py-12">
        <h1 className="text-xl font-semibold mb-2">Blog post not found</h1>
        <p className="text-text-muted-light dark:text-text-muted-dark mb-4">
          The blog post you&apos;re looking for doesn&apos;t exist or has been removed.
        </p>
        <Link href="/blog" className="px-4 py-2 rounded-lg bg-accent text-white inline-block">
          Back to Blog
        </Link>
      </div>
    </div>
  )
}
