import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { View } from 'react-native';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, HelperText, Text, TextInput, useTheme } from 'react-native-paper';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { UserPlus } from 'lucide-react-native';
import { AppButton } from '../../components/common/AppButton';
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
          <UserPlus color="#FFFFFF" size={26} />
        </View>
        <Text variant="displaySmall" style={{ color: '#FFFFFF', fontWeight: '900' }}>
          Create account
        </Text>
        <Text variant="bodyLarge" style={{ color: '#F5D8DC', marginTop: 8, lineHeight: 24 }}>
          Secure your SaaS inventory workspace with Firebase authentication.
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
        <Button onPress={() => navigation.goBack()}>Already have an account?</Button>
      </View>
    </Screen>
  );
}
