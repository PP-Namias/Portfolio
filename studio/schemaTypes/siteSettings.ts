import {defineField, defineType} from 'sanity'

/**
 * Site Settings — the single hub for site-wide content, branding, and
 * social sharing metadata. Reorganized into groups so the editor form
 * is scannable rather than a flat dump of fields.
 *
 * Groups:
 *  - identity         : site name, tagline, owner name
 *  - branding         : logo, favicon, theme color
 *  - socialSharing    : OG image + Twitter image (used when sharing the link)
 *  - defaultSeo       : default title/description for all routes
 *  - theme            : accent color, font
 *  - headings         : section titles (about, projects, etc.)
 *  - heroActions      : primary CTA labels
 *  - contactActions   : contact form / schedule labels
 *  - footer           : footer copy + legal links
 *  - blog             : blog list page copy
 *  - announcement     : site-wide banner
 *  - emptyStates      : fallback copy when collections are empty
 *  - analytics        : GA4 / Plausible IDs
 */
export default defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  groups: [
    {name: 'identity', title: 'Identity', default: true},
    {name: 'branding', title: 'Branding'},
    {name: 'socialSharing', title: 'Social Sharing'},
    {name: 'defaultSeo', title: 'Default SEO'},
    {name: 'theme', title: 'Theme'},
    {name: 'headings', title: 'Section Headings'},
    {name: 'heroActions', title: 'Hero Actions'},
    {name: 'contactActions', title: 'Contact Actions'},
    {name: 'footer', title: 'Footer'},
    {name: 'blog', title: 'Blog'},
    {name: 'announcement', title: 'Announcement Banner'},
    {name: 'emptyStates', title: 'Empty States'},
    {name: 'analytics', title: 'Analytics'},
    {name: 'legal', title: 'Legal'},
  ],
  fields: [
    // Identity
    defineField({
      name: 'siteName',
      title: 'Site name',
      description: 'Used in titles, navigation, and Open Graph. Defaults to the portfolio owner.',
      group: 'identity',
      type: 'string',
      initialValue: 'Jhon Keneth Namias — Portfolio',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'siteTagline',
      title: 'Site tagline',
      description: 'A single short sentence that appears in the hero and meta description.',
      group: 'identity',
      type: 'string',
      initialValue:
        'Full Stack Engineer & AI Automation Specialist based in Caloocan City, Philippines.',
    }),
    defineField({
      name: 'ownerName',
      title: 'Owner / Author name',
      group: 'identity',
      type: 'string',
      initialValue: 'Jhon Keneth Ryan Namias',
    }),
    defineField({
      name: 'ownerShortName',
      title: 'Owner short name (for navigation)',
      group: 'identity',
      type: 'string',
      initialValue: 'Jhon Keneth Namias',
    }),
    defineField({
      name: 'contactEmail',
      title: 'Primary contact email',
      group: 'identity',
      type: 'string',
      initialValue: 'pp.namias@gmail.com',
      validation: (Rule) => Rule.email(),
    }),

    // Branding
    defineField({
      name: 'logo',
      title: 'Logo (SVG / PNG)',
      description: 'Square logo used in the navigation bar.',
      group: 'branding',
      type: 'image',
      options: {hotspot: true},
    }),
    defineField({
      name: 'favicon',
      title: 'Favicon (SVG / PNG)',
      description: 'Small icon for browser tabs. 32x32 or 64x64.',
      group: 'branding',
      type: 'image',
    }),
    defineField({
      name: 'themeColor',
      title: 'Browser theme color',
      description: 'Color of the address bar on mobile devices.',
      group: 'branding',
      type: 'string',
      initialValue: '#ff63a5',
    }),

    // Social Sharing — drives the large preview when sharing the link
    defineField({
      name: 'ogImage',
      title: 'Open Graph image (1200x630)',
      description:
        'The large image shown when the link is shared on LinkedIn, Slack, iMessage, Discord, etc. Recommended size 1200x630 px, max 8 MB.',
      group: 'socialSharing',
      type: 'image',
      options: {hotspot: true},
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt text',
          type: 'string',
          initialValue: 'Jhon Keneth Namias — Portfolio preview',
        }),
      ],
    }),
    defineField({
      name: 'ogImageSquare',
      title: 'Open Graph image (square 1200x1200)',
      description: 'Optional. Used on platforms that prefer square images (e.g. some chat apps).',
      group: 'socialSharing',
      type: 'image',
      options: {hotspot: true},
    }),
    defineField({
      name: 'twitterImage',
      title: 'Twitter / X card image',
      description: 'Shown when sharing on Twitter / X. Falls back to the Open Graph image if empty.',
      group: 'socialSharing',
      type: 'image',
      options: {hotspot: true},
    }),
    defineField({
      name: 'ogTitle',
      title: 'Open Graph title',
      description: 'Title shown next to the preview image. Falls back to the site name.',
      group: 'socialSharing',
      type: 'string',
    }),
    defineField({
      name: 'ogDescription',
      title: 'Open Graph description',
      description: 'Two-sentence summary shown next to the preview image.',
      group: 'socialSharing',
      type: 'text',
      rows: 3,
    }),

    // Default SEO
    defineField({
      name: 'defaultMetaTitle',
      title: 'Default meta title',
      description: 'Used when a page does not provide its own.',
      group: 'defaultSeo',
      type: 'string',
      initialValue: 'Jhon Keneth Namias — Portfolio',
    }),
    defineField({
      name: 'defaultMetaDescription',
      title: 'Default meta description',
      group: 'defaultSeo',
      type: 'text',
      rows: 3,
      initialValue:
        'Full Stack Engineer & AI Automation Specialist based in the Philippines. Next.js, TypeScript, Sanity, Cloudflare.',
    }),
    defineField({
      name: 'canonicalUrl',
      title: 'Canonical URL',
      group: 'defaultSeo',
      type: 'url',
      initialValue: 'https://namias.tech',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'robotsNoindex',
      title: 'Block indexing (noindex)',
      group: 'defaultSeo',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'robotsNofollow',
      title: 'Block link following (nofollow)',
      group: 'defaultSeo',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'sitemapEnabled',
      title: 'Include in sitemap',
      group: 'defaultSeo',
      type: 'boolean',
      initialValue: true,
    }),

    // Theme
    defineField({
      name: 'primaryAccent',
      title: 'Primary accent (CSS color)',
      description: 'Used for buttons, highlights, focus rings. Defaults to brand pink #ff63a5.',
      group: 'theme',
      type: 'string',
      initialValue: '#ff63a5',
    }),
    defineField({
      name: 'secondaryAccent',
      title: 'Secondary accent (CSS color)',
      description: 'Used for gradients and accents. Defaults to brand cyan #06b6d4.',
      group: 'theme',
      type: 'string',
      initialValue: '#06b6d4',
    }),
    defineField({
      name: 'defaultColorMode',
      title: 'Default color mode',
      group: 'theme',
      type: 'string',
      options: {
        list: [
          {title: 'System', value: 'system'},
          {title: 'Light', value: 'light'},
          {title: 'Dark', value: 'dark'},
        ],
        layout: 'radio',
      },
      initialValue: 'system',
    }),

    // Section Headings
    defineField({
      name: 'sectionHeadings',
      title: 'Section headings',
      group: 'headings',
      type: 'object',
      options: {collapsible: true, collapsed: true},
      fields: [
        defineField({name: 'aboutTitle', title: 'About', type: 'string', initialValue: 'About'}),
        defineField({
          name: 'aboutSubtitle',
          title: 'About subtitle',
          type: 'text',
          rows: 2,
          initialValue: 'A short story about how I got here.',
        }),
        defineField({
          name: 'experienceTitle',
          title: 'Experience',
          type: 'string',
          initialValue: 'Experience',
        }),
        defineField({
          name: 'experienceSubtitle',
          title: 'Experience subtitle',
          type: 'text',
          rows: 2,
          initialValue: 'Where I have spent the last few years.',
        }),
        defineField({
          name: 'projectsTitle',
          title: 'Projects',
          type: 'string',
          initialValue: 'Projects',
        }),
        defineField({
          name: 'projectsSubtitle',
          title: 'Projects subtitle',
          type: 'text',
          rows: 2,
          initialValue: 'A few things I have shipped recently.',
        }),
        defineField({
          name: 'certificationsTitle',
          title: 'Certifications',
          type: 'string',
          initialValue: 'Certifications',
        }),
        defineField({
          name: 'certificationsSubtitle',
          title: 'Certifications subtitle',
          type: 'text',
          rows: 2,
          initialValue: 'Credentials, courses, and continuous learning.',
        }),
        defineField({
          name: 'galleryTitle',
          title: 'Gallery',
          type: 'string',
          initialValue: 'Gallery',
        }),
        defineField({
          name: 'gallerySubtitle',
          title: 'Gallery subtitle',
          type: 'text',
          rows: 2,
          initialValue: 'Photos, screenshots, and moments from the journey.',
        }),
        defineField({
          name: 'contactTitle',
          title: 'Contact',
          type: 'string',
          initialValue: 'Connect',
        }),
        defineField({
          name: 'contactSubtitle',
          title: 'Contact subtitle',
          type: 'text',
          rows: 2,
          initialValue: 'Have a project or an opportunity? Let us talk.',
        }),
      ],
    }),

    // Hero Actions
    defineField({
      name: 'heroActions',
      title: 'Hero actions',
      group: 'heroActions',
      type: 'object',
      fields: [
        defineField({
          name: 'resumeLabel',
          title: 'Resume button label',
          type: 'string',
          initialValue: 'Download Resume',
        }),
        defineField({
          name: 'scheduleLabel',
          title: 'Schedule button label',
          type: 'string',
          initialValue: 'Schedule a Call',
        }),
        defineField({
          name: 'emailLabel',
          title: 'Email button label',
          type: 'string',
          initialValue: 'Email Me',
        }),
      ],
    }),

    // Contact Actions
    defineField({
      name: 'contactActions',
      title: 'Contact actions',
      group: 'contactActions',
      type: 'object',
      fields: [
        defineField({
          name: 'scheduleLabel',
          title: 'Schedule button label',
          type: 'string',
          initialValue: 'Book a time',
        }),
        defineField({
          name: 'emailLabel',
          title: 'Email button label',
          type: 'string',
          initialValue: 'Send a message',
        }),
      ],
    }),

    // Footer
    defineField({
      name: 'footer',
      title: 'Footer',
      group: 'footer',
      type: 'object',
      fields: [
        defineField({
          name: 'leadText',
          title: 'Lead text',
          type: 'string',
          initialValue: 'Built with Next.js, Sanity, and Cloudflare Workers.',
        }),
        defineField({
          name: 'linkLabel',
          title: 'Primary link label',
          type: 'string',
          initialValue: 'Back to top',
        }),
        defineField({
          name: 'copyright',
          title: 'Copyright text',
          type: 'string',
          initialValue: 'Jhon Keneth Ryan Namias. All rights reserved.',
        }),
        defineField({
          name: 'backToPortfolioLabel',
          title: 'Back to portfolio label',
          type: 'string',
          initialValue: 'Back to Portfolio',
        }),
        defineField({
          name: 'contactPrompt',
          title: 'Contact prompt',
          type: 'string',
          initialValue: 'Want to work together?',
        }),
      ],
    }),

    // Blog
    defineField({
      name: 'blog',
      title: 'Blog',
      group: 'blog',
      type: 'object',
      fields: [
        defineField({
          name: 'title',
          title: 'Title',
          type: 'string',
          initialValue: 'Writing',
        }),
        defineField({
          name: 'description',
          title: 'Description',
          type: 'text',
          rows: 3,
          initialValue:
            'Field notes on AI, software engineering, prompt design, and shipping things in production.',
        }),
        defineField({
          name: 'backLabel',
          title: 'Back label',
          type: 'string',
          initialValue: 'Back to Portfolio',
        }),
        defineField({
          name: 'postsPerPage',
          title: 'Posts per page',
          type: 'number',
          initialValue: 12,
          validation: (Rule) => Rule.min(1).max(50),
        }),
      ],
    }),

    // Announcement Banner
    defineField({
      name: 'announcementBanner',
      title: 'Announcement banner',
      group: 'announcement',
      type: 'object',
      fields: [
        defineField({
          name: 'enabled',
          title: 'Enabled',
          type: 'boolean',
          initialValue: false,
        }),
        defineField({
          name: 'message',
          title: 'Message',
          type: 'text',
          rows: 2,
          initialValue: 'Open to new opportunities — let us build something great.',
        }),
        defineField({
          name: 'linkLabel',
          title: 'Link label',
          type: 'string',
          initialValue: 'Get in touch',
        }),
        defineField({
          name: 'linkUrl',
          title: 'Link URL',
          type: 'url',
          initialValue: 'mailto:pp.namias@gmail.com',
        }),
        defineField({
          name: 'tone',
          title: 'Tone',
          type: 'string',
          options: {
            list: [
              {title: 'Info', value: 'info'},
              {title: 'Positive (green)', value: 'positive'},
              {title: 'Caution (yellow)', value: 'caution'},
              {title: 'Critical (red)', value: 'critical'},
            ],
            layout: 'radio',
          },
          initialValue: 'positive',
        }),
      ],
    }),

    // Empty States
    defineField({
      name: 'emptyStates',
      title: 'Empty states',
      group: 'emptyStates',
      type: 'object',
      fields: [
        defineField({
          name: 'projects',
          title: 'Projects empty state',
          type: 'string',
          initialValue: 'Projects will appear here once they are published.',
        }),
        defineField({
          name: 'blog',
          title: 'Blog empty state',
          type: 'string',
          initialValue: 'No posts yet. Check back soon.',
        }),
        defineField({
          name: 'testimonials',
          title: 'Testimonials empty state',
          type: 'string',
          initialValue: 'Recommendations will appear here as they are added.',
        }),
        defineField({
          name: 'experience',
          title: 'Experience empty state',
          type: 'string',
          initialValue: 'Experience timeline will appear here.',
        }),
      ],
    }),

    // Analytics
    defineField({
      name: 'analytics',
      title: 'Analytics & tracking',
      group: 'analytics',
      type: 'object',
      fields: [
        defineField({
          name: 'ga4MeasurementId',
          title: 'Google Analytics 4 ID',
          description: 'Format: G-XXXXXXXXXX',
          type: 'string',
        }),
        defineField({
          name: 'plausibleDomain',
          title: 'Plausible domain',
          description: 'If using Plausible, set the registered domain (e.g. namias.tech).',
          type: 'string',
        }),
        defineField({
          name: 'vercelAnalyticsEnabled',
          title: 'Enable Vercel Analytics',
          type: 'boolean',
          initialValue: true,
        }),
      ],
    }),

    // Legal
    defineField({
      name: 'legal',
      title: 'Legal',
      group: 'legal',
      type: 'object',
      fields: [
        defineField({
          name: 'privacyPolicyUrl',
          title: 'Privacy policy URL',
          type: 'url',
        }),
        defineField({
          name: 'termsOfServiceUrl',
          title: 'Terms of service URL',
          type: 'url',
        }),
        defineField({
          name: 'cookieConsentEnabled',
          title: 'Show cookie consent banner',
          type: 'boolean',
          initialValue: false,
        }),
      ],
    }),
  ],
  preview: {
    select: {
      siteName: 'siteName',
      ogImage: 'ogImage',
    },
    prepare({siteName, ogImage}) {
      return {
        title: siteName || 'Site Settings',
        subtitle: ogImage ? 'Branding + social sharing configured' : 'Add an OG image to enable rich link previews',
        media: ogImage as unknown as undefined,
      }
    },
  },
})
