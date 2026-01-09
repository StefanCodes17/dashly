import { useQuery } from '@tanstack/react-query';
import type { DataSource } from '../types';

async function fetchRestData(source: Extract<DataSource, { type: 'rest' }>) {
  const response = await fetch(source.url, {
    method: source.method || 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...source.headers,
    },
    body: source.body ? JSON.stringify(source.body) : undefined,
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}

export function useDataSource<T = unknown>(source: DataSource, widgetId: string) {
  return useQuery<T>({
    queryKey: ['widget-data', widgetId, source],
    queryFn: async () => {
      if (source.type === 'static') {
        return source.data as T;
      }

      if (source.type === 'rest') {
        return fetchRestData(source);
      }

      const _exhaustiveCheck: never = source;
      throw new Error(`Unsupported data source type: ${(_exhaustiveCheck as DataSource).type}`);
    },
    refetchInterval: source.type === 'rest' ? source.refetchInterval : undefined,
  });
}
