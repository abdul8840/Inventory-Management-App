import React, { useEffect, useRef, useState } from 'react';
import { Animated, View } from 'react-native';
import { Button, Text, useTheme } from 'react-native-paper';
import { BarChart3, BellRing, Boxes } from 'lucide-react-native';
import { Screen } from '../../components/common/Screen';
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
    <Screen scroll={false}>
      <View className="flex-1 justify-between p-6">
        <Animated.View style={{ marginTop: 18, opacity: fade, transform: [{ translateY: fade.interpolate({ inputRange: [0, 1], outputRange: [10, 0] }) }] }}>
          <View
            style={{
              alignSelf: 'flex-start',
              borderRadius: 999,
              backgroundColor: theme.colors.primaryContainer,
              paddingHorizontal: 12,
              paddingVertical: 6
            }}
          >
            <Text variant="labelLarge" style={{ color: theme.colors.primary, fontWeight: '800' }}>
              Inventory Pro
            </Text>
          </View>
          <Text variant="displaySmall" style={{ marginTop: 20, color: theme.colors.onBackground, fontWeight: '900' }}>
            {slide.title}
          </Text>
          <Text variant="bodyLarge" style={{ marginTop: 14, color: theme.colors.onSurfaceVariant, lineHeight: 24 }}>
            {slide.body}
          </Text>
        </Animated.View>
        <View
          style={{
            minHeight: 270,
            borderRadius: 28,
            backgroundColor: theme.dark ? palette.redDark : palette.black,
            alignItems: 'center',
            justifyContent: 'center',
            padding: 26,
            borderWidth: 1,
            borderColor: theme.dark ? '#55202A' : palette.black
          }}
        >
          <View
            style={{
              width: 118,
              height: 118,
              borderRadius: 30,
              backgroundColor: theme.colors.primary,
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 22
            }}
          >
            <Icon size={64} color={palette.white} strokeWidth={1.7} />
          </View>
          <Text variant="titleLarge" style={{ color: palette.white, fontWeight: '900', textAlign: 'center' }}>
            Multi-user inventory control
          </Text>
          <Text variant="bodyMedium" style={{ color: '#F5D8DC', marginTop: 8, textAlign: 'center' }}>
            Private stock data, smart alerts, and real-time reporting.
          </Text>
        </View>
        <View>
          <View className="mb-5 flex-row gap-2">
            {slides.map((_, slideIndex) => (
              <View
                key={slideIndex}
                style={{
                  height: 6,
                  flex: 1,
                  borderRadius: 8,
                  backgroundColor: slideIndex === index ? theme.colors.primary : theme.colors.surfaceVariant
                }}
              />
            ))}
          </View>
          <Button mode="contained" contentStyle={{ minHeight: 54 }} labelStyle={{ fontWeight: '800' }} onPress={next}>
            {index === slides.length - 1 ? 'Get Started' : 'Continue'}
          </Button>
        </View>
      </View>
    </Screen>
  );
}
