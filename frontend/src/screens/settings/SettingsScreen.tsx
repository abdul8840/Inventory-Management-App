import React from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { Button, SegmentedButtons, Switch, Text, useTheme } from 'react-native-paper';
import { Settings } from 'lucide-react-native';
import { HeroPanel, Stack, SurfacePanel, radius, spacing } from '../../components/common/Layout';
import { Screen } from '../../components/common/Screen';
import { paperIcon } from '../../components/common/PaperIcon';
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
      <Stack gap={spacing.lg}>
        <HeroPanel eyebrow="Workspace controls" title="Settings" body="Tune theme, alerts, exports, and device notifications." icon={Settings} compact />
        <SurfacePanel>
          <Stack gap={spacing.md}>
            <Text variant="titleMedium" style={[styles.panelTitle, { color: theme.colors.onSurface }]}>Theme</Text>
            <SegmentedButtons
              value={themeMode}
              onValueChange={(value) => dispatch(setThemeMode(value as 'system' | 'light' | 'dark'))}
              density="small"
              buttons={[
                { value: 'system', label: 'System', icon: paperIcon('monitor-cog'), showSelectedCheck: false },
                { value: 'light', label: 'Light', icon: paperIcon('sun'), showSelectedCheck: false },
                { value: 'dark', label: 'Dark', icon: paperIcon('moon'), showSelectedCheck: false }
              ]}
            />
          </Stack>
        </SurfacePanel>
        <SurfacePanel>
          <Stack gap={spacing.lg}>
            <SettingRow
              title="Low stock alerts"
              body="Notify when stock reaches product thresholds."
              value={settings.data?.lowStockAlertsEnabled ?? true}
              onValueChange={(value) => updateSettings.mutate({ lowStockAlertsEnabled: value })}
            />
            <SettingRow
              title="Push notifications"
              body="Register this device for push-ready alerts."
              value={settings.data?.pushNotificationsEnabled ?? false}
              onValueChange={enablePush}
            />
          </Stack>
        </SurfacePanel>
        <SurfacePanel>
          <Stack gap={spacing.md}>
            <Text variant="titleMedium" style={[styles.panelTitle, { color: theme.colors.onSurface }]}>Reports</Text>
            <View style={styles.reportRow}>
              <Button mode="contained" contentStyle={styles.reportButtonContent} style={styles.reportButtonLeft} onPress={() => exportReport('csv')}>
                Export CSV
              </Button>
              <Button mode="outlined" contentStyle={styles.reportButtonContent} style={styles.reportButton} onPress={() => exportReport('pdf')}>
                Export PDF
              </Button>
            </View>
          </Stack>
        </SurfacePanel>
      </Stack>
    </Screen>
  );
}

function SettingRow({ title, body, value, onValueChange }: { title: string; body: string; value: boolean; onValueChange: (value: boolean) => void }) {
  const theme = useTheme();

  return (
    <View style={styles.settingRow}>
      <View style={styles.settingCopy}>
        <Text variant="titleMedium" style={[styles.panelTitle, { color: theme.colors.onSurface }]}>{title}</Text>
        <Text variant="bodyMedium" style={[styles.settingBody, { color: theme.colors.onSurfaceVariant }]}>{body}</Text>
      </View>
      <Switch value={value} onValueChange={onValueChange} />
    </View>
  );
}

const styles = StyleSheet.create({
  panelTitle: {
    fontWeight: '900',
    letterSpacing: 0
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  settingCopy: {
    flex: 1,
    minWidth: 0,
    paddingRight: spacing.md
  },
  settingBody: {
    marginTop: spacing.xs,
    lineHeight: 21
  },
  reportRow: {
    flexDirection: 'row'
  },
  reportButton: {
    flex: 1,
    borderRadius: radius.lg
  },
  reportButtonLeft: {
    flex: 1,
    borderRadius: radius.lg,
    marginRight: spacing.md
  },
  reportButtonContent: {
    minHeight: 52
  }
});
