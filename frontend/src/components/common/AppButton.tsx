import React from 'react';
import { ActivityIndicator, Button, type ButtonProps, useTheme } from 'react-native-paper';

interface AppButtonProps extends ButtonProps {
  loading?: boolean;
}

export function AppButton({ loading, disabled, children, style, ...props }: AppButtonProps) {
  const theme = useTheme();

  return (
    <Button
      mode="contained"
      disabled={disabled || loading}
      buttonColor={theme.colors.primary}
      textColor={theme.colors.onPrimary}
      contentStyle={{ minHeight: 52 }}
      labelStyle={{ fontWeight: '800' }}
      style={[{ borderRadius: 10 }, style]}
      {...props}
    >
      {loading ? <ActivityIndicator color="#FFFFFF" size="small" /> : children}
    </Button>
  );
}
