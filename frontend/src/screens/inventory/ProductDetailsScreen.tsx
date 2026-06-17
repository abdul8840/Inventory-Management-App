import React, { useState } from 'react';
import { Alert, Image, View } from 'react-native';
import { Button, Card, Divider, Text, TextInput, useTheme } from 'react-native-paper';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton';
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
      {image ? <Image source={{ uri: image.url }} style={{ height: 230, borderRadius: 24, marginBottom: 16 }} /> : null}
      <View
        className="flex-row items-start justify-between gap-3"
        style={{
          backgroundColor: theme.colors.surface,
          borderRadius: 22,
          borderWidth: 1,
          borderColor: theme.colors.outlineVariant,
          padding: 16
        }}
      >
        <View className="flex-1">
          <Text variant="headlineSmall" style={{ color: theme.colors.onSurface, fontWeight: '900' }}>
            {product.title}
          </Text>
          <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
            {product.category} / SKU {product.sku}
          </Text>
        </View>
        <Button mode="outlined" onPress={() => navigation.navigate('ProductForm', { productId })}>
          Edit
        </Button>
      </View>
      <Card mode="contained" style={{ marginTop: 18, backgroundColor: theme.colors.surface, borderWidth: 1, borderColor: theme.colors.outlineVariant }}>
        <Card.Content style={{ padding: 16 }}>
          <View className="flex-row flex-wrap gap-4">
            <Metric label="Available" value={formatNumber(product.stockAvailable)} />
            <Metric label="Sold" value={formatNumber(product.stockSold)} />
            <Metric label="Total Stock" value={formatNumber(product.totalStock)} />
            <Metric label="Profit" value={formatCurrency(product.profitAmount)} />
            <Metric label="Margin" value={`${product.profitMargin.toFixed(1)}%`} />
            <Metric label="Sales Value" value={formatCurrency(product.totalSalesValue)} />
          </View>
        </Card.Content>
      </Card>
      <Card mode="contained" style={{ marginTop: 16 }}>
        <Card.Content style={{ padding: 16 }}>
          <Text variant="titleMedium" style={{ color: theme.colors.onSurface, fontWeight: '900' }}>
            Stock Adjustment
          </Text>
          <TextInput
            label="Quantity"
            mode="outlined"
            keyboardType="number-pad"
            value={quantity}
            onChangeText={setQuantity}
            style={{ marginTop: 12 }}
          />
          <View className="mt-3 flex-row gap-3">
            <Button mode="contained" contentStyle={{ minHeight: 48 }} onPress={() => adjust('record_sale')} loading={adjustStock.isPending}>
              Record Sale
            </Button>
            <Button mode="outlined" contentStyle={{ minHeight: 48 }} onPress={() => adjust('restock')} loading={adjustStock.isPending}>
              Restock
            </Button>
          </View>
        </Card.Content>
      </Card>
      <Card mode="contained" style={{ marginTop: 16, backgroundColor: theme.colors.surface, borderWidth: 1, borderColor: theme.colors.outlineVariant }}>
        <Card.Content style={{ padding: 16 }}>
          <Text variant="titleMedium" style={{ color: theme.colors.onSurface, fontWeight: '900' }}>
            Supplier
          </Text>
          <Text variant="bodyMedium" style={{ marginTop: 8 }}>
            {product.supplierName || 'No supplier name'}
          </Text>
          <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
            {product.supplierContact || 'No supplier contact'}
          </Text>
          <Divider style={{ marginVertical: 12 }} />
          <Text variant="bodyMedium">{product.description || 'No description'}</Text>
          <Text variant="bodySmall" style={{ marginTop: 12, color: theme.colors.onSurfaceVariant }}>
            Updated {formatDate(product.updatedAt)}
          </Text>
        </Card.Content>
      </Card>
      <Button mode="outlined" textColor={theme.colors.error} style={{ marginTop: 18 }} onPress={confirmDelete}>
        Delete Product
      </Button>
    </Screen>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  const theme = useTheme();

  return (
    <View style={{ width: '46%', borderRadius: 14, backgroundColor: label === 'Profit' ? palette.redSoft : theme.colors.surfaceVariant, padding: 10 }}>
      <Text variant="labelMedium" style={{ color: label === 'Profit' ? palette.redDark : theme.colors.onSurfaceVariant, fontWeight: '800' }}>
        {label}
      </Text>
      <Text variant="titleMedium" numberOfLines={1} adjustsFontSizeToFit style={{ color: label === 'Profit' ? palette.redDark : theme.colors.onSurface, fontWeight: '900', marginTop: 2 }}>
        {value}
      </Text>
    </View>
  );
}
