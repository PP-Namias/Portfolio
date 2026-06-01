import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'aboutSection',
  title: 'About Section',
  type: 'document',
  fields: [
    defineField({
      name: 'aboutContent',
      title: 'About content',
      type: 'array',
      description: 'Rich text shown in the About section.',
      of: [
        {
          type: 'block',
          styles: [{title: 'Normal', value: 'normal'}],
          lists: [] as never[],
          marks: {
            decorators: [
              {title: 'Strong', value: 'strong'},
              {title: 'Emphasis', value: 'em'},
            ],
            annotations: [] as never[],
          },
        } as any,
      ],
    }),
    defineField({
      name: 'aboutParagraphs',
      title: 'About paragraphs (legacy)',
      type: 'array',
      of: [{type: 'text'}],
      hidden: true,
      description: 'Legacy fallback text. Prefer About content.',
    }),
    defineField({
      name: 'education',
      title: 'Education',
      type: 'object',
      fields: [
        defineField({
          name: 'degree',
          title: 'Degree',
          type: 'string',
        }),
        defineField({
          name: 'school',
          title: 'School',
          type: 'string',
        }),
        defineField({
          name: 'location',
          title: 'Location',
          type: 'string',
        }),
        defineField({
          name: 'period',
          title: 'Period',
          type: 'string',
        }),
        defineField({
          name: 'highlights',
          title: 'Highlights',
          type: 'array',
          of: [{type: 'string'}],
        }),
      ],
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'About Section',
        subtitle: 'About copy and education',
      }
    },
  },
})
