import { create } from 'zustand'

type ThemeStore = {
  theme: Theme;
  setTheme: (theme: string) => void;
};

export interface Theme {
  name: string;
  vars: Record<string, string>;
}

//Theme should come from config file or user settings (TODO: store theme in DB)
const lightTheme: Theme = {
  name: 'light',
  vars: {

    '--button-primary-bg': '#FFBB45',
    '--button-primary-color': '#000000',
    '--button-primary-border': '#FFBB45',
    '--button-primary-hover-bg': '#E6A53D',
    '--button-primary-hover-color': '#000000',

    '--button-secondary-bg': '#F5F5F5',
    '--button-secondary-color': '#111111',
    '--button-secondary-border': '#CCCCCC',
    '--button-secondary-hover-bg': '#E0E0E0',
    '--button-secondary-hover-color': '#111111',



    /* ========= Backgrounds ========= */
    '--background-primary': '#FFFFFF',
    '--background-secondary': '#F7F7F7',
    '--background-accent': '#FFBB45',


    /* ========= Text ========= */
    '--text-primary-color': '#111111',
    '--text-secondary-color': '#555555',
    '--text-inverse-color': '#FFFFFF',

    /* ========= Inputs ========= */
    '--input-bg': '#FFFFFF',
    '--input-color': '#111111',
    '--input-border': '#CCCCCC',
    '--input-placeholder-color': '#888888',
    '--input-focus-border': '#FFBB45',

    // Sidebar
    '--sidebar-bg': '#FFFFFF',
    '--sidebar-color': '#111111',
    '--sidebar-border': '#EAEAEA',

    // Active (Primary style)
    '--sidebar-active-bg': '#FFBB45',
    '--sidebar-active-color': '#000000',
    '--sidebar-active-border': '#FFBB45',

    // Hover
    '--sidebar-hover-bg': '#F5F5F5',
    '--sidebar-hover-color': '#111111',

  },
};

const darkTheme: Theme = {
  name: 'dark',
  vars: {
    /* ========= Buttons ========= */
    '--button-primary-bg': '#FFBB45',
    '--button-primary-color': '#000000',
    '--button-primary-border': '#FFBB45',
    '--button-primary-hover-bg': '#E6A53D',
    '--button-primary-hover-color': '#000000',

    '--button-secondary-bg': '#303030',
    '--button-secondary-color': '#FFFFFF',
    '--button-secondary-border': '#555555',
    '--button-secondary-hover-bg': '#3A3A3A',
    '--button-secondary-hover-color': '#FFFFFF',

    /* ========= Inputs ========= */
    '--input-bg': '#303030',
    '--input-color': '#FFFFFF',
    '--input-border': '#555555',
    '--input-placeholder-color': '#AAAAAA',
    '--input-focus-border': '#FFBB45',

    /* ========= Cards ========= */
    '--card-bg': '#2A2A2A',
    '--card-color': '#FFFFFF',
    '--card-border': '#444444',
    '--card-shadow': '0 1px 3px rgba(0,0,0,0.5)',

    /* ========= Text ========= */
    '--text-primary-color': '#FFFFFF',
    '--text-secondary-color': '#CCCCCC',
    '--text-inverse-color': '#000000',

    /* ========= Backgrounds ========= */
    '--background-primary': '#181818',
    '--background-secondary': '#212121',
    '--background-tertiary': '#303030',

    // Sidebar
    '--sidebar-bg': '#181818',
    '--sidebar-color': '#FFFFFF',
    '--sidebar-border': '#333333',

    // Active (Primary style)
    '--sidebar-active-bg': '#FFBB45',
    '--sidebar-active-color': '#000000',
    '--sidebar-active-border': '#FFBB45',

    // Hover
    '--sidebar-hover-bg': '#2A2A2A',
    '--sidebar-hover-color': '#FFFFFF',
  }
}

export const themes = {
  light: lightTheme,
  dark: darkTheme,
  // Add more custom themes here
};

export const useThemeStore = create<ThemeStore>((set) => ({
  theme: themes.light,
  setTheme: (name) => set({ theme: themes[name] }),
}));
