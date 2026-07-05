export const seedTasks: {title: string; description: string; assignedTo?: string}[] = [
  {
    title: 'Add OG image to featured projects',
    description:
      'Audit the top 4 featured projects and add a 1200x630 OG image. Without it, social shares fall back to the generic card.',
    assignedTo: 'editor',
  },
  {
    title: 'Confirm certification expiry',
    description:
      'Three certifications have expiresAt within 90 days. Renew or update the credentialUrl.',
    assignedTo: 'editor',
  },
  {
    title: 'Review stale posts',
    description:
      'Posts older than 6 months should be reviewed for technical accuracy. The studio will flag them as Stale automatically.',
  },
  {
    title: 'Test scheduled publish',
    description:
      'Create a post with publishAt set to 5 minutes from now and confirm the Sanity Function promotes it on time.',
  },
]
