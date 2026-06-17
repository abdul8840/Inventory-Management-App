import React from 'react';
import { Image, View } from 'react-native';
import { Button, Card, Text, useTheme } from 'react-native-paper';
import { Screen } from '../../components/common/Screen';
import { logout } from '../../features/auth/authSlice';
import { useAppDispatch, useAppSelector } from '../../hooks/useStore';
import { resendVerificationEmail } from '../../services/firebaseAuth';

export function ProfileScreen() {
  const user = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch();
  const theme = useTheme();

  return (
    <Screen>
      <View style={{ backgroundColor: theme.colors.secondary, borderRadius: 24, padding: 18 }}>
        <Text variant="labelLarge" style={{ color: '#F5D8DC', fontWeight: '800' }}>
          Account center
        </Text>
        <Text variant="headlineSmall" style={{ color: '#FFFFFF', fontWeight: '900', marginTop: 4 }}>
          Profile
        </Text>
      </View>
      <Card mode="contained" style={{ marginTop: 16, backgroundColor: theme.colors.surface, borderWidth: 1, borderColor: theme.colors.outlineVariant }}>
        <Card.Content style={{ padding: 16 }}>
          <View className="flex-row items-center gap-4">
            {user?.profileImage ? (
              <Image source={{ uri: user.profileImage }} style={{ width: 72, height: 72, borderRadius: 36 }} />
            ) : (
              <View
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: 36,
                  backgroundColor: theme.colors.primaryContainer,
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Text variant="headlineSmall" style={{ color: theme.colors.primary, fontWeight: '900' }}>{user?.name?.slice(0, 1).toUpperCase()}</Text>
              </View>
            )}
            <View className="flex-1">
              <Text variant="titleLarge" style={{ fontWeight: '800' }}>
                {user?.name}
              </Text>
              <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                {user?.email}
              </Text>
              <Text variant="labelLarge" style={{ color: theme.colors.primary, marginTop: 4 }}>
                {user?.role}
              </Text>
            </View>
          </View>
        </Card.Content>
      </Card>
      {!user?.emailVerified ? (
        <Card mode="contained" style={{ marginTop: 16, backgroundColor: theme.colors.errorContainer }}>
          <Card.Content>
            <Text variant="titleMedium" style={{ fontWeight: '700' }}>
              Email verification pending
            </Text>
            <Text variant="bodyMedium" style={{ marginTop: 6 }}>
              Verify your email to secure account recovery and future admin capabilities.
            </Text>
            <Button mode="contained" style={{ marginTop: 12 }} onPress={resendVerificationEmail}>
              Resend Verification
            </Button>
          </Card.Content>
        </Card>
      ) : null}
      <Button mode="outlined" contentStyle={{ minHeight: 50 }} style={{ marginTop: 24 }} onPress={() => dispatch(logout())}>
        Logout
      </Button>
    </Screen>
  );
}
