import type { TemplateConfig } from '@/features/templates/types/template';

const DIET = { veg: '#2E7D32', nonveg: '#C62828', vegan: '#558B2F' };

const config: TemplateConfig = {
  id: 'fast-food-express',
  name: 'Fast Food Express',
  category: 'Fast Food',
  tags: ['fast-food', 'burger', 'bold', 'energetic', 'casual'],
  description: 'High-contrast red and yellow with chunky bold sans for quick-service energy.',
  recommendedFor: ['Burger joints', 'Quick service', 'Takeaway'],
  isNew: true,
  supportsDarkMode: true,
  colors: {
    light: {
      primary: '#D7263D',
      secondary: '#FFB400',
      accent: '#D7263D',
      accentOn: '#FFFFFF',
      background: '#FFF8E1',
      surface: '#FFF1B8',
      surfaceMuted: '#FFE583',
      card: '#FFFFFF',
      border: '#F5D77A',
      text: '#1F1305',
      textMuted: '#7A5B23',
      price: '#D7263D',
      ...DIET,
    },
    dark: {
      primary: '#FFB400',
      secondary: '#FFD86B',
      accent: '#FF4A5C',
      accentOn: '#1A0606',
      background: '#1A0606',
      surface: '#250A0B',
      surfaceMuted: '#330F10',
      card: '#220909',
      border: '#3A1819',
      text: '#FFE5A8',
      textMuted: '#C9A050',
      price: '#FFB400',
      ...DIET,
    },
  },
  typography: {
    heading: 'sans',
    body: 'sans',
    price: 'sans',
    scale: 1.1,
    headingWeight: '900',
    letterSpacing: -0.5,
  },
  layout: {
    foodCard: 'large-image',
    categoryStyle: 'pills',
    heroStyle: 'banner',
    density: 'comfortable',
    showCover: true,
    showLogo: true,
  },
  shape: { cardRadius: 20, imageRadius: 16, buttonRadius: 999 },
  shadow: 'soft',
};

export default config;
