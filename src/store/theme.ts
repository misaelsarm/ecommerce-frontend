import { create } from 'zustand'

type ThemeStore = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

export interface Theme {
  name: string;
  vars: Record<string, string>;
}

const lightTheme: Theme = {
  name: 'light',
  vars: {
    '--primary-bg': '#0070f3',
    '--primary-color': '#fff',

    '--primary-bg-hover': 'black',

    // '--button-link-bg': 'transparent',
    // '--button-link-color': '#0070f3',

    '--secondary-bg': '#eaeaea',
    '--secondary-color': '#111',
  },
};

export const useThemeStore = create<ThemeStore>((set) => ({
  theme: lightTheme,
  setTheme: (theme) => set({ theme }),
}));
