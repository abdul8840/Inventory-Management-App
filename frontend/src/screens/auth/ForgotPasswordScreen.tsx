import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Alert, StyleSheet } from 'react-native';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, HelperText, TextInput, useTheme } from 'react-native-paper';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { KeyRound } from 'lucide-react-native';
import { AppButton } from '../../components/common/AppButton';
import { HeroPanel, Stack, SurfacePanel, inputOutlineStyle, inputStyle, spacing } from '../../components/common/Layout';
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
    <Screen contentContainerStyle={styles.authContent}>
      <Stack gap={spacing.xl}>
        <HeroPanel
          eyebrow="Account recovery"
          title="Reset password"
          body="Firebase will send a secure reset link to your email address."
          icon={KeyRound}
        />
        <SurfacePanel>
          <Stack gap={spacing.md}>
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
                    style={inputStyle(theme)}
                    outlineStyle={inputOutlineStyle()}
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
            <Button labelStyle={styles.linkLabel} onPress={() => navigation.goBack()}>
              Back to sign in
            </Button>
          </Stack>
        </SurfacePanel>
      </Stack>
    </Screen>
  );
}

const styles = StyleSheet.create({
  authContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingTop: spacing.xxl,
    paddingBottom: spacing.xxl
  },
  linkLabel: {
    fontWeight: '800',
    letterSpacing: 0
  }
});
