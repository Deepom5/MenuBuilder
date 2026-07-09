import type { TemplateConfig } from '@/features/templates/types/template';

const DIET = { veg: '#7CB342', nonveg: '#E53935', vegan: '#9CCC65' };

const config: TemplateConfig = {
  id: 'luxury-black',
  name: 'Luxury Black',
  category: 'Fine Dining',
  tags: ['luxury', 'elegant', 'fine-dining', 'premium', 'dark', 'gold'],
  description: 'Deep black canvas with brushed-gold accents and refined serif headlines.',
  recommendedFor: ['Steakhouses', 'Cocktail lounges', 'Premium dining'],
  popular: true,
  supportsDarkMode: true,
  colors: {
    light: {
      primary: '#0B0B0B',
      secondary: '#3A3A3A',
      accent: '#C9A24B',
      accentOn: '#0B0B0B',
      background: '#FAFAF7',
      surface: '#F2F0EA',
      surfaceMuted: '#E6E3DB',
      card: '#FFFFFF',
      border: '#D9D5C9',
      text: '#0B0B0B',
      textMuted: '#5A5A55',
      price: '#C9A24B',
      ...DIET,
    },
    dark: {
      primary: '#FFFFFF',
      secondary: '#B8B5AC',
      accent: '#D4AF63',
      accentOn: '#0B0B0B',
      background: '#0B0B0B',
      surface: '#141414',
      surfaceMuted: '#1C1B19',
      card: '#161514',
      border: '#2A2926',
      text: '#F4F1E8',
      textMuted: '#9C988C',
      price: '#D4AF63',
      ...DIET,
    },
  },
  typography: {
    heading: 'serif',
    body: 'serif',
    price: 'serif',
    scale: 1.05,
    headingWeight: '500',
    letterSpacing: 1.5,
  },
  layout: {
    foodCard: 'large-image',
    categoryStyle: 'tabs',
    heroStyle: 'banner',
    density: 'spacious',
    showCover: true,
    showLogo: true,
  },
  shape: { cardRadius: 4, imageRadius: 2, buttonRadius: 2 },
  shadow: 'elevated',
};

export default config;
