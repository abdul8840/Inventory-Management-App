import React, { useMemo, useState } from 'react';
import { FlatList, View } from 'react-native';
import { FAB, Searchbar, SegmentedButtons, Text, useTheme } from 'react-native-paper';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { EmptyState } from '../../components/common/EmptyState';
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton';
import { paperIcon } from '../../components/common/PaperIcon';
import { ProductCard } from '../../components/inventory/ProductCard';
import { useProducts } from '../../features/inventory/useProducts';
import { useDebounce } from '../../hooks/useDebounce';
import type { InventoryStackParamList } from '../../types/navigation';
import type { ProductCategory } from '../../types/product';

type Props = NativeStackScreenProps<InventoryStackParamList, 'InventoryList'>;

const quickFilters = [
  { value: 'all', label: 'All', showSelectedCheck: false },
  { value: 'low', label: 'Low', showSelectedCheck: false },
  { value: 'Electronics', label: 'Tech', showSelectedCheck: false },
  { value: 'Grocery', label: 'Grocery', showSelectedCheck: false }
];

export function InventoryListScreen({ navigation }: Props) {
  const theme = useTheme();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const debouncedSearch = useDebounce(search);
  const query = useMemo(
    () => ({
      page: 1,
      limit: 30,
      search: debouncedSearch || undefined,
      lowStock: filter === 'low' ? true : undefined,
      category: filter !== 'all' && filter !== 'low' ? (filter as ProductCategory) : undefined,
      sortBy: 'updatedAt' as const,
      sortOrder: 'desc' as const
    }),
    [debouncedSearch, filter]
  );
  const products = useProducts(query);

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <View className="gap-3 px-4 pb-3 pt-3">
        <View
          style={{
            backgroundColor: theme.colors.secondary,
            borderRadius: 24,
            padding: 18
          }}
        >
          <Text variant="labelLarge" style={{ color: '#F5D8DC', fontWeight: '800' }}>
            Stock workspace
          </Text>
          <Text variant="headlineSmall" style={{ color: '#FFFFFF', fontWeight: '900', marginTop: 4 }}>
            Inventory
          </Text>
          <Text variant="bodyMedium" style={{ color: '#F5D8DC', marginTop: 6 }}>
            Search, scan, filter, and update products fast.
          </Text>
        </View>
        <Searchbar
          placeholder="Search title, SKU, supplier, barcode"
          value={search}
          onChangeText={setSearch}
          icon={paperIcon('magnify')}
          clearIcon={paperIcon('close')}
          style={{ backgroundColor: theme.colors.surface, borderWidth: 1, borderColor: theme.colors.outlineVariant }}
          inputStyle={{ fontSize: 14 }}
        />
        <SegmentedButtons
          value={filter}
          onValueChange={setFilter}
          buttons={quickFilters}
          style={{ backgroundColor: theme.colors.surface, borderRadius: 12 }}
        />
      </View>
      {products.isLoading ? (
        <View className="p-4">
          <LoadingSkeleton rows={6} />
        </View>
      ) : (
        <FlatList
          data={products.data?.items || []}
          keyExtractor={(item) => item._id}
          contentContainerStyle={{ padding: 16, paddingBottom: 96 }}
          refreshing={products.isRefetching}
          onRefresh={products.refetch}
          ListHeaderComponent={
            <View className="mb-3 flex-row items-center justify-between">
              <Text variant="titleMedium" style={{ color: theme.colors.onBackground, fontWeight: '900' }}>
                Products
              </Text>
              <Text variant="labelLarge" style={{ color: theme.colors.onSurfaceVariant }}>
                {products.data?.pagination.total || 0} total
              </Text>
            </View>
          }
          ListEmptyComponent={<EmptyState title="No products found" message="Add a product or change your filters." />}
          renderItem={({ item }) => <ProductCard product={item} onPress={() => navigation.navigate('ProductDetails', { productId: item._id })} />}
        />
      )}
      <FAB
        icon={paperIcon('barcode-scan')}
        color={theme.colors.primary}
        style={{ position: 'absolute', right: 88, bottom: 24, backgroundColor: theme.colors.surface }}
        onPress={() => navigation.navigate('BarcodeScanner')}
      />
      <FAB icon={paperIcon('plus')} color="#FFFFFF" style={{ position: 'absolute', right: 24, bottom: 24, backgroundColor: theme.colors.primary }} onPress={() => navigation.navigate('ProductForm')} />
    </View>
  );
}
