import React from 'react';
import { Dimensions, RefreshControl, View } from 'react-native';
import { LineChart, PieChart } from 'react-native-chart-kit';
import { AlertTriangle, DollarSign, PackageCheck, TrendingUp, Warehouse } from 'lucide-react-native';
import { Text, useTheme } from 'react-native-paper';
import { MetricCard } from '../../components/dashboard/MetricCard';
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton';
import { Screen } from '../../components/common/Screen';
import { useDashboardAnalytics } from '../../features/dashboard/useDashboard';
import { palette } from '../../theme/theme';
import { formatCurrency, formatNumber } from '../../utils/formatters';

export function DashboardScreen() {
  const theme = useTheme();
  const { data, isLoading, refetch, isRefetching } = useDashboardAnalytics();
  const width = Dimensions.get('window').width - 32;

  if (isLoading) {
    return (
      <Screen>
        <LoadingSkeleton rows={5} />
      </Screen>
    );
  }

  const summary = data?.summary;
  const salesLabels = data?.salesAnalytics?.map((item) => `${item._id.month}/${item._id.day}`).slice(-6) || [];
  const salesValues = data?.salesAnalytics?.map((item) => item.unitsSold).slice(-6) || [];
  const categoryData =
    data?.categoryDistribution?.map((item, index) => ({
      name: item._id,
      population: item.count,
      color: [palette.red, palette.black, palette.gold, palette.green, '#7F1D1D'][index % 5],
      legendFontColor: theme.colors.onSurface,
      legendFontSize: 12
    })) || [];

  return (
    <Screen refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={() => refetch()} />}>
      <View
        style={{
          backgroundColor: theme.colors.secondary,
          borderRadius: 28,
          padding: 22,
          marginBottom: 18
        }}
      >
        <Text variant="labelLarge" style={{ color: '#F5D8DC', fontWeight: '800' }}>
          Live command center
        </Text>
        <Text variant="headlineMedium" style={{ color: '#FFFFFF', fontWeight: '900', marginTop: 6 }}>
          Dashboard
        </Text>
        <Text variant="bodyMedium" style={{ color: '#F5D8DC', marginTop: 8, lineHeight: 22 }}>
          Inventory value, sales performance, low stock signals, and category mix in one view.
        </Text>
      </View>
      <View className="flex-row flex-wrap gap-3">
        <MetricCard label="Products" value={formatNumber(summary?.totalProducts || 0)} icon={PackageCheck} />
        <MetricCard label="Inventory Value" value={formatCurrency(summary?.totalInventoryValue || 0)} icon={Warehouse} accent={palette.black} />
        <MetricCard label="Sales Value" value={formatCurrency(summary?.totalSalesValue || 0)} icon={DollarSign} accent={palette.gold} />
        <MetricCard label="Profit" value={formatCurrency(summary?.totalProfit || 0)} icon={TrendingUp} accent={palette.green} />
        <MetricCard label="Stock Available" value={formatNumber(summary?.totalStockAvailable || 0)} icon={Warehouse} accent={palette.redDark} />
        <MetricCard label="Low Stock" value={formatNumber(summary?.lowStockProducts || 0)} icon={AlertTriangle} accent="#D21F3C" />
      </View>
      <Text variant="titleLarge" style={{ marginTop: 26, marginBottom: 12, color: theme.colors.onBackground, fontWeight: '900' }}>
        Sales Analytics
      </Text>
      <LineChart
        width={width}
        height={220}
        data={{
          labels: salesLabels.length ? salesLabels : ['No data'],
          datasets: [{ data: salesValues.length ? salesValues : [0] }]
        }}
        chartConfig={{
          backgroundGradientFrom: theme.dark ? '#1B1415' : '#FFFFFF',
          backgroundGradientTo: theme.dark ? '#1B1415' : '#FFFFFF',
          color: () => palette.red,
          labelColor: () => theme.colors.onSurfaceVariant,
          propsForDots: { r: '5', strokeWidth: '2', stroke: palette.redDark },
          decimalPlaces: 0
        }}
        bezier
        style={{ borderRadius: 20, borderWidth: 1, borderColor: theme.colors.outlineVariant }}
      />
      <Text variant="titleLarge" style={{ marginTop: 26, marginBottom: 12, color: theme.colors.onBackground, fontWeight: '900' }}>
        Category Distribution
      </Text>
      {categoryData.length ? (
        <PieChart
          data={categoryData}
          width={width}
          height={220}
          accessor="population"
          backgroundColor="transparent"
          paddingLeft="4"
          chartConfig={{
            color: () => theme.colors.primary,
            labelColor: () => theme.colors.onSurface
          }}
        />
      ) : (
        <Text variant="bodyMedium">Add products to populate category analytics.</Text>
      )}
    </Screen>
  );
}
