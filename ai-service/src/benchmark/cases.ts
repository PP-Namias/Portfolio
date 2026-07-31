export interface BenchmarkCase {
  id: string;
  query: string;
  expectedDocIds?: string[];
  keywords?: string[];
}

export const defaultCases: BenchmarkCase[] = [
  {
    id: 'projects-overview',
    query: 'What projects has PP Namias built?',
    expectedDocIds: ['project:'],
    keywords: ['project'],
  },
  {
    id: 'experience-frameworks',
    query: 'Does PP Namias have experience with Next.js and React?',
    expectedDocIds: ['experience:'],
    keywords: ['next', 'react'],
  },
  {
    id: 'certifications',
    query: 'What certifications does PP Namias hold?',
    expectedDocIds: ['certification:'],
    keywords: ['certif'],
  },
  {
    id: 'blog-posts',
    query: 'What does PP Namias write about in blog posts?',
    expectedDocIds: ['post:'],
    keywords: ['post', 'blog'],
  },
  {
    id: 'skills-stack',
    query: 'Which technologies are in PP Namias tech stack?',
    expectedDocIds: ['skill:'],
    keywords: ['stack', 'skill', 'technolog'],
  },
  {
    id: 'contact-hiring',
    query: 'How can I get in touch with PP Namias about a job?',
    keywords: ['contact', 'email', 'touch'],
  },
  {
    id: 'greeting',
    query: 'Hello there, nice to meet you!',
    keywords: ['hello', 'hi', 'nice'],
  },
  {
    id: 'off-topic',
    query: 'What is the weather forecast in Tokyo?',
    keywords: ['weather'],
  },
];
