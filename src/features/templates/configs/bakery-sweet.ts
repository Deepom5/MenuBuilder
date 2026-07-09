import type { TemplateConfig } from '@/features/templates/types/template';

const DIET = { veg: '#66BB6A', nonveg: '#E57373', vegan: '#9CCC65' };

const config: TemplateConfig = {
  id: 'bakery-sweet',
  name: 'Bakery Sweet',
  category: 'Bakery',
  tags: ['bakery', 'dessert', 'pastry', 'pastel', 'playful', 'pink'],
  description: 'Soft pastel pink with sugary rounded type. Made for pâtisseries and dessert bars.',
  recommendedFor: ['Bakeries', 'Pâtisseries', 'Dessert shops'],
  isNew: true,
  supportsDarkMode: true,
  colors: {
    light: {
      primary: '#C2185B',
      secondary: '#E89AB3',
      accent: '#D63384',
      accentOn: '#FFFFFF',
      background: '#FFF5F8',
      surface: '#FCE4EC',
      surfaceMuted: '#F8C8D7',
      card: '#FFFFFF',
      border: '#F0BFD0',
      text: '#3A0F1B',
      textMuted: '#7C3E50',
      price: '#C2185B',
      ...DIET,
    },
    dark: {
      primary: '#F8BBD0',
      secondary: '#C29AAB',
      accent: '#F48FB1',
      accentOn: '#1B0810',
      background: '#1B0810',
      surface: '#260F18',
      surfaceMuted: '#321623',
      card: '#250E17',
      border: '#3A1B2A',
      text: '#FCE4EC',
      textMuted: '#C29AAB',
      price: '#F48FB1',
      ...DIET,
    },
  },
  typography: {
    heading: 'rounded',
    body: 'rounded',
    price: 'rounded',
    scale: 1,
    headingWeight: '800',
    letterSpacing: -0.3,
  },
  layout: {
    foodCard: 'grid',
    categoryStyle: 'pills',
    heroStyle: 'centered',
    density: 'comfortable',
    showCover: true,
    showLogo: true,
  },
  shape: { cardRadius: 22, imageRadius: 18, buttonRadius: 999 },
  shadow: 'soft',
};

export default config;
