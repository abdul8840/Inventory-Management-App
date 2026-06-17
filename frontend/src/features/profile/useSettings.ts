import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchSettings, updateSettings, type UserSettings } from '../../api/settingsApi';

export function useSettings() {
  return useQuery({
    queryKey: ['settings'],
    queryFn: fetchSettings
  });
}

export function useUpdateSettings() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<UserSettings>) => updateSettings(payload),
    onSuccess: (settings) => queryClient.setQueryData(['settings'], settings)
  });
}
