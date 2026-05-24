import {defineField, defineType} from 'sanity'

const socialIconOptions = [
  {title: 'GitHub', value: 'github'},
  {title: 'LinkedIn', value: 'linkedin'},
  {title: 'Facebook', value: 'facebook'},
  {title: 'Instagram', value: 'instagram'},
  {title: 'Twitter / X', value: 'twitter'},
  {title: 'WhatsApp', value: 'whatsapp'},
  {title: 'Email', value: 'email'},
  {title: 'YouTube', value: 'youtube'},
  {title: 'Website', value: 'website'},
  {title: 'Phone', value: 'phone'},
  {title: 'Generic Message', value: 'message'},
]

const socialPlatformTitleByValue = Object.fromEntries(
  socialIconOptions.map((option) => [option.value, option.title]),
)

const placementOptions = [
  {title: 'Hero', value: 'hero'},
  {title: 'Footer', value: 'footer'},
  {title: 'Contact Section', value: 'contact'},
  {title: 'Quick Actions', value: 'quickActions'},
]

export default defineType({
  name: 'heroSection',
  title: 'Hero Section',
  type: 'document',
  fields: [
    defineField({
      name: 'fullName',
      title: 'Full name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'title',
      title: 'Primary title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'heroRoles',
      title: 'Hero role rotator',
      type: 'array',
      description: 'Roles shown in the hero section, in the same order they should rotate.',
      of: [{type: 'string'}],
    }),
    defineField({
      name: 'location',
      title: 'Location',
      type: 'string',
    }),
    defineField({
      name: 'availabilityLabel',
      title: 'Availability',
      type: 'string',
      options: {
        list: [
          {title: 'Available', value: 'Available'},
          {title: 'Unavailable', value: 'Unavailable'},
        ],
        layout: 'radio',
        direction: 'horizontal',
      },
      initialValue: 'Available',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'contactEmail',
      title: 'Primary contact email',
      type: 'string',
      validation: (Rule) => Rule.required().email(),
    }),
    defineField({
      name: 'resumeUrl',
      title: 'Legacy resume URL',
      type: 'url',
      description: 'Optional fallback. The active resume document is preferred.',
    }),
    defineField({
      name: 'profileImage',
      title: 'Profile image',
      type: 'image',
      options: {hotspot: true},
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt text',
          type: 'string',
        }),
      ],
    }),
    defineField({
      name: 'socialLinks',
      title: 'Social links',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'platform',
              title: 'Social platform',
              type: 'string',
              options: {
                list: socialIconOptions,
                layout: 'dropdown',
              },
              description: 'Choose from the supported social platforms.',
              validation: (Rule: any) => Rule.required(),
            }),
            defineField({
              name: 'icon',
              title: 'Icon',
              type: 'string',
              hidden: true,
              options: {
                list: socialIconOptions,
                layout: 'dropdown',
              },
            }),
            defineField({
              name: 'url',
              title: 'URL',
              type: 'string',
              hidden: ({parent}) => parent?.platform === 'whatsapp',
              description: 'Supports https://, mailto:, tel:, wa.me, and other direct links.',
              validation: (Rule: any) =>
                Rule.custom((value, context) => {
                  const platform = (context.parent as {platform?: string} | undefined)?.platform
                  if (platform === 'whatsapp') {
                    return true
                  }

                  if (typeof value === 'string' && value.trim().length > 0) {
                    return true
                  }

                  return 'URL is required for this platform.'
                }),
            }),
            defineField({
              name: 'whatsappNumber',
              title: 'WhatsApp number',
              type: 'string',
              hidden: ({parent}) => parent?.platform !== 'whatsapp',
              description: 'Use full number with country code, e.g. 639171234567 or +639171234567.',
              validation: (Rule: any) =>
                Rule.custom((value, context) => {
                  const platform = (context.parent as {platform?: string} | undefined)?.platform
                  if (platform !== 'whatsapp') {
                    return true
                  }

                  if (typeof value !== 'string' || value.trim().length === 0) {
                    return 'WhatsApp number is required when platform is WhatsApp.'
                  }

                  const digits = value.replace(/\D/g, '')
                  if (digits.length < 8) {
                    return 'Enter a valid WhatsApp number with country code.'
                  }

                  return true
                }),
            }),
            defineField({
              name: 'placements',
              title: 'Show in',
              type: 'array',
              of: [{type: 'string'}],
              options: {
                list: placementOptions,
                layout: 'grid',
              },
              description: 'Leave empty to show this link everywhere.',
            }),
          ],
          preview: {
            select: {
              platform: 'platform',
              url: 'url',
              whatsappNumber: 'whatsappNumber',
            },
            prepare(selection: any) {
              const platformTitle =
                socialPlatformTitleByValue[selection.platform as keyof typeof socialPlatformTitleByValue] ||
                selection.platform ||
                'Social link'
              const subtitle =
                selection.platform === 'whatsapp'
                  ? selection.whatsappNumber
                  : selection.url

              return {
                title: platformTitle,
                subtitle,
              }
            },
          },
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: 'fullName',
      subtitle: 'title',
      media: 'profileImage',
    },
  },
})
