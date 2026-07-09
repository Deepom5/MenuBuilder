/**
 * Template type system.
 *
 * A `TemplateConfig` is a complete design system for a customer-facing menu:
 * colors, typography, layout choices (which food-card and category style to
 * render), shape, and shadows. Templates are pure data — adding a new one
 * means writing a new config file, no UI code changes required.
 *
 * A user's selected template is stored on the `Menu` as `templateId`, with
 * optional `overrides` for the small set of fields the customization studio
 * exposes (primary/accent/background colors, heading font, density,
 * appearance). `resolveTheme(menu)` merges the two and returns a flat
 * `ResolvedTheme` that every rendering component consumes.
 */

export type FontFamilyKey = 'sans' | 'serif' | 'rounded' | 'mono';

export type FoodCardLayout = 'large-image' | 'compact' | 'side-image' | 'grid' | 'minimal';

export type CategoryStyle = 'pills' | 'tabs' | 'horizontal' | 'icons';

export type HeroStyle = 'banner' | 'centered' | 'minimal' | 'split';

export type Density = 'compact' | 'comfortable' | 'spacious';

export type ShadowStyle = 'none' | 'soft' | 'elevated';

export type AppearancePref = 'auto' | 'light' | 'dark';

export type TemplateColors = {
  primary: string;
  secondary: string;
  accent: string;
  accentOn: string;
  background: string;
  surface: string;
  surfaceMuted: string;
  card: string;
  border: string;
  text: string;
  textMuted: string;
  price: string;
  veg: string;
  nonveg: string;
  vegan: string;
};

export type TemplateTypography = {
  heading: FontFamilyKey;
  body: FontFamilyKey;
  price: FontFamilyKey;
  scale: number;
  headingWeight: '400' | '500' | '600' | '700' | '800' | '900';
  letterSpacing: number;
};

export type TemplateLayout = {
  foodCard: FoodCardLayout;
  categoryStyle: CategoryStyle;
  heroStyle: HeroStyle;
  density: Density;
  showCover: boolean;
  showLogo: boolean;
};

export type TemplateShape = {
  cardRadius: number;
  imageRadius: number;
  buttonRadius: number;
};

export type TemplateConfig = {
  id: string;
  name: string;
  category: string;
  tags: string[];
  description: string;
  recommendedFor: string[];
  popular?: boolean;
  isNew?: boolean;
  supportsDarkMode: boolean;
  colors: { light: TemplateColors; dark: TemplateColors };
  typography: TemplateTypography;
  layout: TemplateLayout;
  shape: TemplateShape;
  shadow: ShadowStyle;
};

export type TemplateOverrides = {
  colors?: { primary?: string; accent?: string; background?: string };
  typography?: { heading?: FontFamilyKey; scale?: number };
  layout?: { density?: Density };
  appearance?: AppearancePref;
};

export type ResolvedTheme = {
  templateId: string;
  templateName: string;
  appearance: 'light' | 'dark';
  colors: TemplateColors;
  typography: TemplateTypography;
  layout: TemplateLayout;
  shape: TemplateShape;
  shadow: ShadowStyle;
  fonts: { heading: string; body: string; price: string };
};
