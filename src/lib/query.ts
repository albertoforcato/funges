import { QueryClient } from '@tanstack/react-query';

// Create a query client with default options
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Retry failed requests 3 times
      retry: 3,
      // Retry with exponential backoff
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      // Stale time - data is considered fresh for 5 minutes
      staleTime: 5 * 60 * 1000,
      // Cache time - keep data in cache for 10 minutes
      gcTime: 10 * 60 * 1000,
      // Refetch on window focus
      refetchOnWindowFocus: false,
      // Refetch on reconnect
      refetchOnReconnect: true,
    },
    mutations: {
      // Retry failed mutations once
      retry: 1,
      // Retry delay for mutations
      retryDelay: 1000,
    },
  },
});

// Query keys factory for type-safe query keys
export const queryKeys = {
  // Species data
  species: {
    all: ['species'] as const,
    lists: () => [...queryKeys.species.all, 'list'] as const,
    list: (filters: string) => [...queryKeys.species.lists(), { filters }] as const,
    details: () => [...queryKeys.species.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.species.details(), id] as const,
  },
  // Recipes data
  recipes: {
    all: ['recipes'] as const,
    lists: () => [...queryKeys.recipes.all, 'list'] as const,
    list: (filters: string) => [...queryKeys.recipes.lists(), { filters }] as const,
    details: () => [...queryKeys.recipes.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.recipes.details(), id] as const,
  },
  // Map data
  map: {
    all: ['map'] as const,
    regions: () => [...queryKeys.map.all, 'regions'] as const,
    weather: (region: string) => [...queryKeys.map.all, 'weather', region] as const,
    soil: (region: string) => [...queryKeys.map.all, 'soil', region] as const,
  },
  // AI classification
  classification: {
    all: ['classification'] as const,
    result: (imageHash: string) => [...queryKeys.classification.all, 'result', imageHash] as const,
  },
} as const; 