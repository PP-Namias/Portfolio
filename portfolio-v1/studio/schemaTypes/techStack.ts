import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'techStack',
  title: 'Tech Stack',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      initialValue: 'Tech Stack',
      validation: (Rule: any) => Rule.required(),
    }),
    defineField({
      name: 'technologies',
      title: 'Technologies',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'name',
              title: 'Name',
              type: 'string',
              validation: (Rule: any) => Rule.required(),
            }),
            defineField({
              name: 'logo',
              title: 'Logo',
              type: 'string',
              validation: (Rule: any) => Rule.required(),
            }),
            defineField({
              name: 'category',
              title: 'Category',
              type: 'string',
              validation: (Rule: any) => Rule.required(),
            }),
            defineField({
              name: 'proficiency',
              title: 'Proficiency',
              type: 'number',
              validation: (Rule: any) => Rule.required(),
            }),
          ],
        },
      ],
    }),
  ],
})
