import { Project } from '@/types';

const S3 = process.env.NEXT_PUBLIC_S3_BUCKET_URL || '';

export const projects: Project[] = [
  {
    id: 'proj-1',
    name: 'CloudDash',
    description: 'A real-time cloud infrastructure monitoring dashboard with multi-provider support and intelligent alerting.',
    url: 'clouddash.dev',
    thumbnail: `${S3}/projects/codecred.png`,
  },
  {
    id: 'proj-2',
    name: 'DeployPilot',
    description: 'An open-source CI/CD orchestration tool that simplifies multi-environment deployments with zero-downtime releases.',
    url: 'deploypilot.io',
    thumbnail: `${S3}/projects/base404.png`,
  },
  {
    id: 'proj-3',
    name: 'APIForge',
    description: 'A developer toolkit for designing, mocking, and testing RESTful and GraphQL APIs with automated documentation.',
    url: 'apiforge.dev',
    thumbnail: `${S3}/projects/diinph.png`,
  },
  {
    id: 'proj-4',
    name: 'InfraSpec',
    description: 'An infrastructure-as-code validation platform that catches misconfigurations before they reach production.',
    url: 'infraspec.io',
    thumbnail: `${S3}/projects/dynamis.png`,
  },
];
