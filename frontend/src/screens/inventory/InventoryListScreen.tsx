import React, { useMemo, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { FAB, Searchbar, SegmentedButtons, Text, useTheme } from 'react-native-paper';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { EmptyState } from '../../components/common/EmptyState';
import { HeroPanel, SectionTitle, spacing } from '../../components/common/Layout';
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton';
import { paperIcon } from '../../components/common/PaperIcon';
import { ProductCard } from '../../components/inventory/ProductCard';
import { useProducts } from '../../features/inventory/useProducts';
import { useDebounce } from '../../hooks/useDebounce';
import type { InventoryStackParamList } from '../../types/navigation';
import type { ProductCategory } from '../../types/product';
import { PackageSearch } from 'lucide-react-native';

type Props = NativeStackScreenProps<InventoryStackParamList, 'InventoryList'>;

const quickFilters = [
  { value: 'all', label: 'All', showSelectedCheck: false },
  { value: 'low', label: 'Low', showSelectedCheck: false },
  { value: 'Electronics', label: 'Tech', showSelectedCheck: false },
  { value: 'Grocery', label: 'Grocery', showSelectedCheck: false }
];

export function InventoryListScreen({ navigation }: Props) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
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
  const fabBottom = Math.max(insets.bottom + spacing.lg, spacing.xxl);

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.background }]} edges={['top', 'left', 'right']}>
      <View style={styles.headerOuter}>
        <View style={styles.headerInner}>
          <HeroPanel
            eyebrow="Stock workspace"
            title="Inventory"
            body="Search, scan, filter, and update products fast."
            icon={PackageSearch}
            compact
          />
          <Searchbar
            placeholder="Search title, SKU, supplier, barcode"
            value={search}
            onChangeText={setSearch}
            icon={paperIcon('magnify')}
            clearIcon={paperIcon('close')}
            style={[styles.search, { backgroundColor: theme.colors.surface, borderColor: theme.colors.outlineVariant }]}
            inputStyle={styles.searchInput}
          />
          <SegmentedButtons
            value={filter}
            onValueChange={setFilter}
            buttons={quickFilters}
            density="small"
            style={[styles.filters, { backgroundColor: theme.colors.surface }]}
          />
        </View>
      </View>

      {products.isLoading ? (
        <View style={styles.loadingWrap}>
          <LoadingSkeleton rows={6} />
        </View>
      ) : (
        <FlatList
          data={products.data?.items || []}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContent}
          refreshing={products.isRefetching}
          onRefresh={products.refetch}
          ListHeaderComponent={
            <SectionTitle title="Products" value={`${products.data?.pagination.total || 0} total`} style={styles.listTitle} />
          }
          ListEmptyComponent={<EmptyState title="No products found" message="Add a product or change your filters." />}
          renderItem={({ item }) => <ProductCard product={item} onPress={() => navigation.navigate('ProductDetails', { productId: item._id })} />}
        />
      )}

      <FAB
        icon={paperIcon('barcode-scan')}
        color={theme.colors.primary}
        style={[styles.scanFab, { bottom: fabBottom, backgroundColor: theme.colors.surface }]}
        onPress={() => navigation.navigate('BarcodeScanner')}
      />
      <FAB
        icon={paperIcon('plus')}
        color="#FFFFFF"
        style={[styles.addFab, { bottom: fabBottom, backgroundColor: theme.colors.primary }]}
        onPress={() => navigation.navigate('ProductForm')}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1
  },
  headerOuter: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    paddingBottom: spacing.md
  },
  headerInner: {
    width: '100%',
    maxWidth: 560,
    alignSelf: 'center'
  },
  search: {
    marginTop: spacing.md,
    borderWidth: 1,
    borderRadius: 18
  },
  searchInput: {
    fontSize: 14,
    letterSpacing: 0
  },
  filters: {
    marginTop: spacing.md,
    borderRadius: 14
  },
  loadingWrap: {
    flex: 1,
    width: '100%',
    maxWidth: 560,
    alignSelf: 'center',
    padding: spacing.xl
  },
  listContent: {
    width: '100%',
    maxWidth: 560,
    alignSelf: 'center',
    paddingHorizontal: spacing.xl,
    paddingBottom: 116
  },
  listTitle: {
    marginTop: spacing.sm
  },
  scanFab: {
    position: 'absolute',
    right: 88
  },
  addFab: {
    position: 'absolute',
    right: spacing.xl
  }
});
