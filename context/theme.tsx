import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Theme, themeConfig } from '~/config/theme';

type ThemeContextType = {
  theme: Theme;
  isDark: boolean;
  toggleTheme: () => void;
  setSystemTheme: () => void;
  useSystemTheme: boolean;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemColorScheme = useColorScheme();
  const [useSystemTheme, setUseSystemTheme] = useState(true);
  const [isDark, setIsDark] = useState(systemColorScheme === 'dark');

  useEffect(() => {
    loadThemePreference();
  }, []);

  useEffect(() => {
    if (useSystemTheme) {
      setIsDark(systemColorScheme === 'dark');
    }
  }, [systemColorScheme, useSystemTheme]);

  const loadThemePreference = async () => {
    try {
      const useSystem = await AsyncStorage.getItem('useSystemTheme');
      const savedTheme = await AsyncStorage.getItem('isDarkTheme');
      
      if (useSystem !== null) {
        setUseSystemTheme(JSON.parse(useSystem));
      }
      
      if (!useSystem && savedTheme !== null) {
        setIsDark(JSON.parse(savedTheme));
      }
    } catch (error) {
      console.error('Error loading theme preference:', error);
    }
  };

  const toggleTheme = async () => {
    try {
      setIsDark(prev => !prev);
      await AsyncStorage.setItem('isDarkTheme', JSON.stringify(!isDark));
      setUseSystemTheme(false);
      await AsyncStorage.setItem('useSystemTheme', JSON.stringify(false));
    } catch (error) {
      console.error('Error saving theme preference:', error);
    }
  };

  const setSystemTheme = async () => {
    try {
      setUseSystemTheme(true);
      setIsDark(systemColorScheme === 'dark');
      await AsyncStorage.setItem('useSystemTheme', JSON.stringify(true));
    } catch (error) {
      console.error('Error saving system theme preference:', error);
    }
  };

  return (
    <ThemeContext.Provider 
      value={{
        theme: isDark ? themeConfig.dark : themeConfig.light,
        isDark,
        toggleTheme,
        setSystemTheme,
        useSystemTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}; 