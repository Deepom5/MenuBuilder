import type { ViewStyle } from 'react-native';

import type { ShadowStyle } from '@/features/templates/types/template';

/**
 * Returns RN style props that match the template's chosen shadow weight.
 * Soft = ambient lift; elevated = bold drop shadow; none = flat.
 */
export function shadowStyleFor(level: ShadowStyle, isDark: boolean): ViewStyle {
  if (level === 'none') return {};
  if (level === 'soft') {
    return {
      shadowColor: '#000',
      shadowOpacity: isDark ? 0.4 : 0.06,
      shadowRadius: 10,
      shadowOffset: { width: 0, height: 4 },
      elevation: 2,
    };
  }
  return {
    shadowColor: '#000',
    shadowOpacity: isDark ? 0.5 : 0.12,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  };
}
