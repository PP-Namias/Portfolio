import {defineField, defineType} from 'sanity'

import {formatDuration, parseDateLike} from '../../utils/text'

export const ExperienceDurationInput = defineType({
  name: 'experienceDuration',
  title: 'Experience Duration',
  type: 'object',
  fields: [
    defineField({
      name: 'label',
      title: 'Label',
      type: 'string',
      readOnly: true,
    }),
  ],
  preview: {
    select: {label: 'label'},
    prepare({label}) {
      return {
        title: label || 'Duration (auto)',
        subtitle: 'Updates as you edit start/end dates',
      }
    },
  },
})

export function buildDurationInputProps(startDate: unknown, endDate: unknown) {
  const start = parseDateLike(startDate)
  if (!start) {
    return {hidden: true, readOnly: true, value: undefined}
  }
  const label = formatDuration(startDate, endDate)
  return {
    hidden: false,
    readOnly: true,
    value: {label},
  }
}
