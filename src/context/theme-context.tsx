import { createContext, useContext, useMemo, type ReactNode } from 'react';
import { useColorScheme } from 'react-native';

import { getTemplateById } from '@/features/templates/configs';
import { resolveTheme } from '@/features/templates/services/resolve-theme';
import type {
    ResolvedTheme,
    TemplateOverrides,
} from '@/features/templates/types/template';

type ThemeContextValue = {
  theme: ResolvedTheme;
  colors: ResolvedTheme['colors'];
  isDark: boolean;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

/**
 * Resolves the active template + overrides for the current system appearance
 * and exposes the flat theme to descendants. Designed so any component can
 * call `useMenuTheme()` without knowing about templates or overrides.
 */
export function MenuThemeProvider({
  templateId,
  overrides,
  children,
}: Readonly<{
  templateId: string;
  overrides: TemplateOverrides;
  children: ReactNode;
}>) {
  const scheme = useColorScheme();
  const systemAppearance = scheme === 'dark' ? 'dark' : 'light';

  const value = useMemo<ThemeContextValue>(() => {
    const template = getTemplateById(templateId);
    const theme = resolveTheme(template, overrides, systemAppearance);
    return { theme, colors: theme.colors, isDark: theme.appearance === 'dark' };
  }, [templateId, overrides, systemAppearance]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useMenuTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useMenuTheme must be used inside MenuThemeProvider');
  }
  return ctx;
}
