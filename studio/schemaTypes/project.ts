import {defineField, defineType} from 'sanity'

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
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
    }),
    defineField({
      name: 'summary',
      title: 'Summary',
      type: 'text',
      rows: 4,
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
    }),
    defineField({
      name: 'achievements',
      title: 'Achievements',
      description: 'Optional short bullet points for standout outcomes, wins, or impact.',
      type: 'array',
      of: [{type: 'string'}],
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
    }),
    defineField({
      name: 'repositoryUrl',
      title: 'Repository URL',
      type: 'url',
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
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'summary',
      featured: 'featured',
      status: 'status',
    },
    prepare(selection) {
      const {title, subtitle, featured, status} = selection as {title?: string; subtitle?: string; featured?: boolean; status?: string}
      const statusLabel = status ? status.replace(/-/g, ' ') : 'unspecified'
      return {
        title,
        subtitle: [subtitle, statusLabel, featured ? 'featured' : null].filter(Boolean).join(' • '),
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
