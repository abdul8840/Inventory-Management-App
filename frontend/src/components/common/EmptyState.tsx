import React from 'react';
import { View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';

interface EmptyStateProps {
  title: string;
  message?: string;
}

export function EmptyState({ title, message }: EmptyStateProps) {
  const theme = useTheme();

  return (
    <View className="items-center justify-center px-6 py-12">
      <Text variant="titleMedium" style={{ color: theme.colors.onSurface }}>
        {title}
      </Text>
      {message ? (
        <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, textAlign: 'center', marginTop: 8 }}>
          {message}
        </Text>
      ) : null}
    </View>
  );
}
