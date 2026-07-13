export function createServerTimingHeader(metrics: Record<string, number>): string {
  return Object.entries(metrics)
    .map(([key, dur]) => `${key};dur=${Math.round(dur)}`)
    .join(', ');
}

export function parseServerTimingHeader(header: string): Record<string, number> {
  const result: Record<string, number> = {};
  for (const entry of header.split(',')) {
    const [name, durPart] = entry.split(';');
    const dur = durPart?.replace('dur=', '');
    if (name && dur) {
      result[name.trim()] = Number(dur);
    }
  }
  return result;
}
