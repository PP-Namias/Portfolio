type DateFormatOptions = Omit<Intl.DateTimeFormatOptions, 'timeZone'>;

export function formatDateUtc(value: string | number | Date, options: DateFormatOptions): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return '';
  }

  return new Intl.DateTimeFormat('en-US', {
    ...options,
    timeZone: 'UTC',
  }).format(date);
}