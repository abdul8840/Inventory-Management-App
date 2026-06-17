import React, { useEffect, useRef } from 'react';
import { Animated, View } from 'react-native';
import { useTheme } from 'react-native-paper';

export function LoadingSkeleton({ rows = 4 }: { rows?: number }) {
  const opacity = useRef(new Animated.Value(0.35)).current;
  const theme = useTheme();

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 0.8, duration: 700, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.35, duration: 700, useNativeDriver: true })
      ])
    );
    animation.start();
    return () => animation.stop();
  }, [opacity]);

  return (
    <View className="gap-3">
      {Array.from({ length: rows }).map((_, index) => (
        <Animated.View
          key={index}
          style={{
            opacity,
            height: index === 0 ? 96 : 72,
            borderRadius: 8,
            backgroundColor: theme.colors.surfaceVariant
          }}
        />
      ))}
    </View>
  );
}
