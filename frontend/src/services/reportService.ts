import ReactNativeBlobUtil from 'react-native-blob-util';
import { API_URL } from '../api/apiClient';
import { getStoredSession } from './secureStorage';

export async function downloadInventoryReport(format: 'csv' | 'pdf') {
  const session = await getStoredSession();
  if (!session?.token) throw new Error('You must be signed in to export reports');

  const extension = format === 'csv' ? 'csv' : 'pdf';
  const path = `${ReactNativeBlobUtil.fs.dirs.DocumentDir}/inventory-report-${Date.now()}.${extension}`;
  const url = `${API_URL}/reports/inventory.${extension}`;

  const response = await ReactNativeBlobUtil.config({
    fileCache: true,
    path
  }).fetch('GET', url, {
    Authorization: `Bearer ${session.token}`
  });

  return response.path();
}
