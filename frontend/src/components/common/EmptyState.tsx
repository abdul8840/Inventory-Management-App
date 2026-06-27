import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { spacing } from './Layout';

interface EmptyStateProps {
  title: string;
  message?: string;
}

export function EmptyState({ title, message }: EmptyStateProps) {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <Text variant="titleMedium" style={[styles.title, { color: theme.colors.onSurface }]}>
        {title}
      </Text>
      {message ? (
        <Text variant="bodyMedium" style={[styles.message, { color: theme.colors.onSurfaceVariant }]}>
          {message}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xxl,
    paddingVertical: 48
  },
  title: {
    fontWeight: '900',
    letterSpacing: 0,
    textAlign: 'center'
  },
  message: {
    textAlign: 'center',
    marginTop: spacing.sm,
    lineHeight: 22
  }
});

