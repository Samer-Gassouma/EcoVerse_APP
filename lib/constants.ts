export const NAV_THEME1 = {
  light: {
    background: 'hsl(0 0% 100%)', // background
    border: 'hsl(240 5.9% 90%)', // border
    card: 'hsl(0 0% 100%)', // card
    notification: 'hsl(0 84.2% 60.2%)', // destructive
    primary: 'hsl(240 5.9% 10%)', // primary
    text: 'hsl(240 10% 3.9%)', // foreground
  },
  dark: {
    background: 'hsl(240 10% 3.9%)', // background
    border: 'hsl(240 3.7% 15.9%)', // border
    card: 'hsl(240 10% 3.9%)', // card
    notification: 'hsl(0 72% 51%)', // destructive
    primary: 'hsl(0 0% 98%)', // primary
    text: 'hsl(0 0% 98%)', // foreground
  },
};

export const THEME = {
  light: {
    background: '#F0F4F8',
    foreground: '#2C3E50', 
    primary: '#2ECC71',
    secondary: '#3498DB',
    accent: '#E67E22',
    muted: '#BDC3C7',
    card: '#FFFFFF',
    cardForeground: '#2C3E50',
  },
  dark: {
    background: '#1A2634',
    foreground: '#ECF0F1',
    primary: '#2ECC71', 
    secondary: '#3498DB',
    accent: '#E67E22',
    muted: '#7F8C8D',
    card: '#2C3E50',
    cardForeground: '#ECF0F1',
  },
};

export const NAV_THEME = {
  light: {
    background: THEME.light.background,
    border: THEME.light.muted,
    card: THEME.light.card,
    notification: THEME.light.accent,
    primary: THEME.light.primary,
    text: THEME.light.foreground,
  },
  dark: {
    background: THEME.dark.background,
    border: THEME.dark.muted,
    card: THEME.dark.card, 
    notification: THEME.dark.accent,
    primary: THEME.dark.primary,
    text: THEME.dark.foreground,
  },
};
