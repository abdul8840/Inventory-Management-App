import { MD3DarkTheme, MD3LightTheme, type MD3Theme } from 'react-native-paper';
import { DarkTheme, DefaultTheme, type Theme as NavigationTheme } from '@react-navigation/native';

export const palette = {
  red: '#B11226',
  redDark: '#7A0B19',
  redSoft: '#FCE7EA',
  cream: '#FFF4E6',
  creamDeep: '#F4DFC4',
  white: '#FFFFFF',
  black: '#09090B',
  ink: '#191113',
  muted: '#7A5F62',
  line: '#E8D4C3',
  gold: '#B7791F',
  green: '#18794E'
};

export function buildPaperTheme(isDark: boolean): MD3Theme {
  const base = isDark ? MD3DarkTheme : MD3LightTheme;

  return {
    ...base,
    roundness: 10,
    colors: {
      ...base.colors,
      primary: palette.red,
      onPrimary: palette.white,
      primaryContainer: isDark ? '#3A0710' : palette.redSoft,
      onPrimaryContainer: isDark ? '#FFE5E9' : palette.redDark,
      secondary: palette.black,
      onSecondary: palette.white,
      secondaryContainer: isDark ? '#2A2021' : '#F5E4D2',
      onSecondaryContainer: isDark ? '#FFF4E6' : palette.ink,
      tertiary: palette.gold,
      error: '#D21F3C',
      background: isDark ? '#120D0E' : palette.cream,
      onBackground: isDark ? '#FFF8F0' : palette.ink,
      surface: isDark ? '#1B1415' : palette.white,
      onSurface: isDark ? '#FFF8F0' : palette.ink,
      surfaceVariant: isDark ? '#2A2021' : '#F8E8D8',
      onSurfaceVariant: isDark ? '#D9C4B7' : palette.muted,
      outline: isDark ? '#5C4548' : palette.line,
      outlineVariant: isDark ? '#332629' : '#F1DDCA',
      elevation: {
        ...base.colors.elevation,
        level0: isDark ? '#120D0E' : palette.cream,
        level1: isDark ? '#1B1415' : palette.white,
        level2: isDark ? '#22191A' : '#FFF9F1',
        level3: isDark ? '#281D1F' : '#FFF4E6',
        level4: isDark ? '#2D2022' : '#FDECDC',
        level5: isDark ? '#332427' : '#F9E3D1'
      }
    }
  };
}

export function buildNavigationTheme(isDark: boolean): NavigationTheme {
  const base = isDark ? DarkTheme : DefaultTheme;

  return {
    ...base,
    colors: {
      ...base.colors,
      primary: palette.red,
      background: isDark ? '#120D0E' : palette.cream,
      card: isDark ? '#1B1415' : palette.white,
      text: isDark ? '#FFF8F0' : palette.ink,
      border: isDark ? '#332629' : palette.line,
      notification: '#D21F3C'
    }
  };
}
