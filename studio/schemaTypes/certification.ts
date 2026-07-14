import {defineField, defineType} from 'sanity'

import {dateOrder, requireAltText} from '../validation/rules'

export default defineType({
  name: 'certification',
  title: 'Certification',
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
      name: 'issuer',
      title: 'Issuer',
      type: 'reference',
      to: [{type: 'certificationIssuer'}],
      options: {
        disableNew: false,
      },
    }),
    defineField({
      name: 'issuedAt',
      title: 'Issued at',
      type: 'date',
    }),
    defineField({
      name: 'expiresAt',
      title: 'Expires at',
      type: 'date',
      hidden: ({parent}) => parent?.neverExpires === true,
      validation: dateOrder('issuedAt'),
    }),
    defineField({
      name: 'neverExpires',
      title: 'Never expires',
      type: 'boolean',
      initialValue: false,
      description: 'When enabled, the expiresAt field is hidden.',
    }),
    defineField({
      name: 'credentialUrl',
      title: 'Credential URL',
      type: 'url',
      hidden: ({parent}) => parent?.neverExpires === true,
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'reference',
      to: [{type: 'certificationCategory'}],
      options: {
        disableNew: false,
      },
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{type: 'string'}],
    }),
    defineField({
      name: 'image',
      title: 'Certificate image',
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
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'issuer.title',
      issuedAt: 'issuedAt',
    },
    prepare(selection) {
      const {issuedAt} = selection as {issuedAt?: string}
      return {
        ...selection,
        subtitle: [selection.subtitle, issuedAt].filter(Boolean).join(' • '),
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
      title: 'Issued Date, New',
      name: 'issuedAtDesc',
      by: [{field: 'issuedAt', direction: 'desc'}],
    },
    {
      title: 'Title, A-Z',
      name: 'titleAsc',
      by: [{field: 'title', direction: 'asc'}],
    },
  ],
})
