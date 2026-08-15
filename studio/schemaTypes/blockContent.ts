import {defineType, defineArrayMember} from 'sanity'

export default defineType({
  title: 'Block Content',
  name: 'blockContent',
  type: 'array',
  of: [
    defineArrayMember({
      title: 'Block',
      type: 'block',
      styles: [
        {title: 'Normal', value: 'normal'},
        {title: 'H1', value: 'h1'},
        {title: 'H2', value: 'h2'},
        {title: 'H3', value: 'h3'},
        {title: 'H4', value: 'h4'},
        {title: 'Quote', value: 'blockquote'},
      ],
      lists: [{title: 'Bullet', value: 'bullet'}, {title: 'Number', value: 'number'}],
      marks: {
        decorators: [
          {title: 'Strong', value: 'strong'},
          {title: 'Emphasis', value: 'em'},
          {title: 'Code', value: 'code'},
        ],
        annotations: [
          {
            title: 'URL',
            name: 'link',
            type: 'object',
            fields: [
              {
                title: 'URL',
                name: 'href',
                type: 'url',
                validation: (Rule) => Rule.uri({scheme: ['http', 'https', 'mailto', 'tel']}),
              },
            ],
          },
          {
            title: 'Email Link',
            name: 'emailLink',
            type: 'object',
            fields: [
              {
                title: 'Email',
                name: 'href',
                type: 'url',
                validation: (Rule) => Rule.uri({scheme: ['mailto']}),
              },
            ],
          },
        ],
      },
    }),
    defineArrayMember({
      type: 'image',
      options: {hotspot: true},
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative Text',
        },
        {
          name: 'caption',
          type: 'string',
          title: 'Caption',
        },
        {
          name: 'credit',
          type: 'string',
          title: 'Credit / Photographer',
          description: 'Who took or created this image',
        },
        {
          name: 'source',
          type: 'url',
          title: 'Source URL',
          description: 'Link to original source (if applicable)',
        },
        {
          name: 'license',
          type: 'string',
          title: 'License',
          description: 'e.g. CC BY 4.0, Screenshot by author, MIT',
        },
      ],
    }),
    defineArrayMember({
      name: 'imageGallery',
      type: 'object',
      title: 'Image Gallery',
      fields: [
        {
          name: 'images',
          type: 'array',
          title: 'Images',
          of: [
            {
              type: 'image',
              options: {hotspot: true},
              fields: [
                {name: 'alt', type: 'string', title: 'Alt Text'},
                {name: 'caption', type: 'string', title: 'Caption'},
                {name: 'credit', type: 'string', title: 'Credit'},
              ],
            },
          ],
        },
        {
          name: 'layout',
          type: 'string',
          title: 'Layout',
          options: {
            list: [
              {title: '2 Columns', value: '2col'},
              {title: '3 Columns', value: '3col'},
            ],
          },
        },
      ],
      preview: {
        select: {images: 'images', layout: 'layout'},
        prepare({images, layout}: {images?: Array<unknown>; layout?: string}) {
          const count = images?.length ?? 0;
          const cols = layout === '3col' ? '3' : '2';
          return {title: `Image Gallery (${count} images, ${cols}-col)`};
        },
      },
    }),
  ],
})
