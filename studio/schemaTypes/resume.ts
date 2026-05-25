import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'resume',
  title: 'Resume',
  type: 'document',
  fields: [
    defineField({
      name: 'resumeFile',
      title: 'Resume file',
      type: 'file',
      description: 'Upload the active resume PDF here. The website can keep using the fallback URL until it reads this field directly.',
      validation: (Rule: any) => Rule.required()
    }),
    defineField({
      name: 'resumeUrl',
      title: 'Legacy resume URL',
      type: 'string',
      description: 'Optional fallback path for the active resume while the uploaded file workflow is being adopted.'
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
      resumeFileName: 'resumeFile.asset.originalFilename',
      resumeUrl: 'resumeUrl'
    },
    prepare(selection: any) {
      const {isActive, resumeFileName, resumeUrl} = selection
      return {
        title: resumeFileName || resumeUrl || 'Resume',
        subtitle: isActive ? 'Active Resume' : 'Inactive'
      }
    }
  }
})
