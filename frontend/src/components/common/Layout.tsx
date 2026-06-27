import React from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { Text, useTheme, type MD3Theme } from 'react-native-paper';
import type { LucideIcon } from 'lucide-react-native';
import { palette } from '../../theme/theme';

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32
};

export const radius = {
  sm: 10,
  md: 14,
  lg: 18,
  xl: 24,
  xxl: 30
};

interface StackProps {
  children: React.ReactNode;
  gap?: number;
  style?: StyleProp<ViewStyle>;
}

export function Stack({ children, gap = spacing.md, style }: StackProps) {
  const items = React.Children.toArray(children).filter(Boolean);

  return (
    <View style={style}>
      {items.map((child, index) => (
        <View key={index} style={index < items.length - 1 ? { marginBottom: gap } : undefined}>
          {child}
        </View>
      ))}
    </View>
  );
}

interface ResponsiveGridProps {
  children: React.ReactNode;
  gap?: number;
  minItemWidth?: number;
  style?: StyleProp<ViewStyle>;
}

export function ResponsiveGrid({ children, gap = spacing.md, minItemWidth = 150, style }: ResponsiveGridProps) {
  const items = React.Children.toArray(children).filter(Boolean);

  return (
    <View style={[styles.grid, { marginHorizontal: -gap / 2 }, style]}>
      {items.map((child, index) => (
        <View key={index} style={{ minWidth: minItemWidth, flexGrow: 1, flexBasis: minItemWidth, paddingHorizontal: gap / 2, marginBottom: gap }}>
          {child}
        </View>
      ))}
    </View>
  );
}

interface SurfacePanelProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
}

export function SurfacePanel({ children, style, contentStyle }: SurfacePanelProps) {
  const theme = useTheme();

  return <View style={[surfacePanelStyle(theme), style, contentStyle]}>{children}</View>;
}

interface HeroPanelProps {
  eyebrow: string;
  title: string;
  body?: string;
  icon?: LucideIcon;
  compact?: boolean;
  style?: StyleProp<ViewStyle>;
}

export function HeroPanel({ eyebrow, title, body, icon: Icon, compact, style }: HeroPanelProps) {
  const theme = useTheme();

  return (
    <View style={[heroPanelStyle(theme), compact && styles.heroCompact, style]}>
      <View style={styles.heroTopRow}>
        <View style={styles.heroCopy}>
          <Text variant="labelLarge" style={styles.heroEyebrow}>
            {eyebrow}
          </Text>
          <Text variant={compact ? 'headlineSmall' : 'headlineMedium'} style={styles.heroTitle}>
            {title}
          </Text>
        </View>
        {Icon ? (
          <View style={styles.heroIconBox}>
            <Icon color={palette.white} size={compact ? 24 : 28} strokeWidth={2} />
          </View>
        ) : null}
      </View>
      {body ? (
        <Text variant="bodyMedium" style={styles.heroBody}>
          {body}
        </Text>
      ) : null}
    </View>
  );
}

interface SectionTitleProps {
  title: string;
  value?: string;
  style?: StyleProp<ViewStyle>;
}

export function SectionTitle({ title, value, style }: SectionTitleProps) {
  const theme = useTheme();

  return (
    <View style={[styles.sectionTitleRow, style]}>
      <Text variant="titleLarge" style={[styles.sectionTitle, { color: theme.colors.onBackground }]}>
        {title}
      </Text>
      {value ? (
        <Text variant="labelLarge" style={{ color: theme.colors.onSurfaceVariant, fontWeight: '800' }}>
          {value}
        </Text>
      ) : null}
    </View>
  );
}

export function surfacePanelStyle(theme: MD3Theme): ViewStyle {
  return {
    backgroundColor: theme.colors.surface,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: theme.colors.outlineVariant,
    padding: spacing.lg,
    shadowColor: palette.black,
    shadowOpacity: theme.dark ? 0 : 0.08,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 2
  };
}

export function heroPanelStyle(theme: MD3Theme): ViewStyle {
  return {
    backgroundColor: theme.colors.secondary,
    borderRadius: radius.xxl,
    padding: spacing.xxl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: theme.dark ? '#3A2629' : '#1B1113'
  };
}

export function inputStyle(theme: MD3Theme): ViewStyle {
  return {
    backgroundColor: theme.dark ? '#1F1718' : '#FFF8F0'
  };
}

export function inputOutlineStyle(): ViewStyle {
  return {
    borderRadius: radius.lg
  };
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  heroCompact: {
    padding: spacing.xl,
    borderRadius: radius.xl
  },
  heroTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between'
  },
  heroCopy: {
    flex: 1,
    paddingRight: spacing.md
  },
  heroEyebrow: {
    color: '#F5D8DC',
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 0
  },
  heroTitle: {
    color: palette.white,
    fontWeight: '900',
    marginTop: spacing.xs,
    letterSpacing: 0
  },
  heroBody: {
    color: '#F5D8DC',
    marginTop: spacing.sm,
    lineHeight: 22
  },
  heroIconBox: {
    width: 52,
    height: 52,
    borderRadius: 18,
    backgroundColor: palette.red,
    alignItems: 'center',
    justifyContent: 'center'
  },
  sectionTitleRow: {
    marginTop: spacing.xxl,
    marginBottom: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  sectionTitle: {
    fontWeight: '900',
    letterSpacing: 0
  }
});
