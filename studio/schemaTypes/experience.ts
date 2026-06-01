import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'experience',
  title: 'Experience',
  type: 'document',
  fields: [
    defineField({
      name: 'order',
      title: 'Order',
      type: 'number',
    }),
    defineField({
      name: 'role',
      title: 'Role',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'company',
      title: 'Company',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'location',
      title: 'Location',
      type: 'string',
    }),
    defineField({
      name: 'startDate',
      title: 'Start date',
      type: 'string',
      description: 'Use a sortable value like 2025-01-01.',
    }),
    defineField({
      name: 'endDate',
      title: 'End date',
      type: 'string',
      description: 'Use a date string or Present.',
    }),
    defineField({
      name: 'employmentType',
      title: 'Employment type',
      type: 'string',
      options: {
        list: [
          {title: 'Full-time', value: 'Full-time'},
          {title: 'Part-time', value: 'Part-time'},
          {title: 'Freelance', value: 'Freelance'},
          {title: 'Contractual', value: 'Contractual'},
          {title: 'Internship', value: 'Internship'},
        ],
      },
    }),
    defineField({
      name: 'workModel',
      title: 'Work model',
      type: 'string',
      options: {
        list: [
          {title: 'On-site', value: 'On-site'},
          {title: 'Remote', value: 'Remote'},
          {title: 'Hybrid', value: 'Hybrid'},
        ],
      },
    }),
    defineField({
      name: 'summary',
      title: 'Summary',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'featuredStory',
      title: 'Featured story',
      type: 'text',
      rows: 4,
      description: 'A short narrative that can be shown in richer modal or long-form views.',
    }),
    defineField({
      name: 'highlights',
      title: 'Highlights',
      type: 'array',
      of: [{type: 'string'}],
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{type: 'string'}],
    }),
    defineField({
      name: 'achievements',
      title: 'Achievements',
      type: 'array',
      of: [{type: 'string'}],
    }),
    defineField({
      name: 'images',
      title: 'Images',
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
          ],
        },
      ],
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          {title: 'Draft', value: 'draft'},
          {title: 'Published', value: 'published'},
          {title: 'Archived', value: 'archived'},
          {title: 'Featured', value: 'featured'},
          {title: 'Pinned', value: 'pinned'},
        ],
      },
    }),
  ],
  preview: {
    select: {
      title: 'role',
      subtitle: 'company',
      status: 'status',
    },
    prepare(selection) {
      const {status} = selection as {status?: string}
      return {
        title: selection.title,
        subtitle: [selection.subtitle, status].filter(Boolean).join(' • '),
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
      title: 'Start Date, New',
      name: 'startDateDesc',
      by: [{field: 'startDate', direction: 'desc'}],
    },
    {
      title: 'Company, A-Z',
      name: 'companyAsc',
      by: [{field: 'company', direction: 'asc'}],
    },
  ],
})
