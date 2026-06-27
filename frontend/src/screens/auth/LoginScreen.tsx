import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { StyleSheet } from 'react-native';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, HelperText, TextInput, useTheme } from 'react-native-paper';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { LogIn } from 'lucide-react-native';
import { AppButton } from '../../components/common/AppButton';
import { HeroPanel, Stack, SurfacePanel, inputOutlineStyle, inputStyle, radius, spacing } from '../../components/common/Layout';
import { paperIcon } from '../../components/common/PaperIcon';
import { Screen } from '../../components/common/Screen';
import { signInWithEmail, signInWithGoogle } from '../../features/auth/authSlice';
import { useAppDispatch, useAppSelector } from '../../hooks/useStore';
import type { AuthStackParamList } from '../../types/navigation';
import { loginSchema, type LoginValues } from '../../utils/validation';

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

export function LoginScreen({ navigation }: Props) {
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const { status, error } = useAppSelector((state) => state.auth);
  const loading = status === 'loading';
  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' }
  });

  const onSubmit = (values: LoginValues) => dispatch(signInWithEmail(values));

  return (
    <Screen contentContainerStyle={styles.authContent}>
      <Stack gap={spacing.xl}>
        <HeroPanel
          eyebrow="Private inventory"
          title="Welcome back"
          body="Sign in to control stock, sales, alerts, and reports from your secure workspace."
          icon={LogIn}
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
            <AppButton loading={loading} onPress={form.handleSubmit(onSubmit)}>
              Sign In
            </AppButton>
            <Button
              mode="outlined"
              icon={paperIcon('google')}
              contentStyle={styles.secondaryButtonContent}
              labelStyle={styles.secondaryButtonLabel}
              style={styles.secondaryButton}
              onPress={() => dispatch(signInWithGoogle())}
              disabled={loading}
            >
              Continue with Google
            </Button>
            <Button labelStyle={styles.linkLabel} onPress={() => navigation.navigate('ForgotPassword')}>
              Forgot password?
            </Button>
            <Button labelStyle={styles.linkLabel} onPress={() => navigation.navigate('Register')}>
              Create account
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
  secondaryButton: {
    borderRadius: radius.lg
  },
  secondaryButtonContent: {
    minHeight: 54
  },
  secondaryButtonLabel: {
    fontWeight: '900',
    letterSpacing: 0
  },
  linkLabel: {
    fontWeight: '800',
    letterSpacing: 0
  }
});
