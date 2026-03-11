import useSWR from 'swr';
import type { SWRConfiguration } from 'swr';

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) {
    const error = new Error('Error al cargar datos');
    throw error;
  }
  return res.json();
};

export function useFetch<T>(key: string | null, options?: SWRConfiguration<T>) {
  return useSWR<T>(key, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    ...options,
  });
}
