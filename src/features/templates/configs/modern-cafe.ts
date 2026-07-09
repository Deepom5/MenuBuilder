import type { TemplateConfig } from '@/features/templates/types/template';

const DIET = { veg: '#43A047', nonveg: '#D84315', vegan: '#7CB342' };

const config: TemplateConfig = {
  id: 'modern-cafe',
  name: 'Modern Café',
  category: 'Café',
  tags: ['cafe', 'coffee', 'warm', 'friendly', 'rounded'],
  description: 'Warm cream backdrop, friendly rounded type and roasted-coffee accents.',
  recommendedFor: ['Cafés', 'Coffee shops', 'Brunch spots'],
  popular: true,
  supportsDarkMode: true,
  colors: {
    light: {
      primary: '#3D2A1E',
      secondary: '#7A5A3D',
      accent: '#B85C2E',
      accentOn: '#FFFFFF',
      background: '#FBF6EE',
      surface: '#F4ECDF',
      surfaceMuted: '#E9DCC4',
      card: '#FFFDF8',
      border: '#E2D2B5',
      text: '#3B2410',
      textMuted: '#806750',
      price: '#B85C2E',
      ...DIET,
    },
    dark: {
      primary: '#FBE9D9',
      secondary: '#C5A98E',
      accent: '#E59055',
      accentOn: '#1F1612',
      background: '#1F1612',
      surface: '#2A1F18',
      surfaceMuted: '#372820',
      card: '#291E17',
      border: '#3F2E25',
      text: '#FBE9D9',
      textMuted: '#C5A98E',
      price: '#E59055',
      ...DIET,
    },
  },
  typography: {
    heading: 'rounded',
    body: 'rounded',
    price: 'rounded',
    scale: 1,
    headingWeight: '700',
    letterSpacing: -0.2,
  },
  layout: {
    foodCard: 'side-image',
    categoryStyle: 'horizontal',
    heroStyle: 'split',
    density: 'comfortable',
    showCover: true,
    showLogo: true,
  },
  shape: { cardRadius: 18, imageRadius: 14, buttonRadius: 999 },
  shadow: 'soft',
};

export default config;
