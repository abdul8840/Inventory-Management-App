import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTheme } from 'react-native-paper';
import type { InventoryStackParamList } from '../types/navigation';
import { BarcodeScannerScreen } from '../screens/inventory/BarcodeScannerScreen';
import { InventoryListScreen } from '../screens/inventory/InventoryListScreen';
import { ProductDetailsScreen } from '../screens/inventory/ProductDetailsScreen';
import { ProductFormScreen } from '../screens/inventory/ProductFormScreen';

const Stack = createNativeStackNavigator<InventoryStackParamList>();

export function InventoryNavigator() {
  const theme = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: theme.colors.background },
        headerShadowVisible: false,
        headerTintColor: theme.colors.onBackground,
        headerTitleStyle: { fontWeight: '800' },
        contentStyle: { backgroundColor: theme.colors.background }
      }}
    >
      <Stack.Screen name="InventoryList" component={InventoryListScreen} options={{ title: 'Inventory' }} />
      <Stack.Screen name="ProductDetails" component={ProductDetailsScreen} options={{ title: 'Product Details' }} />
      <Stack.Screen name="ProductForm" component={ProductFormScreen} options={{ title: 'Product' }} />
      <Stack.Screen name="BarcodeScanner" component={BarcodeScannerScreen} options={{ title: 'Scan Barcode' }} />
    </Stack.Navigator>
  );
}
