import { DarkTheme, DefaultTheme, Theme, ThemeProvider } from '@react-navigation/native';
import { NAV_THEME } from '~/lib/constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { useState,useEffect } from 'react';
const LIGHT_THEME: Theme = {
  ...DefaultTheme,
  colors: NAV_THEME.light,
};
const DARK_THEME: Theme = {
  ...DarkTheme,
  colors: NAV_THEME.dark,
};

export function useTheme() {
  const [isColorSchemeLoaded, setIsColorSchemeLoaded] = useState(false);
  const [colorScheme, setColorScheme] = useState<'light' | 'dark'>('light');  
  useEffect(() => {
    (async () => {
      const theme = await AsyncStorage.getItem('theme');
      if (!theme) {
        AsyncStorage.setItem('theme', 'light');
      }
      setColorScheme(theme === 'dark' ? 'dark' : 'light');
      setIsColorSchemeLoaded(true);
    })();
  }, []);

  return {
    theme: colorScheme === 'dark' ? DARK_THEME : LIGHT_THEME,
    isColorSchemeLoaded,
    colorScheme,
  };
}
