import type { TemplateConfig } from '@/features/templates/types/template';

const DIET = { veg: '#558B2F', nonveg: '#B71C1C', vegan: '#689F38' };

const config: TemplateConfig = {
  id: 'pizza-oven',
  name: 'Pizza Oven',
  category: 'Italian',
  tags: ['pizza', 'italian', 'rustic', 'red', 'wood-fired'],
  description: 'Tomato red on warm cream with rustic serifs. Pairs with hand-thrown dough.',
  recommendedFor: ['Pizzerias', 'Italian trattorias', 'Wood-fired ovens'],
  supportsDarkMode: true,
  colors: {
    light: {
      primary: '#B71C1C',
      secondary: '#2E5D3A',
      accent: '#B71C1C',
      accentOn: '#FFFBEC',
      background: '#FFFBEC',
      surface: '#FFF1D6',
      surfaceMuted: '#FBE3B4',
      card: '#FFFEF6',
      border: '#E8D2A0',
      text: '#2A1106',
      textMuted: '#765A36',
      price: '#B71C1C',
      ...DIET,
    },
    dark: {
      primary: '#FFCDD2',
      secondary: '#A5D6A7',
      accent: '#EF5350',
      accentOn: '#190606',
      background: '#190606',
      surface: '#231010',
      surfaceMuted: '#311616',
      card: '#220E0E',
      border: '#3A1C1C',
      text: '#FFE3C4',
      textMuted: '#C9A878',
      price: '#EF5350',
      ...DIET,
    },
  },
  typography: {
    heading: 'serif',
    body: 'sans',
    price: 'serif',
    scale: 1.05,
    headingWeight: '800',
    letterSpacing: 0.5,
  },
  layout: {
    foodCard: 'large-image',
    categoryStyle: 'tabs',
    heroStyle: 'banner',
    density: 'comfortable',
    showCover: true,
    showLogo: true,
  },
  shape: { cardRadius: 8, imageRadius: 6, buttonRadius: 6 },
  shadow: 'elevated',
};

export default config;
