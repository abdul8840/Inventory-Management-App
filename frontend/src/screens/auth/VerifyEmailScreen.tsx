import React, { useState } from 'react';
import { Alert, View } from 'react-native';
import { Button, Text, useTheme } from 'react-native-paper';
import { MailCheck } from 'lucide-react-native';
import { Screen } from '../../components/common/Screen';
import { resendVerificationEmail } from '../../services/firebaseAuth';

export function VerifyEmailScreen() {
  const [loading, setLoading] = useState(false);
  const theme = useTheme();

  const resend = async () => {
    setLoading(true);
    try {
      await resendVerificationEmail();
      Alert.alert('Verification sent', 'Please check your inbox.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
      <View
        style={{
          backgroundColor: theme.colors.surface,
          borderRadius: 28,
          borderWidth: 1,
          borderColor: theme.colors.outlineVariant,
          padding: 24
        }}
      >
        <View
          style={{
            width: 64,
            height: 64,
            borderRadius: 20,
            backgroundColor: theme.colors.primaryContainer,
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 18
          }}
        >
          <MailCheck color={theme.colors.primary} size={32} />
        </View>
        <Text variant="displaySmall" style={{ color: theme.colors.onSurface, fontWeight: '900' }}>
          Verify your email
        </Text>
        <Text variant="bodyLarge" style={{ color: theme.colors.onSurfaceVariant, marginTop: 12, marginBottom: 24, lineHeight: 24 }}>
          Confirm your email address to protect your inventory workspace.
        </Text>
        <Button mode="contained" contentStyle={{ minHeight: 52 }} labelStyle={{ fontWeight: '800' }} loading={loading} onPress={resend}>
          Resend Verification
        </Button>
      </View>
    </Screen>
  );
}
