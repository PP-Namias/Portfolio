export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

export function resolveImage(src: string, folder: string): string {
  if (!src) return '';
  if (src.startsWith('http') || src.startsWith('data:') || src.startsWith('/')) return src;
  return `/images/${folder}/${src}`;
}
