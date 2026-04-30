import { useEffect, useState } from 'react';
import { safeFetchSanity } from '@/lib/sanity';

export function useSanityData<T>(query: string, fallbackData: T): T {
  const [data, setData] = useState<T>(fallbackData);

  useEffect(() => {
    let mounted = true;
    safeFetchSanity<T>(query, fallbackData).then((res) => {
      if (mounted) setData(res);
    });
    return () => {
      mounted = false;
    };
  }, [query, fallbackData]);

  return data;
}
