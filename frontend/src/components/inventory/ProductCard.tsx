import React from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import { Badge, Text, useTheme } from 'react-native-paper';
import { Package } from 'lucide-react-native';
import type { Product } from '../../types/product';
import { palette } from '../../theme/theme';
import { formatCurrency, formatNumber } from '../../utils/formatters';
import { radius, spacing, surfacePanelStyle } from '../common/Layout';

interface ProductCardProps {
  product: Product;
  onPress: () => void;
  selected?: boolean;
}

export function ProductCard({ product, onPress, selected }: ProductCardProps) {
  const theme = useTheme();
  const primaryImage = product.images.find((image) => image.isPrimary) || product.images[0];
  const isLowStock = product.stockAvailable <= product.lowStockAlertThreshold;

  return (
    <Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel={`Open ${product.title}`} style={styles.pressable}>
      <View
        style={[
          surfacePanelStyle(theme),
          styles.card,
          selected && {
            backgroundColor: theme.colors.surfaceVariant,
            borderColor: theme.colors.primary
          }
        ]}
      >
        <View style={styles.row}>
          {primaryImage ? (
            <Image source={{ uri: primaryImage.url }} style={styles.image} />
          ) : (
            <View style={[styles.imageFallback, { backgroundColor: theme.colors.primaryContainer }]}>
              <Package color={theme.colors.primary} size={30} strokeWidth={1.8} />
            </View>
          )}
          <View style={styles.content}>
            <View style={styles.titleRow}>
              <Text variant="titleMedium" numberOfLines={1} style={[styles.title, { color: theme.colors.onSurface }]}>
                {product.title}
              </Text>
              {isLowStock ? <Badge style={[styles.badge, { backgroundColor: theme.colors.error, color: '#FFFFFF' }]}>Low</Badge> : null}
            </View>
            <Text variant="bodySmall" numberOfLines={1} style={{ color: theme.colors.onSurfaceVariant }}>
              {product.category} / SKU {product.sku}
            </Text>
            <View style={styles.metricRow}>
              <View style={[styles.metricBox, styles.metricBoxLeft, { backgroundColor: theme.colors.surfaceVariant }]}>
                <Text variant="labelSmall" style={[styles.metricLabel, { color: theme.colors.onSurfaceVariant }]}>Available</Text>
                <Text variant="titleSmall" style={[styles.metricValue, { color: theme.colors.onSurface }]}>{formatNumber(product.stockAvailable)}</Text>
              </View>
              <View style={[styles.metricBox, { backgroundColor: palette.redSoft }]}>
                <Text variant="labelSmall" style={[styles.metricLabel, { color: palette.muted }]}>Profit</Text>
                <Text variant="titleSmall" numberOfLines={1} adjustsFontSizeToFit style={[styles.metricValue, { color: palette.redDark }]}>{formatCurrency(product.profitAmount)}</Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressable: {
    marginBottom: spacing.md
  },
  card: {
    padding: spacing.md,
    borderRadius: radius.xl
  },
  row: {
    flexDirection: 'row',
    alignItems: 'stretch'
  },
  image: {
    width: 82,
    height: 82,
    borderRadius: radius.lg,
    marginRight: spacing.md
  },
  imageFallback: {
    width: 82,
    height: 82,
    borderRadius: radius.lg,
    marginRight: spacing.md,
    alignItems: 'center',
    justifyContent: 'center'
  },
  content: {
    flex: 1,
    minWidth: 0
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start'
  },
  title: {
    flex: 1,
    fontWeight: '900',
    letterSpacing: 0,
    paddingRight: spacing.sm
  },
  badge: {
    alignSelf: 'flex-start'
  },
  metricRow: {
    flexDirection: 'row',
    marginTop: spacing.md
  },
  metricBox: {
    flex: 1,
    borderRadius: radius.md,
    padding: spacing.sm
  },
  metricBoxLeft: {
    marginRight: spacing.sm
  },
  metricLabel: {
    fontWeight: '800',
    letterSpacing: 0
  },
  metricValue: {
    fontWeight: '900',
    letterSpacing: 0,
    marginTop: 2
  }
});
