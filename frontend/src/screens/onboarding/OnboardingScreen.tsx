import React, { useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { Button, Text, useTheme } from 'react-native-paper';
import { BarChart3, BellRing, Boxes } from 'lucide-react-native';
import { Screen } from '../../components/common/Screen';
import { radius, spacing } from '../../components/common/Layout';
import { useAppDispatch } from '../../hooks/useStore';
import { completeOnboarding } from '../../store/preferencesSlice';
import { palette } from '../../theme/theme';

const slides = [
  {
    title: 'Control every product movement',
    body: 'Track stock, sales, supplier notes, images, and audit logs from one mobile workspace.',
    icon: Boxes
  },
  {
    title: 'See profit clearly',
    body: 'Dashboard analytics calculate inventory value, sales value, profit, and category distribution automatically.',
    icon: BarChart3
  },
  {
    title: 'Act before stock runs out',
    body: 'Low stock thresholds, push-ready notifications, and history logs keep operations steady.',
    icon: BellRing
  }
];

export function OnboardingScreen() {
  const [index, setIndex] = useState(0);
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const slide = slides[index];
  const Icon = slide.icon;
  const fade = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    fade.setValue(0);
    Animated.timing(fade, {
      toValue: 1,
      duration: 280,
      useNativeDriver: true
    }).start();
  }, [fade, index]);

  const next = () => {
    if (index === slides.length - 1) {
      dispatch(completeOnboarding());
      return;
    }
    setIndex((current) => current + 1);
  };

  return (
    <Screen scroll={false} contentStyle={styles.screenContent}>
      <View style={styles.content}>
        <Animated.View style={[styles.copyBlock, { opacity: fade, transform: [{ translateY: fade.interpolate({ inputRange: [0, 1], outputRange: [10, 0] }) }] }]}>
          <View style={[styles.pill, { backgroundColor: theme.colors.primaryContainer }]}>
            <Text variant="labelLarge" style={[styles.pillText, { color: theme.colors.primary }]}>Inventory Pro</Text>
          </View>
          <Text variant="displaySmall" style={[styles.title, { color: theme.colors.onBackground }]}>
            {slide.title}
          </Text>
          <Text variant="bodyLarge" style={[styles.body, { color: theme.colors.onSurfaceVariant }]}>
            {slide.body}
          </Text>
        </Animated.View>
        <View style={[styles.visualCard, { backgroundColor: theme.dark ? palette.redDark : palette.black, borderColor: theme.dark ? '#55202A' : palette.black }]}>
          <View style={[styles.iconFrame, { backgroundColor: theme.colors.primary }]}>
            <Icon size={64} color={palette.white} strokeWidth={1.7} />
          </View>
          <Text variant="titleLarge" style={styles.visualTitle}>Multi-user inventory control</Text>
          <Text variant="bodyMedium" style={styles.visualBody}>Private stock data, smart alerts, and real-time reporting.</Text>
        </View>
        <View>
          <View style={styles.progressRow}>
            {slides.map((_, slideIndex) => (
              <View
                key={slideIndex}
                style={[
                  styles.progressBar,
                  { backgroundColor: slideIndex === index ? theme.colors.primary : theme.colors.surfaceVariant },
                  slideIndex < slides.length - 1 && styles.progressGap
                ]}
              />
            ))}
          </View>
          <Button mode="contained" contentStyle={styles.buttonContent} labelStyle={styles.buttonLabel} style={styles.button} onPress={next}>
            {index === slides.length - 1 ? 'Get Started' : 'Continue'}
          </Button>
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screenContent: {
    paddingTop: spacing.xxl,
    paddingBottom: spacing.xxl
  },
  content: {
    flex: 1,
    justifyContent: 'space-between'
  },
  copyBlock: {
    paddingTop: spacing.lg
  },
  pill: {
    alignSelf: 'flex-start',
    borderRadius: 999,
    paddingHorizontal: spacing.md,
    paddingVertical: 6
  },
  pillText: {
    fontWeight: '900',
    letterSpacing: 0
  },
  title: {
    marginTop: spacing.xl,
    fontWeight: '900',
    letterSpacing: 0
  },
  body: {
    marginTop: spacing.md,
    lineHeight: 24
  },
  visualCard: {
    minHeight: 278,
    borderRadius: radius.xxl,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xxl,
    borderWidth: 1
  },
  iconFrame: {
    width: 118,
    height: 118,
    borderRadius: radius.xxl,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xxl
  },
  visualTitle: {
    color: palette.white,
    fontWeight: '900',
    textAlign: 'center',
    letterSpacing: 0
  },
  visualBody: {
    color: '#F5D8DC',
    marginTop: spacing.sm,
    textAlign: 'center',
    lineHeight: 21
  },
  progressRow: {
    flexDirection: 'row',
    marginBottom: spacing.xl
  },
  progressBar: {
    height: 6,
    flex: 1,
    borderRadius: 8
  },
  progressGap: {
    marginRight: spacing.sm
  },
  button: {
    borderRadius: radius.lg
  },
  buttonContent: {
    minHeight: 56
  },
  buttonLabel: {
    fontWeight: '900',
    letterSpacing: 0
  }
});

