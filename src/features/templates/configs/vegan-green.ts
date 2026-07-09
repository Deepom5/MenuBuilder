import type { TemplateConfig } from '@/features/templates/types/template';

const DIET = { veg: '#388E3C', nonveg: '#A04444', vegan: '#558B2F' };

const config: TemplateConfig = {
  id: 'vegan-green',
  name: 'Vegan Green',
  category: 'Vegan',
  tags: ['vegan', 'organic', 'plant-based', 'green', 'healthy'],
  description: 'Sage on cream with leafy rounded type. Plant-forward and unfussy.',
  recommendedFor: ['Vegan kitchens', 'Salad bars', 'Plant-based cafés'],
  isNew: true,
  supportsDarkMode: true,
  colors: {
    light: {
      primary: '#2F5D3A',
      secondary: '#5A8C66',
      accent: '#4F7942',
      accentOn: '#F7F3E8',
      background: '#F7F3E8',
      surface: '#EFE9D5',
      surfaceMuted: '#E3DCC1',
      card: '#FBF8EE',
      border: '#D5CCB0',
      text: '#1F3A24',
      textMuted: '#516B57',
      price: '#2F5D3A',
      ...DIET,
    },
    dark: {
      primary: '#A8D5B5',
      secondary: '#7CB389',
      accent: '#8FBF7A',
      accentOn: '#0F1B12',
      background: '#0F1B12',
      surface: '#162519',
      surfaceMuted: '#1F3324',
      card: '#152418',
      border: '#284432',
      text: '#E5F2E7',
      textMuted: '#9AB6A0',
      price: '#A8D5B5',
      ...DIET,
    },
  },
  typography: {
    heading: 'rounded',
    body: 'rounded',
    price: 'rounded',
    scale: 1,
    headingWeight: '700',
    letterSpacing: -0.1,
  },
  layout: {
    foodCard: 'side-image',
    categoryStyle: 'pills',
    heroStyle: 'split',
    density: 'comfortable',
    showCover: true,
    showLogo: true,
  },
  shape: { cardRadius: 16, imageRadius: 12, buttonRadius: 999 },
  shadow: 'soft',
};

export default config;
