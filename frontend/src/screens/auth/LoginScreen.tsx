import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { View } from 'react-native';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, HelperText, Text, TextInput, useTheme } from 'react-native-paper';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { LogIn } from 'lucide-react-native';
import { AppButton } from '../../components/common/AppButton';
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
          <LogIn color="#FFFFFF" size={26} />
        </View>
        <Text variant="displaySmall" style={{ color: '#FFFFFF', fontWeight: '900' }}>
          Welcome back
        </Text>
        <Text variant="bodyLarge" style={{ color: '#F5D8DC', marginTop: 8, lineHeight: 24 }}>
          Sign in to control stock, sales, alerts, and reports from your private workspace.
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
                left={<TextInput.Icon icon="email-outline" />}
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
        <Controller
          control={form.control}
          name="password"
          render={({ field, fieldState }) => (
            <>
              <TextInput
                label="Password"
                mode="outlined"
                secureTextEntry
                left={<TextInput.Icon icon="lock-outline" />}
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
        {error ? <HelperText type="error" visible>{error}</HelperText> : null}
        <AppButton loading={loading} onPress={form.handleSubmit(onSubmit)}>
          Sign In
        </AppButton>
        <Button mode="outlined" icon="google" contentStyle={{ minHeight: 50 }} onPress={() => dispatch(signInWithGoogle())} disabled={loading}>
          Continue with Google
        </Button>
        <Button onPress={() => navigation.navigate('ForgotPassword')}>Forgot password?</Button>
        <Button onPress={() => navigation.navigate('Register')}>Create account</Button>
      </View>
    </Screen>
  );
}
