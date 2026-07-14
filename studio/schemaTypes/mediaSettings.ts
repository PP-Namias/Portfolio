import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'mediaSettings',
  title: 'Media Settings',
  type: 'document',
  fields: [
    defineField({
      name: 'defaultAltTextGuidance',
      title: 'Default alt text guidance',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'fallbackImage',
      title: 'Fallback image',
      type: 'image',
      options: {hotspot: true},
    }),
    defineField({
      name: 'imageQualityPreset',
      title: 'Image quality preset',
      type: 'number',
      initialValue: 75,
      validation: (Rule) => Rule.min(1).max(100),
    }),
    defineField({
      name: 'allowedAspectRatios',
      title: 'Allowed aspect ratios',
      type: 'array',
      of: [{type: 'string'}],
      options: {
        layout: 'tags',
      },
    }),
    defineField({
      name: 'allowedMediaKinds',
      title: 'Allowed media kinds',
      type: 'array',
      of: [{type: 'string'}],
      options: {
        layout: 'tags',
      },
    }),
    defineField({
      name: 'captionDefaults',
      title: 'Caption defaults',
      type: 'text',
      rows: 2,
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Media Settings',
        subtitle: 'Image defaults and fallback behavior',
      }
    },
  },
})
