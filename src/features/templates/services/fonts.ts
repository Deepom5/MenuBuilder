import { Platform } from 'react-native';

import type { FontFamilyKey } from '@/features/templates/types/template';

/**
 * Maps the abstract font family key used in template configs to a concrete
 * platform font. We rely on platform default fonts only — no custom font
 * loading required, so templates work everywhere with no setup cost.
 */
export function fontFamilyFor(key: FontFamilyKey): string {
  if (Platform.OS === 'ios') {
    switch (key) {
      case 'sans':
        return 'System';
      case 'serif':
        return 'Georgia';
      case 'rounded':
        return 'Avenir Next Rounded';
      case 'mono':
        return 'Menlo';
    }
  }
  if (Platform.OS === 'android') {
    switch (key) {
      case 'sans':
        return 'sans-serif';
      case 'serif':
        return 'serif';
      case 'rounded':
        return 'sans-serif-medium';
      case 'mono':
        return 'monospace';
    }
  }
  switch (key) {
    case 'sans':
      return 'system-ui, -apple-system, Segoe UI, Roboto, sans-serif';
    case 'serif':
      return 'Georgia, "Times New Roman", serif';
    case 'rounded':
      return '"SF Pro Rounded", "Avenir Next Rounded", system-ui, sans-serif';
    case 'mono':
      return 'ui-monospace, Menlo, monospace';
  }
}
