import {defineField, defineType} from 'sanity'

function sectionHeadingField(name: string, title: string) {
  return defineField({
    name,
    title,
    type: 'object',
    fields: [
      defineField({
        name: 'title',
        title: 'Title',
        type: 'string',
      }),
      defineField({
        name: 'subtitle',
        title: 'Subtitle',
        type: 'text',
        rows: 2,
      }),
    ],
  })
}

export default defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    sectionHeadingField('aboutSection', 'About section'),
    sectionHeadingField('experienceSection', 'Experience section'),
    sectionHeadingField('projectsSection', 'Projects section'),
    sectionHeadingField('certificationsSection', 'Certifications section'),
    sectionHeadingField('gallerySection', 'Gallery section'),
    sectionHeadingField('contactSection', 'Contact section'),
    defineField({
      name: 'heroActions',
      title: 'Hero actions',
      type: 'object',
      fields: [
        defineField({
          name: 'resumeLabel',
          title: 'Resume button label',
          type: 'string',
        }),
        defineField({
          name: 'scheduleLabel',
          title: 'Schedule button label',
          type: 'string',
        }),
        defineField({
          name: 'emailLabel',
          title: 'Email button label',
          type: 'string',
        }),
      ],
    }),
    defineField({
      name: 'contactActions',
      title: 'Contact actions',
      type: 'object',
      fields: [
        defineField({
          name: 'scheduleLabel',
          title: 'Schedule button label',
          type: 'string',
        }),
        defineField({
          name: 'emailLabel',
          title: 'Email button label',
          type: 'string',
        }),
      ],
    }),
    defineField({
      name: 'footer',
      title: 'Footer',
      type: 'object',
      fields: [
        defineField({
          name: 'leadText',
          title: 'Lead text',
          type: 'string',
        }),
        defineField({
          name: 'linkLabel',
          title: 'Link label',
          type: 'string',
        }),
        defineField({
          name: 'copyright',
          title: 'Copyright text',
          type: 'string',
        }),
      ],
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Site Settings',
        subtitle: 'Homepage and footer copy',
      }
    },
  },
})
