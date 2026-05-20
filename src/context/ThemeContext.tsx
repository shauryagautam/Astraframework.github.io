import { createContext, useState, useEffect, type ReactNode } from 'react';
import type { Theme } from '../types/theme';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('astra-theme');
    if (saved === 'light' || saved === 'dark' || saved === 'liquid-glass') return saved as Theme;
    return 'light';
  });

  useEffect(() => {
    localStorage.setItem('astra-theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
