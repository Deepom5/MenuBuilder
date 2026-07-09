import type { Category, DietType, Menu, MenuItem, Restaurant } from '@/types/menu';

/**
 * Realistic dishes used to populate a preview when the menu is empty.
 * Lets users see exactly what a template will look like before they have
 * any of their own data, without polluting the persisted menu.
 */
const SAMPLE_CATEGORIES: Category[] = [
  { id: 'sample-starters', name: 'Starters', order: 1 },
  { id: 'sample-mains', name: 'Mains', order: 2 },
  { id: 'sample-desserts', name: 'Desserts', order: 3 },
];

type Seed = {
  name: string;
  description?: string;
  price: number;
  diet: DietType;
  categoryId: string;
};

const SAMPLE_ITEMS: Seed[] = [
  { categoryId: 'sample-starters', name: 'Burrata · Heirloom Tomato', description: 'Aged balsamic, basil oil, sourdough crostini', price: 14, diet: 'veg' },
  { categoryId: 'sample-starters', name: 'Tuna Tartare', description: 'Avocado, ponzu, sesame crisp', price: 18, diet: 'nonveg' },
  { categoryId: 'sample-starters', name: 'Roasted Beet Salad', description: 'Pistachio crumble, citrus vinaigrette', price: 12, diet: 'vegan' },
  { categoryId: 'sample-mains', name: 'Hand-cut Tagliatelle', description: 'Slow-braised short rib ragù, parmigiano', price: 26, diet: 'nonveg' },
  { categoryId: 'sample-mains', name: 'Wild Mushroom Risotto', description: 'Black truffle, aged pecorino', price: 24, diet: 'veg' },
  { categoryId: 'sample-mains', name: 'Charred Cauliflower Steak', description: 'Romesco, capers, almond gremolata', price: 22, diet: 'vegan' },
  { categoryId: 'sample-desserts', name: 'Dark Chocolate Tart', description: 'Sea salt, olive oil, raspberry coulis', price: 11, diet: 'veg' },
  { categoryId: 'sample-desserts', name: 'Espresso Affogato', description: 'Vanilla bean gelato, double shot, amaretti', price: 9, diet: 'veg' },
];

/**
 * Returns a synthetic menu that uses the provided restaurant so the
 * preview reflects the user's actual name + currency.
 */
export function sampleMenuFor(restaurant: Restaurant): Menu {
  const items: MenuItem[] = SAMPLE_ITEMS.map((seed, idx) => ({
    id: `sample-${idx}`,
    categoryId: seed.categoryId,
    name: seed.name,
    description: seed.description,
    price: seed.price,
    diet: seed.diet,
    available: true,
    order: idx,
  }));
  return {
    version: 2,
    restaurant,
    categories: SAMPLE_CATEGORIES,
    items,
    favoriteTemplates: [],
    recentTemplates: [],
    onboardingComplete: false,
    updatedAt: new Date().toISOString(),
  };
}

/** Returns the user's menu when it has content, otherwise a populated sample. */
export function previewMenuOrSample(menu: Menu): Menu {
  return menu.items.length > 0 ? menu : sampleMenuFor(menu.restaurant);
}
