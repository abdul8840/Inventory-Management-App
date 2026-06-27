import React from 'react';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { BellRing } from 'lucide-react-native';
import { EmptyState } from '../../components/common/EmptyState';
import { HeroPanel, spacing, surfacePanelStyle } from '../../components/common/Layout';
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton';
import { useMarkNotificationRead, useNotifications } from '../../features/notifications/useNotifications';
import { formatDate } from '../../utils/formatters';

export function NotificationsScreen() {
  const theme = useTheme();
  const notifications = useNotifications();
  const markRead = useMarkNotificationRead();

  if (notifications.isLoading) {
    return (
      <View style={[styles.loading, { backgroundColor: theme.colors.background }]}>
        <LoadingSkeleton rows={6} />
      </View>
    );
  }

  return (
    <View style={[styles.screen, { backgroundColor: theme.colors.background }]}>
      <FlatList
        data={notifications.data || []}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContent}
        refreshing={notifications.isRefetching}
        onRefresh={notifications.refetch}
        ListHeaderComponent={<HeroPanel eyebrow="Alert feed" title="Notifications" body="Low stock and system events appear here." icon={BellRing} compact style={styles.header} />}
        ListEmptyComponent={<EmptyState title="No notifications" message="Low stock and system alerts will appear here." />}
        renderItem={({ item }) => (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Mark ${item.title} as read`}
            onPress={() => markRead.mutate(item._id)}
            style={[
              surfacePanelStyle(theme),
              styles.notificationCard,
              {
                backgroundColor: item.readAt ? theme.colors.surface : theme.colors.primaryContainer,
                borderColor: item.readAt ? theme.colors.outlineVariant : theme.colors.primary
              }
            ]}
          >
            <Text variant="titleMedium" style={[styles.title, { color: theme.colors.onSurface }]}>
              {item.title}
            </Text>
            <Text variant="bodyMedium" style={[styles.body, { color: theme.colors.onSurfaceVariant }]}>
              {item.body}
            </Text>
            <Text variant="bodySmall" style={[styles.date, { color: theme.colors.onSurfaceVariant }]}>
              {formatDate(item.createdAt)}
            </Text>
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1
  },
  loading: {
    flex: 1,
    width: '100%',
    maxWidth: 560,
    alignSelf: 'center',
    padding: spacing.xl
  },
  listContent: {
    width: '100%',
    maxWidth: 560,
    alignSelf: 'center',
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    paddingBottom: 92
  },
  header: {
    marginBottom: spacing.lg
  },
  notificationCard: {
    marginBottom: spacing.md
  },
  title: {
    fontWeight: '900',
    letterSpacing: 0
  },
  body: {
    marginTop: spacing.xs,
    lineHeight: 21
  },
  date: {
    marginTop: spacing.sm
  }
});
