import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { Button, Text, useTheme } from 'react-native-paper';
import { UserCircle } from 'lucide-react-native';
import { HeroPanel, Stack, SurfacePanel, radius, spacing } from '../../components/common/Layout';
import { Screen } from '../../components/common/Screen';
import { logout } from '../../features/auth/authSlice';
import { useAppDispatch, useAppSelector } from '../../hooks/useStore';
import { resendVerificationEmail } from '../../services/firebaseAuth';

export function ProfileScreen() {
  const user = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const initial = user?.name?.slice(0, 1).toUpperCase() || 'U';

  return (
    <Screen>
      <Stack gap={spacing.lg}>
        <HeroPanel eyebrow="Account center" title="Profile" body="Manage your identity and workspace session." icon={UserCircle} compact />
        <SurfacePanel>
          <View style={styles.profileRow}>
            {user?.profileImage ? (
              <Image source={{ uri: user.profileImage }} style={styles.avatar} />
            ) : (
              <View style={[styles.avatarFallback, { backgroundColor: theme.colors.primaryContainer }]}>
                <Text variant="headlineSmall" style={[styles.avatarText, { color: theme.colors.primary }]}>{initial}</Text>
              </View>
            )}
            <View style={styles.profileCopy}>
              <Text variant="titleLarge" numberOfLines={1} style={[styles.name, { color: theme.colors.onSurface }]}>
                {user?.name}
              </Text>
              <Text variant="bodyMedium" numberOfLines={1} style={{ color: theme.colors.onSurfaceVariant }}>
                {user?.email}
              </Text>
              <Text variant="labelLarge" style={[styles.role, { color: theme.colors.primary }]}>
                {user?.role}
              </Text>
            </View>
          </View>
        </SurfacePanel>
        {!user?.emailVerified ? (
          <SurfacePanel style={{ backgroundColor: theme.colors.errorContainer, borderColor: theme.colors.error }}>
            <Text variant="titleMedium" style={[styles.name, { color: theme.colors.onErrorContainer }]}>Email verification pending</Text>
            <Text variant="bodyMedium" style={[styles.verificationText, { color: theme.colors.onErrorContainer }]}>Verify your email to secure account recovery and future admin capabilities.</Text>
            <Button mode="contained" style={styles.verificationButton} onPress={resendVerificationEmail}>
              Resend Verification
            </Button>
          </SurfacePanel>
        ) : null}
        <Button mode="outlined" contentStyle={styles.logoutContent} style={styles.logoutButton} onPress={() => dispatch(logout())}>
          Logout
        </Button>
      </Stack>
    </Screen>
  );
}

const styles = StyleSheet.create({
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  avatar: {
    width: 76,
    height: 76,
    borderRadius: 38,
    marginRight: spacing.lg
  },
  avatarFallback: {
    width: 76,
    height: 76,
    borderRadius: 38,
    marginRight: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center'
  },
  avatarText: {
    fontWeight: '900',
    letterSpacing: 0
  },
  profileCopy: {
    flex: 1,
    minWidth: 0
  },
  name: {
    fontWeight: '900',
    letterSpacing: 0
  },
  role: {
    marginTop: spacing.xs,
    textTransform: 'capitalize',
    fontWeight: '900',
    letterSpacing: 0
  },
  verificationText: {
    marginTop: spacing.sm,
    lineHeight: 22
  },
  verificationButton: {
    marginTop: spacing.md,
    borderRadius: radius.lg
  },
  logoutButton: {
    borderRadius: radius.lg
  },
  logoutContent: {
    minHeight: 54
  }
});
