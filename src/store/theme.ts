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

    //Actions
    //primary
    '--action-primary-bg': '#FFBB45',
    '--action-primary-color': 'black',
    //secondary
    '--action-secondary-bg': '#eaeaea',
    '--action-secondary-color': '#111',

    //Background colors
    '--background-primary-bg': '#f5f5f7',
    '--background-secondary-bg': '',

    //Text color
    '--text-primary-color': '#111',


    // Form-related
    // '--form-label-color': '#333',
    // '--form-input-bg': '#fff',
    // '--form-input-color': '#000',
    // '--form-input-border': '#ccc',
    // '--form-input-placeholder': '#888',
    // '--form-input-focus-border': '#FFBB45',
    // '--form-input-disabled-bg': '#f5f5f5',

    // Card
    // '--card-bg': '#fff',
    // '--card-shadow': '0px 4px 12px rgba(0, 0, 0, 0.06)',
    // '--card-border': 'rgb(236, 236, 236)',


    // '--card-item-text-color': '#000',

    // Page




  },
};

const darkTheme: Theme = {
  name: 'dark',
  vars: {
    //Actions
    //primary
    '--action-primary-bg': 'white',
    '--action-primary-color': 'black',
    //secondary
    '--action-secondary-bg': '#343434',
    '--action-secondary-color': '#ccc',

    // Background colors
    '--background-primary-bg': '#212121',
    '--background-secondary-bg': '#343434',

    // Text colors
    '--text-primary-color': 'white'

    // Form-related
    // '--form-label-color': '#aaa',
    // '--form-input-bg': '#222',
    // '--form-input-color': '#fff',
    // '--form-input-border': '#444',
    // '--form-input-placeholder': '#777',
    // '--form-input-focus-border': '#FFBB45',
    // '--form-input-disabled-bg': '#333',

    // Card
    // '--card-bg': '#1e1e1e',
    // '--card-shadow': '0px 4px 12px rgba(0, 0, 0, 0.4)',
    // '--card-border': '#2c2c2c',

    // '--card-item-text-color': '#fff',
  },
};

export const themes = {
  light: lightTheme,
  dark: darkTheme,
  // Add more custom themes here
};

export const useThemeStore = create<ThemeStore>((set) => ({
  theme: themes.light,
  setTheme: (name) => set({ theme: themes[name] }),
}));
