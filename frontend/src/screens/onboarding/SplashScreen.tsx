import React from 'react';
import { View } from 'react-native';
import { ActivityIndicator, Text, useTheme } from 'react-native-paper';
import { Boxes } from 'lucide-react-native';
import { palette } from '../../theme/theme';

export function SplashScreen() {
  const theme = useTheme();

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background, alignItems: 'center', justifyContent: 'center' }}>
      <View
        style={{
          width: 92,
          height: 92,
          borderRadius: 26,
          backgroundColor: palette.black,
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 20,
          borderWidth: 4,
          borderColor: theme.colors.primary
        }}
      >
        <Boxes color={palette.white} size={42} strokeWidth={1.8} />
      </View>
      <Text variant="headlineSmall" style={{ color: theme.colors.onBackground, fontWeight: '900' }}>
        Inventory Pro
      </Text>
      <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, marginTop: 6 }}>
        Premium stock control
      </Text>
      <ActivityIndicator style={{ marginTop: 24 }} />
    </View>
  );
}
