import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'resume',
  title: 'Resume',
  type: 'document',
  fields: [
    defineField({
      name: 'resumeUrl',
      title: 'Resume URL',
      type: 'url',
      description: 'Enter the URL for the live resume file or document. This will be used for the resume button on the site.',
      validation: (Rule: any) => Rule.required()
    }),
    defineField({
      name: 'isActive',
      title: 'Active Resume',
      type: 'boolean',
      description: 'Set to true to use this resume on the website. Only one resume should be active at a time.',
      initialValue: false
    })
  ],
  preview: {
    select: {
      isActive: 'isActive',
      resumeUrl: 'resumeUrl'
    },
    prepare(selection: any) {
      const {isActive, resumeUrl} = selection
      return {
        title: resumeUrl || 'Resume',
        subtitle: isActive ? 'Active Resume' : 'Inactive'
      }
    }
  }
})
