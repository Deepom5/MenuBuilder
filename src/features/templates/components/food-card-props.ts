import type { ResolvedTheme } from '@/features/templates/types/template';
import type { MenuItem } from '@/types/menu';

/** Props every food-card variant accepts so we can swap layouts freely. */
export type FoodCardProps = Readonly<{
  item: MenuItem;
  theme: ResolvedTheme;
  currency: string;
}>;
