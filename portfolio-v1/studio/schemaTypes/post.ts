import {defineField, defineType} from 'sanity'

import {ReadingTimeField} from '../components/inputs/ReadingTimeField'
import {requireAltText, summaryLength, uniqueSlug} from '../validation/rules'

export default defineType({
  name: 'post',
  title: 'Blog Post',
  type: 'document',
  fields: [
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
      validation: uniqueSlug,
    }),
    defineField({
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text',
      rows: 3,
      description: 'A brief summary of the blog post',
      validation: summaryLength({min: 40, max: 280}),
    }),
    defineField({
      name: 'metaTitle',
      title: 'Meta title',
      type: 'string',
    }),
    defineField({
      name: 'metaDescription',
      title: 'Meta description',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'featured',
      title: 'Featured',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'sourceId',
      title: 'Source ID',
      type: 'string',
    }),
    defineField({
      name: 'readTime',
      title: 'Read time',
      type: 'string',
    }),
    defineField({
      name: 'computedReadingTime',
      title: 'Reading time (auto)',
      type: 'string',
      readOnly: true,
      hidden: ({parent}) => !parent?.body,
      description: 'Auto-computed from the body word count.',
      components: {input: ReadingTimeField},
    }),
    defineField({
      name: 'mainImage',
      title: 'Main image',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative Text',
          validation: requireAltText,
        },
      ],
    }),
    defineField({
      name: 'seoImage',
      title: 'SEO & Social Preview Image',
      type: 'image',
      description: 'Image shown in Google search results and social media previews. Falls back to main image if not set. Recommended: 1200x630 pixels.',
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
      name: 'coverImagePath',
      title: 'Cover image path',
      type: 'string',
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'blockContent',
    }),
    defineField({
      name: 'author',
      title: 'Author',
      type: 'reference',
      to: {type: 'author'},
    }),
    defineField({
      name: 'categories',
      title: 'Categories',
      type: 'array',
      of: [{type: 'reference', to: {type: 'category'}}],
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{type: 'string'}],
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published at',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: 'publishAt',
      title: 'Scheduled publish at',
      type: 'datetime',
      description: 'Set this to schedule the post to go live later. Leave empty to publish immediately on click.',
    }),
    defineField({
      name: 'published',
      title: 'Published',
      type: 'boolean',
      initialValue: false,
      description: 'Set to true to publish this post',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      author: 'author.name',
      published: 'published',
      publishAt: 'publishAt',
    },
    prepare(selection) {
      const {author, published, publishAt} = selection as {
        author?: string
        published?: boolean
        publishAt?: string
      }
      const flags = [published ? 'published' : 'draft', publishAt ? 'scheduled' : null]
        .filter(Boolean)
        .join(' • ')
      return {...selection, subtitle: [author ? `by ${author}` : null, flags].filter(Boolean).join(' • ')}
    },
  },
  orderings: [
    {
      title: 'Published Date, New',
      name: 'publishedAtDesc',
      by: [{field: 'publishedAt', direction: 'desc'}]
    },
    {
      title: 'Published Date, Old',
      name: 'publishedAtAsc',
      by: [{field: 'publishedAt', direction: 'asc'}]
    },
  ]
})
