import type { TemplateConfig } from '@/features/templates/types/template';

const DIET = { veg: '#2E7D32', nonveg: '#C62828', vegan: '#558B2F' };

const config: TemplateConfig = {
  id: 'minimal-white',
  name: 'Minimal White',
  category: 'Minimal',
  tags: ['minimal', 'modern', 'clean', 'cafe', 'bistro'],
  description: 'Bright, airy and disciplined. Lots of whitespace and confident type.',
  recommendedFor: ['Cafés', 'Bistros', 'Modern eateries'],
  popular: true,
  supportsDarkMode: true,
  colors: {
    light: {
      primary: '#0E1116',
      secondary: '#5B616E',
      accent: '#0E1116',
      accentOn: '#FFFFFF',
      background: '#FFFFFF',
      surface: '#F7F7F8',
      surfaceMuted: '#EDEEF1',
      card: '#FFFFFF',
      border: '#E5E7EB',
      text: '#0E1116',
      textMuted: '#6B7280',
      price: '#0E1116',
      ...DIET,
    },
    dark: {
      primary: '#FFFFFF',
      secondary: '#A4ABB8',
      accent: '#FFFFFF',
      accentOn: '#0E1116',
      background: '#0E1116',
      surface: '#161A20',
      surfaceMuted: '#1F242C',
      card: '#161A20',
      border: '#2A2F38',
      text: '#F5F7FA',
      textMuted: '#9BA1AD',
      price: '#FFFFFF',
      ...DIET,
    },
  },
  typography: {
    heading: 'sans',
    body: 'sans',
    price: 'sans',
    scale: 1,
    headingWeight: '700',
    letterSpacing: 0,
  },
  layout: {
    foodCard: 'large-image',
    categoryStyle: 'pills',
    heroStyle: 'centered',
    density: 'comfortable',
    showCover: true,
    showLogo: false,
  },
  shape: { cardRadius: 16, imageRadius: 12, buttonRadius: 999 },
  shadow: 'soft',
};

export default config;
