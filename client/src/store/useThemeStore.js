import { create } from 'zustand';

const getInitialTheme = () => {
  const saved = localStorage.getItem('campusexchange_theme');
  if (saved) return saved;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

export const useThemeStore = create((set, get) => ({
  theme: getInitialTheme(),
  
  toggleTheme: () => {
    const nextTheme = get().theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('campusexchange_theme', nextTheme);
    if (nextTheme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    }
    set({ theme: nextTheme });
  },

  initTheme: () => {
    const current = get().theme;
    if (current === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    }
  }
}));
