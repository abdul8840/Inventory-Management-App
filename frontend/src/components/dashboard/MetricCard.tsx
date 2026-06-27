import React from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import type { LucideIcon } from 'lucide-react-native';
import { palette } from '../../theme/theme';
import { radius, spacing, surfacePanelStyle } from '../common/Layout';

interface MetricCardProps {
  label: string;
  value: string;
  accent?: string;
  icon: LucideIcon;
  style?: StyleProp<ViewStyle>;
}

export function MetricCard({ label, value, accent, icon: Icon, style }: MetricCardProps) {
  const theme = useTheme();
  const color = accent || theme.colors.primary;

  return (
    <View style={[surfacePanelStyle(theme), styles.card, style]}>
      <View style={styles.topRow}>
        <View style={[styles.iconBox, { backgroundColor: color === palette.black ? '#EFE4D7' : `${color}1A` }]}>
          <Icon size={20} color={color} strokeWidth={2.1} />
        </View>
      </View>
      <Text variant="titleLarge" numberOfLines={1} adjustsFontSizeToFit style={[styles.value, { color: theme.colors.onSurface }]}>
        {value}
      </Text>
      <Text variant="bodySmall" numberOfLines={1} style={[styles.label, { color: theme.colors.onSurfaceVariant }]}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: spacing.lg,
    minHeight: 132,
    justifyContent: 'space-between'
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  iconBox: {
    width: 42,
    height: 42,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center'
  },
  value: {
    marginTop: spacing.lg,
    fontWeight: '900',
    letterSpacing: 0
  },
  label: {
    marginTop: spacing.xs,
    fontWeight: '800',
    letterSpacing: 0
  }
});
