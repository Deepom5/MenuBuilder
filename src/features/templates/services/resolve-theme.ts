import { fontFamilyFor } from '@/features/templates/services/fonts';
import type {
    AppearancePref,
    Density,
    ResolvedTheme,
    TemplateConfig,
    TemplateOverrides,
} from '@/features/templates/types/template';

type AppearanceInput = 'light' | 'dark';

/**
 * Combine a template's defaults with a user's overrides into a fully resolved
 * theme. The resolver is the single source of truth for every visual
 * decision; UI never reads template + overrides separately.
 */
export function resolveTheme(
  template: TemplateConfig,
  overrides: TemplateOverrides | undefined,
  systemAppearance: AppearanceInput,
): ResolvedTheme {
  const appearance = pickAppearance(template, overrides?.appearance, systemAppearance);
  const baseColors = appearance === 'dark' ? template.colors.dark : template.colors.light;
  const colorOverrides = overrides?.colors ?? {};
  const colors = {
    ...baseColors,
    primary: colorOverrides.primary ?? baseColors.primary,
    accent: colorOverrides.accent ?? baseColors.accent,
    background: colorOverrides.background ?? baseColors.background,
  };

  const typography = {
    ...template.typography,
    heading: overrides?.typography?.heading ?? template.typography.heading,
    scale: overrides?.typography?.scale ?? template.typography.scale,
  };

  const layout = {
    ...template.layout,
    density: overrides?.layout?.density ?? template.layout.density,
  };

  return {
    templateId: template.id,
    templateName: template.name,
    appearance,
    colors,
    typography,
    layout,
    shape: template.shape,
    shadow: template.shadow,
    fonts: {
      heading: fontFamilyFor(typography.heading),
      body: fontFamilyFor(template.typography.body),
      price: fontFamilyFor(template.typography.price),
    },
  };
}

function pickAppearance(
  template: TemplateConfig,
  pref: AppearancePref | undefined,
  systemAppearance: AppearanceInput,
): AppearanceInput {
  if (!template.supportsDarkMode) return 'light';
  if (pref === 'light' || pref === 'dark') return pref;
  return systemAppearance;
}

const DENSITY_GAP: Record<Density, number> = {
  compact: 8,
  comfortable: 14,
  spacious: 22,
};

const DENSITY_PADDING: Record<Density, number> = {
  compact: 12,
  comfortable: 16,
  spacious: 22,
};

export function gapForDensity(d: Density): number {
  return DENSITY_GAP[d];
}

export function paddingForDensity(d: Density): number {
  return DENSITY_PADDING[d];
}
