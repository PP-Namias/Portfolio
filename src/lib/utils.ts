export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

export function formatUrl(url: string): string {
  return url.replace(/^https?:\/\//, '');
}
