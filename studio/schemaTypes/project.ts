import {defineField, defineType} from 'sanity'

import {
  httpsOnly,
  requireAltText,
  summaryLength,
  uniqueSlug,
  yearRange,
  maxArrayItems,
  uniqueTitle,
} from '../validation/rules'

export default defineType({
  name: 'project',
  title: 'Project',
  type: 'document',
  fields: [
    defineField({
      name: 'order',
      title: 'Order',
      type: 'number',
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => [Rule.required(), uniqueTitle({schemaType: 'project'})],
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: uniqueSlug,
    }),
    defineField({
      name: 'summary',
      title: 'Summary',
      type: 'text',
      rows: 4,
      validation: summaryLength({min: 60, max: 320}),
    }),
    defineField({
      name: 'challenge',
      title: 'Challenge',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'solution',
      title: 'Solution',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'result',
      title: 'Result',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'year',
      title: 'Year',
      type: 'number',
      validation: yearRange,
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
    }),
    defineField({
      name: 'featured',
      title: 'Featured',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'role',
      title: 'Role',
      type: 'string',
    }),
    defineField({
      name: 'technologies',
      title: 'Technologies',
      type: 'array',
      of: [{type: 'string'}],
      validation: maxArrayItems({max: 15}),
    }),
    defineField({
      name: 'achievements',
      title: 'Achievements',
      description: 'Optional short bullet points for standout outcomes, wins, or impact.',
      type: 'array',
      of: [{type: 'string'}],
      validation: maxArrayItems({max: 8}),
    }),
    defineField({
      name: 'image',
      title: 'Cover image',
      type: 'image',
      options: {hotspot: true},
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt text',
          type: 'string',
          validation: requireAltText,
        }),
        defineField({
          name: 'caption',
          title: 'Caption',
          type: 'string',
        }),
        defineField({
          name: 'credit',
          title: 'Credit',
          type: 'string',
        }),
        defineField({
          name: 'source',
          title: 'Source',
          type: 'string',
        }),
        defineField({
          name: 'license',
          title: 'License',
          type: 'string',
        }),
        defineField({
          name: 'dominantColor',
          title: 'Dominant color',
          type: 'string',
        }),
      ],
    }),
    defineField({
      name: 'seoImage',
      title: 'SEO & Social Preview Image',
      type: 'image',
      description:
        'Image shown in Google search results. Falls back to cover image if not set. Recommended: 1200x630 pixels.',
      options: {hotspot: true},
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt text',
          type: 'string',
          validation: requireAltText,
        }),
      ],
    }),
    defineField({
      name: 'gallery',
      title: 'Gallery',
      type: 'array',
      of: [
        {
          type: 'image',
          options: {hotspot: true},
          fields: [
            defineField({
              name: 'alt',
              title: 'Alt text',
              type: 'string',
              validation: requireAltText,
            }),
            defineField({
              name: 'caption',
              title: 'Caption',
              type: 'string',
            }),
            defineField({
              name: 'credit',
              title: 'Credit',
              type: 'string',
            }),
            defineField({
              name: 'source',
              title: 'Source',
              type: 'string',
            }),
            defineField({
              name: 'license',
              title: 'License',
              type: 'string',
            }),
            defineField({
              name: 'dominantColor',
              title: 'Dominant color',
              type: 'string',
            }),
          ],
        },
      ],
    }),
    defineField({
      name: 'liveUrl',
      title: 'Live URL',
      type: 'url',
      hidden: ({parent}) => parent?.status === 'concept' || parent?.status === 'draft',
      description: 'Hidden for concept/draft projects. Use https:// only.',
      validation: httpsOnly,
    }),
    defineField({
      name: 'repositoryUrl',
      title: 'Repository URL',
      type: 'url',
      validation: httpsOnly,
    }),
    defineField({
      name: 'featuredRank',
      title: 'Featured rank',
      type: 'number',
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          {title: 'Completed', value: 'completed'},
          {title: 'In progress', value: 'in-progress'},
          {title: 'Prototype', value: 'prototype'},
          {title: 'Draft', value: 'draft'},
          {title: 'Archived', value: 'archived'},
        ],
      },
    }),
    defineField({
      name: 'tier',
      title: 'Tier',
      type: 'string',
      options: {
        list: [
          {title: 'Featured', value: 'featured'},
          {title: 'Standard', value: 'standard'},
          {title: 'Archived', value: 'archived'},
        ],
      },
      initialValue: 'standard',
      description: 'Controls display priority. Featured projects appear first.',
    }),
    defineField({
      name: 'showcaseDetail',
      title: 'Showcase detail page',
      type: 'boolean',
      initialValue: false,
      description: 'Enable a dedicated /projects/[slug] detail page for this project.',
    }),
    defineField({
      name: 'shortDescription',
      title: 'Short description',
      type: 'string',
      description: 'One-liner for the home page index card (max 120 chars).',
      validation: (Rule) => Rule.max(120),
    }),
    defineField({
      name: 'highlights',
      title: 'Highlights',
      type: 'array',
      of: [{type: 'string'}],
      description: 'Key achievements or talking points for the detail page.',
      validation: maxArrayItems({max: 6}),
    }),
    defineField({
      name: 'githubRepo',
      title: 'GitHub repo name',
      type: 'string',
      description: 'GitHub repository name (e.g. "Portfolio", "Klaro").',
    }),
    defineField({
      name: 'publishAt',
      title: 'Scheduled publish at',
      type: 'datetime',
      description: 'Set this to schedule the project to go live later.',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'summary',
      featured: 'featured',
      status: 'status',
      publishAt: 'publishAt',
    },
    prepare(selection) {
      const {title, subtitle, featured, status, publishAt} = selection as {
        title?: string
        subtitle?: string
        featured?: boolean
        status?: string
        publishAt?: string
      }
      const statusLabel = status ? status.replace(/-/g, ' ') : 'unspecified'
      const flags = [statusLabel, featured ? 'featured' : null, publishAt ? 'scheduled' : null]
        .filter(Boolean)
        .join(' • ')
      return {
        title,
        subtitle: [subtitle, flags].filter(Boolean).join(' • '),
      }
    },
  },
  orderings: [
    {
      title: 'Order, Asc',
      name: 'orderAsc',
      by: [{field: 'order', direction: 'asc'}],
    },
    {
      title: 'Featured Rank, Asc',
      name: 'featuredRankAsc',
      by: [{field: 'featuredRank', direction: 'asc'}],
    },
    {
      title: 'Title, A-Z',
      name: 'titleAsc',
      by: [{field: 'title', direction: 'asc'}],
    },
  ],
})
