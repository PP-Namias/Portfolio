import type { Metadata } from 'next'
import { SITE_URL } from '@/lib/site-config'

export const metadata: Metadata = {
  title: 'Offline | Jhon Keneth Ryan Namias',
  description: 'You are offline. Cached portfolio pages are still available.',
  robots: {
    index: false,
    follow: false,
  },
  alternates: {
    canonical: `${SITE_URL}/offline`,
  },
}

export default function OfflineLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children
}
