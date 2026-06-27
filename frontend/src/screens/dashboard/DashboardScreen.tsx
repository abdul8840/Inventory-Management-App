import React from 'react';
import { RefreshControl, StyleSheet, useWindowDimensions } from 'react-native';
import { LineChart, PieChart } from 'react-native-chart-kit';
import { AlertTriangle, BarChart3, DollarSign, PackageCheck, TrendingUp, Warehouse } from 'lucide-react-native';
import { Text, useTheme } from 'react-native-paper';
import { MetricCard } from '../../components/dashboard/MetricCard';
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton';
import { HeroPanel, ResponsiveGrid, SectionTitle, Stack, SurfacePanel, spacing } from '../../components/common/Layout';
import { Screen } from '../../components/common/Screen';
import { useDashboardAnalytics } from '../../features/dashboard/useDashboard';
import { palette } from '../../theme/theme';
import { formatCurrency, formatNumber } from '../../utils/formatters';

export function DashboardScreen() {
  const theme = useTheme();
  const { width } = useWindowDimensions();
  const { data, isLoading, refetch, isRefetching } = useDashboardAnalytics();
  const chartWidth = Math.min(width - spacing.xl * 2 - spacing.lg * 2, 520 - spacing.lg * 2);

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
    <Screen refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={() => refetch()} tintColor={theme.colors.primary} />}>
      <Stack gap={spacing.lg}>
        <HeroPanel
          eyebrow="Live command center"
          title="Dashboard"
          body="Inventory value, sales performance, low stock signals, and category mix in one premium view."
          icon={BarChart3}
          compact
        />
        <ResponsiveGrid gap={spacing.md} minItemWidth={156}>
          <MetricCard label="Products" value={formatNumber(summary?.totalProducts || 0)} icon={PackageCheck} />
          <MetricCard label="Inventory Value" value={formatCurrency(summary?.totalInventoryValue || 0)} icon={Warehouse} accent={palette.black} />
          <MetricCard label="Sales Value" value={formatCurrency(summary?.totalSalesValue || 0)} icon={DollarSign} accent={palette.gold} />
          <MetricCard label="Profit" value={formatCurrency(summary?.totalProfit || 0)} icon={TrendingUp} accent={palette.green} />
          <MetricCard label="Stock Available" value={formatNumber(summary?.totalStockAvailable || 0)} icon={Warehouse} accent={palette.redDark} />
          <MetricCard label="Low Stock" value={formatNumber(summary?.lowStockProducts || 0)} icon={AlertTriangle} accent="#D21F3C" />
        </ResponsiveGrid>
      </Stack>

      <SectionTitle title="Sales Analytics" />
      <SurfacePanel contentStyle={styles.chartPanel}>
        <LineChart
          width={chartWidth}
          height={220}
          data={{
            labels: salesLabels.length ? salesLabels : ['No data'],
            datasets: [{ data: salesValues.length ? salesValues : [0] }]
          }}
          chartConfig={{
            backgroundGradientFrom: theme.colors.surface,
            backgroundGradientTo: theme.colors.surface,
            color: () => palette.red,
            labelColor: () => theme.colors.onSurfaceVariant,
            propsForDots: { r: '5', strokeWidth: '2', stroke: palette.redDark },
            decimalPlaces: 0
          }}
          bezier
          style={styles.chart}
        />
      </SurfacePanel>

      <SectionTitle title="Category Distribution" />
      <SurfacePanel contentStyle={styles.chartPanel}>
        {categoryData.length ? (
          <PieChart
            data={categoryData}
            width={chartWidth}
            height={220}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="2"
            chartConfig={{
              color: () => theme.colors.primary,
              labelColor: () => theme.colors.onSurface
            }}
          />
        ) : (
          <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
            Add products to populate category analytics.
          </Text>
        )}
      </SurfacePanel>
    </Screen>
  );
}

const styles = StyleSheet.create({
  chartPanel: {
    alignItems: 'center',
    overflow: 'hidden'
  },
  chart: {
    borderRadius: 18
  }
});
