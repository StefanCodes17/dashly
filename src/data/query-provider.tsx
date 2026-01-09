import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';

const defaultQueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 30000,
    },
  },
});

export interface DashlyQueryProviderProps {
  children: ReactNode;
  queryClient?: QueryClient;
}

export function DashlyQueryProvider({
  children,
  queryClient = defaultQueryClient,
}: DashlyQueryProviderProps) {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
