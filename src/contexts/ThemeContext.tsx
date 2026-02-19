import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from './AuthContext';

type ThemeColor = 'orange' | 'blue' | 'pink' | 'purple';
type ThemeMode = 'dark' | 'light';

interface ThemeContextType {
  color: ThemeColor;
  mode: ThemeMode;
  setColor: (c: ThemeColor) => void;
  setMode: (m: ThemeMode) => void;
}

const colorTokens: Record<ThemeColor, Record<string, string>> = {
  orange: {
    '--primary': '32 95% 52%',
    '--accent': '24 85% 48%',
    '--ring': '32 95% 52%',
    '--amber-glow': '32 95% 52%',
    '--orange-glow': '22 88% 45%',
  },
  blue: {
    '--primary': '217 91% 60%',
    '--accent': '221 83% 53%',
    '--ring': '217 91% 60%',
    '--amber-glow': '217 91% 60%',
    '--orange-glow': '221 83% 53%',
  },
  pink: {
    '--primary': '330 81% 60%',
    '--accent': '340 75% 55%',
    '--ring': '330 81% 60%',
    '--amber-glow': '330 81% 60%',
    '--orange-glow': '340 75% 55%',
  },
  purple: {
    '--primary': '263 70% 58%',
    '--accent': '270 65% 50%',
    '--ring': '263 70% 58%',
    '--amber-glow': '263 70% 58%',
    '--orange-glow': '270 65% 50%',
  },
};

const lightOverrides: Record<string, string> = {
  '--background': '0 0% 98%',
  '--foreground': '20 14% 10%',
  '--card': '0 0% 100%',
  '--card-foreground': '20 14% 10%',
  '--popover': '0 0% 100%',
  '--popover-foreground': '20 14% 10%',
  '--secondary': '220 14% 96%',
  '--secondary-foreground': '20 14% 30%',
  '--muted': '220 14% 94%',
  '--muted-foreground': '215 16% 47%',
  '--border': '220 13% 87%',
  '--input': '220 13% 87%',
  '--deep-brown': '0 0% 96%',
};

const darkDefaults: Record<string, string> = {
  '--background': '20 14% 4%',
  '--foreground': '38 25% 93%',
  '--card': '22 12% 7%',
  '--card-foreground': '38 25% 93%',
  '--popover': '22 12% 7%',
  '--popover-foreground': '38 25% 93%',
  '--secondary': '22 14% 12%',
  '--secondary-foreground': '38 20% 82%',
  '--muted': '22 12% 11%',
  '--muted-foreground': '32 12% 50%',
  '--border': '30 18% 16%',
  '--input': '30 18% 16%',
  '--deep-brown': '20 18% 5%',
};

const ThemeContext = createContext<ThemeContextType>({
  color: 'orange',
  mode: 'dark',
  setColor: () => {},
  setMode: () => {},
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [color, setColorState] = useState<ThemeColor>('orange');
  const [mode, setModeState] = useState<ThemeMode>('dark');

  // Load from DB
  useEffect(() => {
    if (!user) return;
    supabase
      .from('theme_preferences')
      .select('theme_color, theme_mode')
      .eq('user_id', user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (data) {
          if (data.theme_color) setColorState(data.theme_color as ThemeColor);
          if (data.theme_mode) setModeState(data.theme_mode as ThemeMode);
        }
      });
  }, [user]);

  // Apply tokens
  useEffect(() => {
    const root = document.documentElement;
    const tokens = colorTokens[color];
    Object.entries(tokens).forEach(([k, v]) => root.style.setProperty(k, v));

    const modeTokens = mode === 'light' ? lightOverrides : darkDefaults;
    Object.entries(modeTokens).forEach(([k, v]) => root.style.setProperty(k, v));
  }, [color, mode]);

  const persist = async (c: ThemeColor, m: ThemeMode) => {
    if (!user) return;
    await supabase.from('theme_preferences').upsert({
      user_id: user.id,
      theme_color: c,
      theme_mode: m,
    }, { onConflict: 'user_id' });
  };

  const setColor = (c: ThemeColor) => {
    setColorState(c);
    persist(c, mode);
  };

  const setMode = (m: ThemeMode) => {
    setModeState(m);
    persist(color, m);
  };

  return (
    <ThemeContext.Provider value={{ color, mode, setColor, setMode }}>
      {children}
    </ThemeContext.Provider>
  );
};
