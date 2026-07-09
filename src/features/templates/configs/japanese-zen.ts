import type { TemplateConfig } from '@/features/templates/types/template';

const DIET = { veg: '#558B2F', nonveg: '#8B2D1F', vegan: '#689F38' };

const config: TemplateConfig = {
  id: 'japanese-zen',
  name: 'Japanese Zen',
  category: 'Japanese',
  tags: ['japanese', 'minimal', 'zen', 'sushi', 'ramen', 'monochrome'],
  description: 'Off-white paper, thin black rules and quiet typography. Deliberate negative space.',
  recommendedFor: ['Sushi bars', 'Ramen shops', 'Izakaya'],
  supportsDarkMode: true,
  colors: {
    light: {
      primary: '#0A0A0A',
      secondary: '#4A4A4A',
      accent: '#B91C1C',
      accentOn: '#FAFAF7',
      background: '#FAFAF7',
      surface: '#F2F1ED',
      surfaceMuted: '#E7E5E0',
      card: '#FFFFFF',
      border: '#1F1F1F',
      text: '#0A0A0A',
      textMuted: '#5C5C5C',
      price: '#0A0A0A',
      ...DIET,
    },
    dark: {
      primary: '#F5F4EF',
      secondary: '#A6A39C',
      accent: '#E11D48',
      accentOn: '#0A0A0A',
      background: '#0A0A0A',
      surface: '#141414',
      surfaceMuted: '#1B1B1B',
      card: '#121212',
      border: '#262626',
      text: '#F5F4EF',
      textMuted: '#9C9994',
      price: '#F5F4EF',
      ...DIET,
    },
  },
  typography: {
    heading: 'sans',
    body: 'sans',
    price: 'serif',
    scale: 0.95,
    headingWeight: '400',
    letterSpacing: 4,
  },
  layout: {
    foodCard: 'compact',
    categoryStyle: 'horizontal',
    heroStyle: 'minimal',
    density: 'spacious',
    showCover: false,
    showLogo: false,
  },
  shape: { cardRadius: 0, imageRadius: 0, buttonRadius: 0 },
  shadow: 'none',
};

export default config;
