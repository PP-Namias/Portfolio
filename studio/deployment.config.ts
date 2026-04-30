/**
 * Studio Build Configuration
 * 
 * This file documents the build and deployment setup for Sanity Studio
 * as a standalone deployment separate from the main portfolio app.
 */

export const studioDeploymentConfig = {
  /**
   * Vercel Deployment Settings for studio/ folder
   */
  vercel: {
    projectName: 'portfolio-studio',
    frameworkPreset: 'vite',
    rootDirectory: 'studio',
    buildCommand: 'npm run build',
    outputDirectory: 'dist',
    environmentVariables: {
      NEXT_PUBLIC_SANITY_PROJECT_ID: 'nl0qw78w',
      NEXT_PUBLIC_SANITY_DATASET: 'production',
    },
    domain: {
      domainName: 'namias.tech',
      subDomain: 'cms',
      fullUrl: 'https://cms.namias.tech',
    },
  },

  /**
   * Local Studio Development Server
   */
  local: {
    command: 'npm run dev --prefix studio/',
    port: 3333,
    url: 'http://localhost:3333',
  },

  /**
   * Sanity Configuration
   */
  sanity: {
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'your-project-id',
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
    apiVersion: '2023-05-03',
    cors: {
      allowedOrigins: [
        'https://namias.tech',
        'https://cms.namias.tech',
        'http://localhost:3000',
        'http://localhost:3333',
      ],
    },
  },

  /**
   * Deployment Checklist
   */
  preDeploymentChecklist: [
    '✓ Sanity project created and project ID configured',
    '✓ API tokens generated (read-only for portfolio, admin for studio)',
    '✓ CORS origins added to Sanity dashboard',
    '✓ studio/ folder build tested locally: npm run build --prefix studio/',
    '✓ Environment variables set in Vercel console',
    '✓ DNS records configured (cms.namias.tech assigned to Vercel)',
    '✓ Studio authentication enabled',
    '✓ Data migration completed: npm run migrate:sanity',
  ],

  /**
   * Post-Deployment Verification
   */
  postDeploymentVerification: [
    '✓ Studio accessible at https://cms.namias.tech',
    '✓ Authentication works (login required)',
    '✓ Documents visible and editable',
    '✓ Publish/unpublish workflow functional',
    '✓ Portfolio fetches data without errors',
    '✓ Fallback logs show zero timeout/CORS errors',
    '✓ ISR revalidation triggers on document publish',
  ],
};

export default studioDeploymentConfig;
