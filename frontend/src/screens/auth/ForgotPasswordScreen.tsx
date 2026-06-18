import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Alert, View } from 'react-native';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, HelperText, Text, TextInput, useTheme } from 'react-native-paper';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { KeyRound } from 'lucide-react-native';
import { AppButton } from '../../components/common/AppButton';
import { paperIcon } from '../../components/common/PaperIcon';
import { Screen } from '../../components/common/Screen';
import { sendPasswordReset } from '../../services/firebaseAuth';
import type { AuthStackParamList } from '../../types/navigation';
import { forgotPasswordSchema, type ForgotPasswordValues } from '../../utils/validation';

type Props = NativeStackScreenProps<AuthStackParamList, 'ForgotPassword'>;

export function ForgotPasswordScreen({ navigation }: Props) {
  const [loading, setLoading] = useState(false);
  const theme = useTheme();
  const form = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' }
  });

  const onSubmit = async (values: ForgotPasswordValues) => {
    setLoading(true);
    try {
      await sendPasswordReset(values.email);
      Alert.alert('Reset email sent', 'Check your inbox for password reset instructions.');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
      <View
        style={{
          backgroundColor: theme.colors.secondary,
          borderRadius: 28,
          padding: 22,
          marginBottom: 22
        }}
      >
        <View
          style={{
            width: 52,
            height: 52,
            borderRadius: 16,
            backgroundColor: theme.colors.primary,
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 18
          }}
        >
          <KeyRound color="#FFFFFF" size={26} />
        </View>
        <Text variant="displaySmall" style={{ color: '#FFFFFF', fontWeight: '900' }}>
          Reset password
        </Text>
        <Text variant="bodyLarge" style={{ color: '#F5D8DC', marginTop: 8, lineHeight: 24 }}>
          Firebase will send a secure reset link to your email address.
        </Text>
      </View>
      <View
        className="gap-3"
        style={{
          backgroundColor: theme.colors.surface,
          borderRadius: 24,
          borderWidth: 1,
          borderColor: theme.colors.outlineVariant,
          padding: 18
        }}
      >
        <Controller
          control={form.control}
          name="email"
          render={({ field, fieldState }) => (
            <>
              <TextInput
                label="Email"
                mode="outlined"
                autoCapitalize="none"
                keyboardType="email-address"
                left={<TextInput.Icon icon={paperIcon('email-outline')} />}
                value={field.value}
                onBlur={field.onBlur}
                onChangeText={field.onChange}
              />
              <HelperText type="error" visible={Boolean(fieldState.error)}>
                {fieldState.error?.message}
              </HelperText>
            </>
          )}
        />
        <AppButton loading={loading} onPress={form.handleSubmit(onSubmit)}>
          Send Reset Link
        </AppButton>
        <Button onPress={() => navigation.goBack()}>Back to sign in</Button>
      </View>
    </Screen>
  );
}
