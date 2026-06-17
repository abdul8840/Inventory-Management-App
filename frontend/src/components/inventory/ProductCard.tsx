import React from 'react';
import { Image, Pressable, View } from 'react-native';
import { Badge, Card, Text, useTheme } from 'react-native-paper';
import { Package } from 'lucide-react-native';
import type { Product } from '../../types/product';
import { palette } from '../../theme/theme';
import { formatCurrency, formatNumber } from '../../utils/formatters';

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
    <Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel={`Open ${product.title}`}>
      <Card
        mode="contained"
        style={{
          marginBottom: 12,
          backgroundColor: selected ? theme.colors.surfaceVariant : theme.colors.surface,
          borderColor: selected ? theme.colors.primary : 'transparent',
          borderWidth: selected ? 1 : 0,
          borderRadius: 18
        }}
      >
        <Card.Content style={{ padding: 14 }}>
          <View className="flex-row gap-3">
            {primaryImage ? (
              <Image source={{ uri: primaryImage.url }} style={{ width: 78, height: 78, borderRadius: 16 }} />
            ) : (
              <View
                style={{
                  width: 78,
                  height: 78,
                  borderRadius: 16,
                  backgroundColor: theme.colors.primaryContainer,
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Package color={theme.colors.primary} size={30} strokeWidth={1.8} />
              </View>
            )}
            <View className="flex-1">
              <View className="flex-row items-start justify-between gap-2">
                <Text variant="titleMedium" numberOfLines={1} style={{ flex: 1, fontWeight: '700' }}>
                  {product.title}
                </Text>
                {isLowStock ? <Badge style={{ backgroundColor: theme.colors.error, color: '#FFFFFF' }}>Low</Badge> : null}
              </View>
              <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                {product.category} / SKU {product.sku}
              </Text>
              <View className="mt-3 flex-row gap-2">
                <View style={{ flex: 1, borderRadius: 12, backgroundColor: theme.colors.surfaceVariant, padding: 8 }}>
                  <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant, fontWeight: '700' }}>
                    Available
                  </Text>
                  <Text variant="titleSmall" style={{ color: theme.colors.onSurface, fontWeight: '900' }}>
                    {formatNumber(product.stockAvailable)}
                  </Text>
                </View>
                <View style={{ flex: 1, borderRadius: 12, backgroundColor: palette.redSoft, padding: 8 }}>
                  <Text variant="labelSmall" style={{ color: palette.muted, fontWeight: '700' }}>
                    Profit
                  </Text>
                  <Text variant="titleSmall" numberOfLines={1} adjustsFontSizeToFit style={{ color: palette.redDark, fontWeight: '900' }}>
                    {formatCurrency(product.profitAmount)}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </Card.Content>
      </Card>
    </Pressable>
  );
}
