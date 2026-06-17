import { useQuery } from '@tanstack/react-query';
import { fetchDashboardAnalytics } from '../../api/analyticsApi';

export function useDashboardAnalytics() {
  return useQuery({
    queryKey: ['dashboard'],
    queryFn: fetchDashboardAnalytics
  });
}
