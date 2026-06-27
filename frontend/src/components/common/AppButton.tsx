import React from 'react';
import { ActivityIndicator, Button, type ButtonProps, useTheme } from 'react-native-paper';
import { radius } from './Layout';

interface AppButtonProps extends ButtonProps {
  loading?: boolean;
}

export function AppButton({ loading, disabled, children, style, contentStyle, labelStyle, ...props }: AppButtonProps) {
  const theme = useTheme();

  return (
    <Button
      mode="contained"
      disabled={disabled || loading}
      buttonColor={theme.colors.primary}
      textColor={theme.colors.onPrimary}
      contentStyle={[{ minHeight: 56, paddingHorizontal: 8 }, contentStyle]}
      labelStyle={[{ fontWeight: '900', fontSize: 15, letterSpacing: 0 }, labelStyle]}
      style={[{ borderRadius: radius.lg }, style]}
      {...props}
    >
      {loading ? <ActivityIndicator color="#FFFFFF" size="small" /> : children}
    </Button>
  );
}
