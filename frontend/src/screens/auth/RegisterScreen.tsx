import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { StyleSheet } from 'react-native';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, HelperText, TextInput, useTheme } from 'react-native-paper';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { UserPlus } from 'lucide-react-native';
import { AppButton } from '../../components/common/AppButton';
import { HeroPanel, Stack, SurfacePanel, inputOutlineStyle, inputStyle, radius, spacing } from '../../components/common/Layout';
import { paperIcon } from '../../components/common/PaperIcon';
import { Screen } from '../../components/common/Screen';
import { signUpWithEmail } from '../../features/auth/authSlice';
import { useAppDispatch, useAppSelector } from '../../hooks/useStore';
import type { AuthStackParamList } from '../../types/navigation';
import { registerSchema, type RegisterValues } from '../../utils/validation';

type Props = NativeStackScreenProps<AuthStackParamList, 'Register'>;

export function RegisterScreen({ navigation }: Props) {
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const { status, error } = useAppSelector((state) => state.auth);
  const loading = status === 'loading';
  const form = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: '', email: '', password: '' }
  });

  return (
    <Screen contentContainerStyle={styles.authContent}>
      <Stack gap={spacing.xl}>
        <HeroPanel
          eyebrow="New workspace"
          title="Create account"
          body="Secure your SaaS inventory workspace with Firebase authentication and private data ownership."
          icon={UserPlus}
        />
        <SurfacePanel>
          <Stack gap={spacing.md}>
            <Controller
              control={form.control}
              name="name"
              render={({ field, fieldState }) => (
                <>
                  <TextInput
                    label="Full name"
                    mode="outlined"
                    left={<TextInput.Icon icon={paperIcon('account-outline')} />}
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
            <Controller
              control={form.control}
              name="password"
              render={({ field, fieldState }) => (
                <>
                  <TextInput
                    label="Password"
                    mode="outlined"
                    secureTextEntry
                    left={<TextInput.Icon icon={paperIcon('lock-outline')} />}
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
            {error ? <HelperText type="error" visible>{error}</HelperText> : null}
            <AppButton loading={loading} onPress={form.handleSubmit((values) => dispatch(signUpWithEmail(values)))}>
              Register
            </AppButton>
            <Button labelStyle={styles.linkLabel} onPress={() => navigation.goBack()}>
              Already have an account?
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
  },
  secondaryButton: {
    borderRadius: radius.lg
  }
});
