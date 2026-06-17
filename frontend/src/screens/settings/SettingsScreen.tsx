import React from 'react';
import { Alert, View } from 'react-native';
import { Button, Card, SegmentedButtons, Switch, Text, useTheme } from 'react-native-paper';
import { Screen } from '../../components/common/Screen';
import { useSettings, useUpdateSettings } from '../../features/profile/useSettings';
import { setThemeMode } from '../../store/preferencesSlice';
import { useAppDispatch, useAppSelector } from '../../hooks/useStore';
import { downloadInventoryReport } from '../../services/reportService';
import { registerForPushNotifications } from '../../services/pushNotifications';

export function SettingsScreen() {
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const themeMode = useAppSelector((state) => state.preferences.themeMode);
  const settings = useSettings();
  const updateSettings = useUpdateSettings();

  const exportReport = async (format: 'csv' | 'pdf') => {
    try {
      const path = await downloadInventoryReport(format);
      Alert.alert('Export ready', `Saved to ${path}`);
    } catch (error) {
      Alert.alert('Export failed', error instanceof Error ? error.message : 'Unable to export report.');
    }
  };

  const enablePush = async () => {
    const token = await registerForPushNotifications();
    updateSettings.mutate({ pushNotificationsEnabled: Boolean(token) });
  };

  return (
    <Screen>
      <View style={{ backgroundColor: theme.colors.secondary, borderRadius: 24, padding: 18 }}>
        <Text variant="labelLarge" style={{ color: '#F5D8DC', fontWeight: '800' }}>
          Workspace controls
        </Text>
        <Text variant="headlineSmall" style={{ color: '#FFFFFF', fontWeight: '900', marginTop: 4 }}>
          Settings
        </Text>
      </View>
      <Card mode="contained" style={{ marginTop: 16, backgroundColor: theme.colors.surface, borderWidth: 1, borderColor: theme.colors.outlineVariant }}>
        <Card.Content style={{ padding: 16 }}>
          <Text variant="titleMedium" style={{ color: theme.colors.onSurface, fontWeight: '900', marginBottom: 10 }}>
            Theme
          </Text>
          <SegmentedButtons
            value={themeMode}
            onValueChange={(value) => dispatch(setThemeMode(value as 'system' | 'light' | 'dark'))}
            buttons={[
              { value: 'system', label: 'System' },
              { value: 'light', label: 'Light' },
              { value: 'dark', label: 'Dark' }
            ]}
          />
        </Card.Content>
      </Card>
      <Card mode="contained" style={{ marginTop: 16, backgroundColor: theme.colors.surface, borderWidth: 1, borderColor: theme.colors.outlineVariant }}>
        <Card.Content style={{ padding: 16 }}>
          <View className="flex-row items-center justify-between">
            <View className="flex-1">
              <Text variant="titleMedium" style={{ color: theme.colors.onSurface, fontWeight: '900' }}>
                Low stock alerts
              </Text>
              <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>Notify when stock reaches product thresholds.</Text>
            </View>
            <Switch
              value={settings.data?.lowStockAlertsEnabled ?? true}
              onValueChange={(value) => updateSettings.mutate({ lowStockAlertsEnabled: value })}
            />
          </View>
          <View className="mt-4 flex-row items-center justify-between">
            <View className="flex-1">
              <Text variant="titleMedium" style={{ color: theme.colors.onSurface, fontWeight: '900' }}>
                Push notifications
              </Text>
              <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>Register this device for push-ready alerts.</Text>
            </View>
            <Switch value={settings.data?.pushNotificationsEnabled ?? false} onValueChange={enablePush} />
          </View>
        </Card.Content>
      </Card>
      <Card mode="contained" style={{ marginTop: 16, backgroundColor: theme.colors.surface, borderWidth: 1, borderColor: theme.colors.outlineVariant }}>
        <Card.Content style={{ padding: 16 }}>
          <Text variant="titleMedium" style={{ color: theme.colors.onSurface, fontWeight: '900', marginBottom: 10 }}>
            Reports
          </Text>
          <View className="flex-row gap-3">
            <Button mode="contained" onPress={() => exportReport('csv')}>
              Export CSV
            </Button>
            <Button mode="outlined" onPress={() => exportReport('pdf')}>
              Export PDF
            </Button>
          </View>
        </Card.Content>
      </Card>
    </Screen>
  );
}
