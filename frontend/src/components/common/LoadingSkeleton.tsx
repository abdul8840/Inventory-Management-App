import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { useTheme } from 'react-native-paper';
import { radius, spacing } from './Layout';

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
    <View>
      {Array.from({ length: rows }).map((_, index) => (
        <Animated.View
          key={index}
          style={[
            styles.row,
            index < rows - 1 && styles.rowSpacing,
            {
              opacity,
              height: index === 0 ? 104 : 76,
              backgroundColor: theme.colors.surfaceVariant
            }
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    borderRadius: radius.lg
  },
  rowSpacing: {
    marginBottom: spacing.md
  }
});
