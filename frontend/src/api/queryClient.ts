import AsyncStorage from '@react-native-async-storage/async-storage';
import { QueryClient } from '@tanstack/react-query';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 1000 * 60,
      gcTime: 1000 * 60 * 60 * 24
    },
    mutations: {
      retry: 0
    }
  }
});

export const persister = createAsyncStoragePersister({
  storage: AsyncStorage,
  key: 'inventory-query-cache'
});
