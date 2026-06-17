import React from 'react';
import { View } from 'react-native';
import { Card, Text, useTheme } from 'react-native-paper';
import type { LucideIcon } from 'lucide-react-native';
import { palette } from '../../theme/theme';

interface MetricCardProps {
  label: string;
  value: string;
  accent?: string;
  icon: LucideIcon;
}

export function MetricCard({ label, value, accent, icon: Icon }: MetricCardProps) {
  const theme = useTheme();
  const color = accent || theme.colors.primary;

  return (
    <Card
      mode="contained"
      style={{
        flex: 1,
        minWidth: '47%',
        backgroundColor: theme.colors.surface,
        borderWidth: 1,
        borderColor: theme.colors.outlineVariant
      }}
    >
      <Card.Content style={{ padding: 16 }}>
        <View className="flex-row items-center justify-between">
          <View style={{ backgroundColor: color === palette.black ? '#EFE4D7' : `${color}1A`, borderRadius: 12, padding: 9 }}>
            <Icon size={18} color={color} />
          </View>
        </View>
        <Text variant="titleLarge" numberOfLines={1} adjustsFontSizeToFit style={{ marginTop: 14, color: theme.colors.onSurface, fontWeight: '900' }}>
          {value}
        </Text>
        <Text variant="bodySmall" numberOfLines={1} style={{ color: theme.colors.onSurfaceVariant, marginTop: 4, fontWeight: '700' }}>
          {label}
        </Text>
      </Card.Content>
    </Card>
  );
}
