import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'membership',
  title: 'Membership',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'url',
      title: 'URL',
      type: 'url',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'joinedAt',
      title: 'Joined at',
      type: 'date',
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'joinedAt',
    },
  },
})
