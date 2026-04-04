import { create } from 'zustand';

const lightColors = {
  primary: '#246D36',
  secondary: '#81C784',
  background: '#FFFFFF',
  surface: '#FFFFFF',
  inputBackground: '#F8F9FA',
  text: '#1C1C1E',
  textSecondary: '#6B6B70',
  error: '#FF3B30',
  warning: '#FF9500',
  success: '#34C759',
  border: '#E5E5EA',
  iconGreen: '#E8F5E9',
  iconBlue: '#E3F2FD',
  iconRed: '#FFEBEE',
  tabBar: '#FFFFFF',
  card: '#FFFFFF',
};

const darkColors = {
  primary: '#4CAF50',
  secondary: '#81C784',
  background: '#121212',
  surface: '#1E1E1E',
  inputBackground: '#2C2C2E',
  text: '#F5F5F5',
  textSecondary: '#ABABAB',
  error: '#FF6B6B',
  warning: '#FFB74D',
  success: '#66BB6A',
  border: '#3A3A3C',
  iconGreen: '#1B3A1B',
  iconBlue: '#1A2A3A',
  iconRed: '#3A1A1A',
  tabBar: '#1E1E1E',
  card: '#2C2C2E',
};

interface ThemeState {
  isDark: boolean;
  toggle: () => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
  isDark: false,
  toggle: () => set((state) => ({ isDark: !state.isDark })),
}));

export const getColors = (isDark: boolean) => isDark ? darkColors : lightColors;

// Keep the static theme export for spacing/typography/borderRadius (unchanged by dark mode)
export const theme = {
  colors: lightColors,
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 40,
  },
  typography: {
    h1: {fontSize: 28, fontWeight: '700' as const},
    h2: {fontSize: 22, fontWeight: '700' as const},
    h3: {fontSize: 18, fontWeight: '600' as const},
    body: {fontSize: 15, fontWeight: '400' as const},
    caption: {fontSize: 13, fontWeight: '400' as const},
    button: {fontSize: 16, fontWeight: '600' as const},
  },
  borderRadius: {
    sm: 8,
    md: 12,
    lg: 20,
    xl: 24,
    round: 9999,
  },
};
