const colors = {
  gold: '#FFD700',
  silver: '#C0C0C0',
  bronze: '#CD7F32',
}; 

export type ThemeType = {
  cardBg: string;
  border: string;
  shadow: string;
  overlay: string;
  text: string;
  mutedText: string;
  primary: string;
  secondary: string;
  background: string;
  card: string;
  markerBorder: string;
  sheetBg: string;
  searchBarBg: string;
  buttonBg: string;
  success: string;
  warning: string;
  error: string;
  info: string;
  gradientOverlay: string[];
  online: string;
  offline: string;
  busy: string;
  cleanup: string;
  planting: string;
  recycling: string;
  workshop: string;
  gold: string;
  silver: string;
  bronze: string;
};

export const themeConfig = {
  light: {
    ...colors,
    cardBg: 'rgba(255, 255, 255, 0.8)',
    border: 'rgba(0, 0, 0, 0.1)',
    shadow: '#666666',
    overlay: 'rgba(255, 255, 255, 0.3)',
    text: '#000000',
    mutedText: '#666666',
    primary: '#0ea5e9',
    secondary: '#6366f1',
    background: '#ffffff',
    card: '#f8fafc',
    markerBorder: '#ffffff',
    sheetBg: '#ffffff',
    searchBarBg: 'rgba(255, 255, 255, 0.9)',
    buttonBg: 'rgba(255, 255, 255, 0.9)',
    success: '#22c55e',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6',
    gradientOverlay: ['rgba(255, 255, 255, 0.9)', 'rgba(255, 255, 255, 0.3)'],
    // Status colors
    online: '#22c55e',
    offline: '#94a3b8',
    busy: '#ef4444',
    // Event types
    cleanup: '#22c55e',
    planting: '#3b82f6',
    recycling: '#f59e0b',
    workshop: '#8b5cf6',
  } satisfies ThemeType,
  dark: {
    ...colors,
    cardBg: 'rgba(30, 41, 59, 0.8)',
    border: 'rgba(255, 255, 255, 0.1)',
    shadow: '#000000',
    overlay: 'rgba(0, 0, 0, 0.3)',
    text: '#ffffff',
    mutedText: '#94a3b8',
    primary: '#38bdf8',
    secondary: '#818cf8',
    background: '#0f172a',
    card: '#1e293b',
    markerBorder: '#1e293b',
    sheetBg: '#1e293b',
    searchBarBg: 'rgba(30, 41, 59, 0.9)',
    buttonBg: 'rgba(30, 41, 59, 0.9)',
    success: '#4ade80',
    warning: '#fbbf24',
    error: '#f87171',
    info: '#60a5fa',
    gradientOverlay: ['rgba(15, 23, 42, 0.9)', 'rgba(15, 23, 42, 0.3)'],
    // Status colors
    online: '#4ade80',
    offline: '#64748b',
    busy: '#f87171',
    // Event types
    cleanup: '#4ade80',
    planting: '#60a5fa',
    recycling: '#fbbf24',
    workshop: '#a78bfa',
  } satisfies ThemeType,
} as const;

// Type definitions
export type Theme = typeof themeConfig.light;
export type ThemeColor = keyof Theme;

// Helper function to ensure type safety when using colors
export const getThemeColor = (theme: Theme, color: ThemeColor) => theme[color];

