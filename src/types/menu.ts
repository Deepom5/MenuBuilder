import type { TemplateOverrides } from '@/features/templates/types/template';

export type DietType = 'veg' | 'nonveg' | 'vegan';

export type MenuItem = {
  id: string;
  categoryId: string;
  name: string;
  description?: string;
  price: number;
  diet: DietType;
  photoUri?: string;
  available: boolean;
  order: number;
};

export type Category = {
  id: string;
  name: string;
  icon?: string;
  order: number;
};

export type Restaurant = {
  id: string;
  name: string;
  tagline?: string;
  currency: string;
  /** Currently active template — drives every customer-facing visual decision. */
  templateId: string;
  /** Per-restaurant tweaks applied on top of the template. */
  overrides: TemplateOverrides;
  /** Optional branding assets, persisted as local file URIs. */
  logoUri?: string;
  coverUri?: string;
};

export type Menu = {
  version: 2;
  restaurant: Restaurant;
  categories: Category[];
  items: MenuItem[];
  /** Favourite template IDs (heart icon in gallery). */
  favoriteTemplates: string[];
  /** Recently viewed/used template IDs, most recent first. */
  recentTemplates: string[];
  /** Set to true once the user has finished the onboarding flow. */
  onboardingComplete: boolean;
  updatedAt: string;
};
