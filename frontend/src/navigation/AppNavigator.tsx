import React from 'react';
import { StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Bell, LayoutDashboard, Package, Settings, UserCircle } from 'lucide-react-native';
import { useTheme } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { AppTabParamList } from '../types/navigation';
import { DashboardScreen } from '../screens/dashboard/DashboardScreen';
import { NotificationsScreen } from '../screens/profile/NotificationsScreen';
import { ProfileScreen } from '../screens/profile/ProfileScreen';
import { SettingsScreen } from '../screens/settings/SettingsScreen';
import { InventoryNavigator } from './InventoryNavigator';

const Tab = createBottomTabNavigator<AppTabParamList>();

export function AppNavigator() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const bottomPadding = Math.max(insets.bottom, 10);

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.onSurfaceVariant,
        tabBarLabelStyle: styles.label,
        tabBarItemStyle: styles.item,
        tabBarStyle: {
          height: 62 + bottomPadding,
          paddingBottom: bottomPadding,
          paddingTop: 8,
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.outlineVariant,
          borderTopWidth: 1,
          elevation: 12,
          shadowColor: '#080607',
          shadowOpacity: theme.dark ? 0 : 0.08,
          shadowRadius: 18,
          shadowOffset: { width: 0, height: -8 }
        }
      }}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} options={{ tabBarIcon: ({ color, size }) => <LayoutDashboard color={color} size={size} /> }} />
      <Tab.Screen name="Inventory" component={InventoryNavigator} options={{ tabBarIcon: ({ color, size }) => <Package color={color} size={size} /> }} />
      <Tab.Screen name="Notifications" component={NotificationsScreen} options={{ tabBarIcon: ({ color, size }) => <Bell color={color} size={size} /> }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ tabBarIcon: ({ color, size }) => <UserCircle color={color} size={size} /> }} />
      <Tab.Screen name="Settings" component={SettingsScreen} options={{ tabBarIcon: ({ color, size }) => <Settings color={color} size={size} /> }} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0
  },
  item: {
    paddingTop: 2
  }
});
