import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'resume',
  title: 'Resume',
  type: 'document',
  fields: [
    defineField({
      name: 'resumeFile',
      title: 'Resume PDF File',
      type: 'file',
      options: {
        accept: '.pdf'
      },
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
      file: 'resumeFile'
    },
    prepare(selection: any) {
      const {isActive, file} = selection
      const fileName = file?.asset?.originalFilename || 'Resume'
      return {
        title: fileName,
        subtitle: isActive ? 'Active Resume' : 'Inactive'
      }
    }
  }
})
