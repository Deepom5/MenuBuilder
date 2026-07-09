import type { TemplateConfig } from '@/features/templates/types/template';

const DIET = { veg: '#2E7D32', nonveg: '#B71C1C', vegan: '#558B2F' };

const config: TemplateConfig = {
  id: 'indian-heritage',
  name: 'Indian Heritage',
  category: 'Indian',
  tags: ['indian', 'traditional', 'spice', 'curry', 'south-indian', 'north-indian'],
  description: 'Saffron and maroon palette with regal serifs and decorative category icons.',
  recommendedFor: ['Indian restaurants', 'Curry houses', 'Thali bars'],
  popular: true,
  supportsDarkMode: true,
  colors: {
    light: {
      primary: '#7A1F1F',
      secondary: '#A8763C',
      accent: '#E07A1F',
      accentOn: '#FFFFFF',
      background: '#FFF6E8',
      surface: '#FFEAC9',
      surfaceMuted: '#F5D9A8',
      card: '#FFFBF1',
      border: '#E8C896',
      text: '#3A1606',
      textMuted: '#7A4B2E',
      price: '#7A1F1F',
      ...DIET,
    },
    dark: {
      primary: '#FFCC80',
      secondary: '#D7A678',
      accent: '#FF8C42',
      accentOn: '#1A0A04',
      background: '#1A0A04',
      surface: '#241208',
      surfaceMuted: '#311A0E',
      card: '#23130B',
      border: '#3E2515',
      text: '#FBE7C6',
      textMuted: '#C9A47B',
      price: '#FF8C42',
      ...DIET,
    },
  },
  typography: {
    heading: 'serif',
    body: 'sans',
    price: 'serif',
    scale: 1.02,
    headingWeight: '700',
    letterSpacing: 0.3,
  },
  layout: {
    foodCard: 'grid',
    categoryStyle: 'icons',
    heroStyle: 'banner',
    density: 'comfortable',
    showCover: true,
    showLogo: true,
  },
  shape: { cardRadius: 12, imageRadius: 10, buttonRadius: 8 },
  shadow: 'elevated',
};

export default config;
