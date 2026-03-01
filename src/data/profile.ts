import { Profile } from '@/types';

const S3 = process.env.NEXT_PUBLIC_S3_BUCKET_URL || '';

export const profile: Profile = {
  name: 'Jane Doe',
  title: 'Software Engineer \\ Cloud Engineer',
  location: 'San Francisco, CA',
  tagline: 'Crafting scalable cloud-native solutions.',
  roles: ['Software Engineer', 'Cloud Engineer'],
  email: 'hello@janedoe.dev',
  profilePhoto: '/placeholder-profile.svg',
  ogImage: `${S3}/profile/og-image.png`,
  resumeUrl: `${S3}/resume/resume.pdf`,
  scheduleCallUrl: 'https://cal.com',
  blogUrl: 'https://blog.janedoe.dev',
  achievementBadge: {
    text: 'Cloud Innovation Summit 2025 Winner',
    icon: 'trophy',
  },
  bio: [
    'I am a software engineer and cloud enthusiast based in San Francisco, passionate about designing and building scalable, resilient cloud-native applications. With deep expertise in full-stack development and cloud infrastructure, I turn complex requirements into elegant, production-ready systems.',
    'My journey in technology started with a fascination for distributed systems and how software at scale can solve real-world problems. Over the years, I have architected microservices, built CI/CD pipelines, and deployed applications across multi-cloud environments, always striving for reliability and performance.',
    'When I\'m not writing code, you can find me contributing to open-source projects, mentoring aspiring engineers, or diving into the latest trends in Kubernetes, serverless computing, and platform engineering. I believe in continuous learning and empowering others through knowledge sharing.',
  ],
};
