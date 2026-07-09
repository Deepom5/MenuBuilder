import type { TemplateConfig } from '@/features/templates/types/template';

import bakerySweet from './bakery-sweet';
import fastFoodExpress from './fast-food-express';
import fineDining from './fine-dining';
import indianHeritage from './indian-heritage';
import japaneseZen from './japanese-zen';
import luxuryBlack from './luxury-black';
import minimalWhite from './minimal-white';
import modernCafe from './modern-cafe';
import pizzaOven from './pizza-oven';
import veganGreen from './vegan-green';

/**
 * Ordered registry of every built-in template. To add a template, drop a new
 * config file in this folder and append it here — nothing else changes.
 */
export const TEMPLATES: readonly TemplateConfig[] = [
  minimalWhite,
  luxuryBlack,
  modernCafe,
  indianHeritage,
  fastFoodExpress,
  fineDining,
  bakerySweet,
  japaneseZen,
  veganGreen,
  pizzaOven,
];

export const DEFAULT_TEMPLATE_ID = 'minimal-white';

export function getTemplateById(id: string | undefined | null): TemplateConfig {
  if (!id) return TEMPLATES[0];
  return TEMPLATES.find((t) => t.id === id) ?? TEMPLATES[0];
}

export function listTemplateCategories(): string[] {
  const set = new Set<string>();
  TEMPLATES.forEach((t) => set.add(t.category));
  return ['All', ...Array.from(set)];
}

export type TemplateFilter = {
  query?: string;
  category?: string;
  popularOnly?: boolean;
};

export function filterTemplates(filter: TemplateFilter): TemplateConfig[] {
  const q = filter.query?.trim().toLowerCase() ?? '';
  return TEMPLATES.filter((t) => {
    if (filter.popularOnly && !t.popular) return false;
    if (filter.category && filter.category !== 'All' && t.category !== filter.category) return false;
    if (q) {
      const haystack = `${t.name} ${t.category} ${t.tags.join(' ')} ${t.description}`.toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    return true;
  });
}
