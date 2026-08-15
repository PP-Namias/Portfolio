import type { Metadata } from 'next'
import { SITE_URL } from '@/lib/site-config'

export const metadata: Metadata = {
  title: 'Canary Admin | Jhon Keneth Ryan Namias',
  robots: {
    index: false,
    follow: false,
  },
  alternates: {
    canonical: `${SITE_URL}/admin/canary`,
  },
}

export default function CanaryLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children
}
