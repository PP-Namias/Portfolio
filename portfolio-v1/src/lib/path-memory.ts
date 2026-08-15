export const PATH_MEMORY_KEY = 'pp_prev_path';

export function getPrevPath(): string | null {
  try {
    return sessionStorage.getItem(PATH_MEMORY_KEY);
  } catch {
    return null;
  }
}
