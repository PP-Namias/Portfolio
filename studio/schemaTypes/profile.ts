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
  name: 'profile',
  title: 'Profile',
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
      title: 'Title',
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
      name: 'email',
      title: 'Email',
      type: 'string',
      validation: (Rule) => Rule.required().email(),
    }),
    defineField({
      name: 'phone',
      title: 'Phone',
      type: 'string',
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
      name: 'resumeUrl',
      title: 'Resume URL',
      type: 'url',
      description: 'Optional direct resume link for profile-level fallback and editor reference.',
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
      name: 'avatar',
      title: 'Avatar (legacy)',
      type: 'image',
      options: {hotspot: true},
      hidden: true,
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt text',
          type: 'string',
        }),
      ],
    }),
    defineField({
      name: 'github',
      title: 'GitHub URL',
      type: 'url',
    }),
    defineField({
      name: 'linkedin',
      title: 'LinkedIn URL',
      type: 'url',
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
                Rule.custom((value: unknown, context: any) => {
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
                Rule.custom((value: unknown, context: any) => {
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
    defineField({
      name: 'summary',
      title: 'Summary',
      type: 'text',
      rows: 6,
    }),
    defineField({
      name: 'highlights',
      title: 'Highlights',
      type: 'object',
      fields: [
        defineField({
          name: 'yearsExperience',
          title: 'Years of experience',
          type: 'number',
        }),
        defineField({
          name: 'projectsCompleted',
          title: 'Projects completed',
          type: 'number',
        }),
        defineField({
          name: 'primaryTechnologies',
          title: 'Primary technologies',
          type: 'array',
          of: [{type: 'string'}],
        }),
      ],
    }),
    defineField({
      name: 'education',
      title: 'Education',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'degree',
              title: 'Degree',
              type: 'string',
            }),
            defineField({
              name: 'institution',
              title: 'Institution',
              type: 'string',
            }),
            defineField({
              name: 'location',
              title: 'Location',
              type: 'string',
            }),
            defineField({
              name: 'startedAt',
              title: 'Started at',
              type: 'string',
            }),
            defineField({
              name: 'endedAt',
              title: 'Ended at',
              type: 'string',
            }),
            defineField({
              name: 'gpa',
              title: 'GPA',
              type: 'string',
            }),
            defineField({
              name: 'honors',
              title: 'Honors',
              type: 'array',
              of: [{type: 'string'}],
            }),
            defineField({
              name: 'relevantCourses',
              title: 'Relevant courses',
              type: 'array',
              of: [{type: 'string'}],
            }),
          ],
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: 'fullName',
      subtitle: 'title',
    },
  },
})
