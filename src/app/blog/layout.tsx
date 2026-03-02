import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog | Jhon Keneth Namias',
  description: 'Thoughts on AI, software engineering, cloud development, and more by Jhon Keneth Namias.',
  openGraph: {
    title: 'Blog | Jhon Keneth Namias',
    description: 'Thoughts on AI, software engineering, cloud development, and more.',
  },
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return children;
}
