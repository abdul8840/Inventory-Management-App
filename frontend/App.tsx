import React, { useEffect } from 'react';
import { StatusBar, useColorScheme } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Provider as PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider as ReduxProvider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { RootNavigator } from './src/navigation/RootNavigator';
import { persister, queryClient } from './src/api/queryClient';
import { store } from './src/store/store';
import { useAppDispatch, useAppSelector } from './src/hooks/useStore';
import { bootstrapAuth } from './src/features/auth/authSlice';
import { configureOnlineManager } from './src/api/onlineManager';
import { buildNavigationTheme, buildPaperTheme } from './src/theme/theme';

function AppShell() {
  const dispatch = useAppDispatch();
  const colorScheme = useColorScheme();
  const themeMode = useAppSelector((state) => state.preferences.themeMode);
  const isDark = themeMode === 'system' ? colorScheme === 'dark' : themeMode === 'dark';
  const paperTheme = buildPaperTheme(isDark);
  const navigationTheme = buildNavigationTheme(isDark);

  useEffect(() => {
    configureOnlineManager();
    dispatch(bootstrapAuth());
  }, [dispatch]);

  return (
    <PaperProvider theme={paperTheme}>
      <NavigationContainer theme={navigationTheme}>
        <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={paperTheme.colors.background} />
        <RootNavigator />
      </NavigationContainer>
    </PaperProvider>
  );
}

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ReduxProvider store={store}>
          <PersistQueryClientProvider client={queryClient} persistOptions={{ persister, maxAge: 1000 * 60 * 60 * 24 }}>
            <AppShell />
          </PersistQueryClientProvider>
        </ReduxProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
