import React from 'react';
import { FlatList, View } from 'react-native';
import { Card, Text, useTheme } from 'react-native-paper';
import { EmptyState } from '../../components/common/EmptyState';
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton';
import { useMarkNotificationRead, useNotifications } from '../../features/notifications/useNotifications';
import { formatDate } from '../../utils/formatters';

export function NotificationsScreen() {
  const theme = useTheme();
  const notifications = useNotifications();
  const markRead = useMarkNotificationRead();

  if (notifications.isLoading) {
    return (
      <View style={{ flex: 1, padding: 16, backgroundColor: theme.colors.background }}>
        <LoadingSkeleton rows={6} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <FlatList
        data={notifications.data || []}
        keyExtractor={(item) => item._id}
        contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
        refreshing={notifications.isRefetching}
        onRefresh={notifications.refetch}
        ListHeaderComponent={
          <View style={{ backgroundColor: theme.colors.secondary, borderRadius: 24, padding: 18, marginBottom: 16 }}>
            <Text variant="labelLarge" style={{ color: '#F5D8DC', fontWeight: '800' }}>
              Alert feed
            </Text>
            <Text variant="headlineSmall" style={{ color: '#FFFFFF', fontWeight: '900', marginTop: 4 }}>
              Notifications
            </Text>
          </View>
        }
        ListEmptyComponent={<EmptyState title="No notifications" message="Low stock and system alerts will appear here." />}
        renderItem={({ item }) => (
          <Card
            mode="contained"
            style={{
              marginBottom: 12,
              backgroundColor: item.readAt ? theme.colors.surface : theme.colors.primaryContainer,
              borderWidth: 1,
              borderColor: item.readAt ? theme.colors.outlineVariant : theme.colors.primary
            }}
            onPress={() => markRead.mutate(item._id)}
          >
            <Card.Content style={{ padding: 16 }}>
              <Text variant="titleMedium" style={{ color: theme.colors.onSurface, fontWeight: '900' }}>
                {item.title}
              </Text>
              <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, marginTop: 4 }}>
                {item.body}
              </Text>
              <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant, marginTop: 8 }}>
                {formatDate(item.createdAt)}
              </Text>
            </Card.Content>
          </Card>
        )}
      />
    </View>
  );
}
