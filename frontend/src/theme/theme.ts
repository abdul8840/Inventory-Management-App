import { MD3DarkTheme, MD3LightTheme, type MD3Theme } from 'react-native-paper';
import { DarkTheme, DefaultTheme, type Theme as NavigationTheme } from '@react-navigation/native';

export const palette = {
  red: '#C4122F',
  redDark: '#7A0B19',
  redSoft: '#FCE3E8',
  redPale: '#FFF0F2',
  cream: '#FFF4E6',
  creamSoft: '#FFF9F1',
  creamDeep: '#EFD8BD',
  white: '#FFFFFF',
  black: '#080607',
  ink: '#171113',
  muted: '#7A6264',
  line: '#E9D4C0',
  gold: '#B7791F',
  green: '#18794E'
};


export function buildPaperTheme(isDark: boolean): MD3Theme {
  const base = isDark ? MD3DarkTheme : MD3LightTheme;

  return {
    ...base,
    roundness: 14,
    colors: {
      ...base.colors,
      primary: palette.red,
      onPrimary: palette.white,
      primaryContainer: isDark ? '#3A0710' : palette.redSoft,
      onPrimaryContainer: isDark ? '#FFE5E9' : palette.redDark,
      secondary: palette.black,
      onSecondary: palette.white,
      secondaryContainer: isDark ? '#2A2021' : '#F4E1CC',
      onSecondaryContainer: isDark ? '#FFF4E6' : palette.ink,
      tertiary: palette.gold,
      error: '#D21F3C',
      errorContainer: isDark ? '#3A0710' : '#FFE2E7',
      onErrorContainer: isDark ? '#FFD9DF' : '#7A0B19',
      background: isDark ? '#110D0E' : palette.cream,
      onBackground: isDark ? '#FFF8F0' : palette.ink,
      surface: isDark ? '#1B1415' : palette.white,
      onSurface: isDark ? '#FFF8F0' : palette.ink,
      surfaceVariant: isDark ? '#2A2021' : '#FFF1E1',
      onSurfaceVariant: isDark ? '#D9C4B7' : palette.muted,
      outline: isDark ? '#5C4548' : palette.line,
      outlineVariant: isDark ? '#332629' : '#EED9C5',
      backdrop: 'rgba(8,6,7,0.42)',
      elevation: {
        ...base.colors.elevation,
        level0: isDark ? '#110D0E' : palette.cream,
        level1: isDark ? '#1B1415' : palette.white,
        level2: isDark ? '#22191A' : palette.creamSoft,
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
      background: isDark ? '#110D0E' : palette.cream,
      card: isDark ? '#1B1415' : palette.white,
      text: isDark ? '#FFF8F0' : palette.ink,
      border: isDark ? '#332629' : palette.line,
      notification: '#D21F3C'
    }
  };
}

