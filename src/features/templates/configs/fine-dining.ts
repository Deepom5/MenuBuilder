import type { TemplateConfig } from '@/features/templates/types/template';

const DIET = { veg: '#43A047', nonveg: '#8E2A1F', vegan: '#558B2F' };

const config: TemplateConfig = {
  id: 'fine-dining',
  name: 'Fine Dining',
  category: 'Fine Dining',
  tags: ['fine-dining', 'elegant', 'minimal', 'refined', 'serif'],
  description: 'Restrained navy on warm cream. Confident typography, no photography clutter.',
  recommendedFor: ['Tasting menus', 'Chefs counters', 'White tablecloth'],
  popular: true,
  supportsDarkMode: true,
  colors: {
    light: {
      primary: '#1B2A4A',
      secondary: '#445072',
      accent: '#1B2A4A',
      accentOn: '#F8F4EA',
      background: '#F8F4EA',
      surface: '#F0EADD',
      surfaceMuted: '#E5DDCB',
      card: '#FCFAF3',
      border: '#D9D1BD',
      text: '#1B2A4A',
      textMuted: '#5C6280',
      price: '#1B2A4A',
      ...DIET,
    },
    dark: {
      primary: '#E5DCC6',
      secondary: '#B5AC95',
      accent: '#E5DCC6',
      accentOn: '#0C1224',
      background: '#0C1224',
      surface: '#141B33',
      surfaceMuted: '#1B233F',
      card: '#141B33',
      border: '#26304A',
      text: '#EFE6CF',
      textMuted: '#9590AB',
      price: '#E5DCC6',
      ...DIET,
    },
  },
  typography: {
    heading: 'serif',
    body: 'serif',
    price: 'serif',
    scale: 1.05,
    headingWeight: '400',
    letterSpacing: 2,
  },
  layout: {
    foodCard: 'minimal',
    categoryStyle: 'tabs',
    heroStyle: 'minimal',
    density: 'spacious',
    showCover: false,
    showLogo: true,
  },
  shape: { cardRadius: 0, imageRadius: 0, buttonRadius: 0 },
  shadow: 'none',
};

export default config;
