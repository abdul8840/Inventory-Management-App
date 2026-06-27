import React, { useState } from 'react';
import { Alert, Image, StyleSheet, View } from 'react-native';
import { Button, Divider, Text, TextInput, useTheme } from 'react-native-paper';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton';
import { ResponsiveGrid, Stack, SurfacePanel, inputOutlineStyle, inputStyle, radius, spacing } from '../../components/common/Layout';
import { Screen } from '../../components/common/Screen';
import { useAdjustStock, useDeleteProduct, useProduct } from '../../features/inventory/useProducts';
import { palette } from '../../theme/theme';
import type { InventoryStackParamList } from '../../types/navigation';
import { formatCurrency, formatDate, formatNumber } from '../../utils/formatters';

type Props = NativeStackScreenProps<InventoryStackParamList, 'ProductDetails'>;

export function ProductDetailsScreen({ route, navigation }: Props) {
  const { productId } = route.params;
  const theme = useTheme();
  const productQuery = useProduct(productId);
  const adjustStock = useAdjustStock(productId);
  const deleteProduct = useDeleteProduct();
  const [quantity, setQuantity] = useState('1');
  const product = productQuery.data;

  const adjust = (mode: 'record_sale' | 'restock') => {
    adjustStock.mutate({ mode, quantity: Number(quantity), note: mode === 'record_sale' ? 'Sale recorded from mobile app' : 'Restocked from mobile app' });
  };

  const confirmDelete = () => {
    Alert.alert('Delete product', 'This removes the product from your inventory.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () =>
          deleteProduct.mutate(productId, {
            onSuccess: () => navigation.goBack()
          })
      }
    ]);
  };

  if (productQuery.isLoading || !product) {
    return (
      <Screen>
        <LoadingSkeleton rows={5} />
      </Screen>
    );
  }

  const image = product.images.find((item) => item.isPrimary) || product.images[0];

  return (
    <Screen>
      <Stack gap={spacing.lg}>
        {image ? <Image source={{ uri: image.url }} style={styles.heroImage} /> : null}
        <SurfacePanel>
          <View style={styles.headerRow}>
            <View style={styles.headerCopy}>
              <Text variant="headlineSmall" style={[styles.title, { color: theme.colors.onSurface }]}>
                {product.title}
              </Text>
              <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                {product.category} / SKU {product.sku}
              </Text>
            </View>
            <Button mode="outlined" style={styles.editButton} onPress={() => navigation.navigate('ProductForm', { productId })}>
              Edit
            </Button>
          </View>
        </SurfacePanel>

        <SurfacePanel>
          <ResponsiveGrid gap={spacing.sm} minItemWidth={140}>
            <Metric label="Available" value={formatNumber(product.stockAvailable)} />
            <Metric label="Sold" value={formatNumber(product.stockSold)} />
            <Metric label="Total Stock" value={formatNumber(product.totalStock)} />
            <Metric label="Profit" value={formatCurrency(product.profitAmount)} />
            <Metric label="Margin" value={`${product.profitMargin.toFixed(1)}%`} />
            <Metric label="Sales Value" value={formatCurrency(product.totalSalesValue)} />
          </ResponsiveGrid>
        </SurfacePanel>

        <SurfacePanel>
          <Stack gap={spacing.md}>
            <Text variant="titleMedium" style={[styles.sectionHeading, { color: theme.colors.onSurface }]}>Stock Adjustment</Text>
            <TextInput
              label="Quantity"
              mode="outlined"
              keyboardType="number-pad"
              value={quantity}
              onChangeText={setQuantity}
              style={inputStyle(theme)}
              outlineStyle={inputOutlineStyle()}
            />
            <View style={styles.actionRow}>
              <Button mode="contained" contentStyle={styles.actionButtonContent} style={styles.actionButtonLeft} onPress={() => adjust('record_sale')} loading={adjustStock.isPending}>
                Record Sale
              </Button>
              <Button mode="outlined" contentStyle={styles.actionButtonContent} style={styles.actionButton} onPress={() => adjust('restock')} loading={adjustStock.isPending}>
                Restock
              </Button>
            </View>
          </Stack>
        </SurfacePanel>

        <SurfacePanel>
          <Text variant="titleMedium" style={[styles.sectionHeading, { color: theme.colors.onSurface }]}>Supplier</Text>
          <Text variant="bodyMedium" style={styles.supplierName}>{product.supplierName || 'No supplier name'}</Text>
          <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>{product.supplierContact || 'No supplier contact'}</Text>
          <Divider style={styles.divider} />
          <Text variant="bodyMedium" style={{ color: theme.colors.onSurface }}>{product.description || 'No description'}</Text>
          <Text variant="bodySmall" style={[styles.updatedAt, { color: theme.colors.onSurfaceVariant }]}>Updated {formatDate(product.updatedAt)}</Text>
        </SurfacePanel>
        <Button mode="outlined" textColor={theme.colors.error} contentStyle={styles.deleteContent} style={styles.deleteButton} onPress={confirmDelete}>
          Delete Product
        </Button>
      </Stack>
    </Screen>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  const theme = useTheme();
  const isProfit = label === 'Profit';

  return (
    <View style={[styles.metric, { backgroundColor: isProfit ? palette.redSoft : theme.colors.surfaceVariant }]}>
      <Text variant="labelMedium" style={[styles.metricLabel, { color: isProfit ? palette.redDark : theme.colors.onSurfaceVariant }]}>
        {label}
      </Text>
      <Text variant="titleMedium" numberOfLines={1} adjustsFontSizeToFit style={[styles.metricValue, { color: isProfit ? palette.redDark : theme.colors.onSurface }]}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  heroImage: {
    height: 238,
    borderRadius: radius.xl,
    backgroundColor: palette.creamDeep
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start'
  },
  headerCopy: {
    flex: 1,
    minWidth: 0,
    paddingRight: spacing.md
  },
  title: {
    fontWeight: '900',
    letterSpacing: 0
  },
  editButton: {
    borderRadius: radius.md
  },
  metric: {
    borderRadius: radius.md,
    padding: spacing.md,
    minHeight: 78
  },
  metricLabel: {
    fontWeight: '800',
    letterSpacing: 0
  },
  metricValue: {
    fontWeight: '900',
    letterSpacing: 0,
    marginTop: 2
  },
  sectionHeading: {
    fontWeight: '900',
    letterSpacing: 0
  },
  actionRow: {
    flexDirection: 'row'
  },
  actionButton: {
    flex: 1,
    borderRadius: radius.lg
  },
  actionButtonLeft: {
    flex: 1,
    borderRadius: radius.lg,
    marginRight: spacing.md
  },
  actionButtonContent: {
    minHeight: 50
  },
  supplierName: {
    marginTop: spacing.sm,
    fontWeight: '700'
  },
  divider: {
    marginVertical: spacing.md
  },
  updatedAt: {
    marginTop: spacing.md
  },
  deleteButton: {
    borderRadius: radius.lg
  },
  deleteContent: {
    minHeight: 52
  }
});
