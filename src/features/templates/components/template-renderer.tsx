import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { CategoryNav } from '@/features/templates/components/category-nav';
import { FoodCardCompact } from '@/features/templates/components/food-card-compact';
import { FoodCardGrid } from '@/features/templates/components/food-card-grid';
import { FoodCardLargeImage } from '@/features/templates/components/food-card-large-image';
import { FoodCardMinimal } from '@/features/templates/components/food-card-minimal';
import { FoodCardSideImage } from '@/features/templates/components/food-card-side-image';
import { TemplateHero } from '@/features/templates/components/template-hero';
import {
    gapForDensity,
    paddingForDensity,
} from '@/features/templates/services/resolve-theme';
import type {
    FoodCardLayout,
    ResolvedTheme,
} from '@/features/templates/types/template';
import type { Category, Menu, MenuItem } from '@/types/menu';

export type TemplateRendererProps = Readonly<{
  menu: Menu;
  theme: ResolvedTheme;
  /** When true, hide items marked unavailable. Default true for customer view. */
  onlyAvailable?: boolean;
}>;

/**
 * Renders the customer-facing menu by combining the resolved theme with
 * the chosen food-card and category-nav variants. Everything visual flows
 * through this single component so previews, the tab view, and the gallery
 * preview can share one rendering path.
 */
export function TemplateRenderer({ menu, theme, onlyAvailable = true }: TemplateRendererProps) {
  const { categories, items, restaurant } = menu;

  const sortedCategories = useMemo(
    () => [...categories].sort((a, b) => a.order - b.order),
    [categories],
  );

  const itemsForCategory = (id: string): MenuItem[] => {
    const filtered = items
      .filter((i) => i.categoryId === id && (!onlyAvailable || i.available));
    return [...filtered].sort((a, b) => a.order - b.order);
  };

  const visibleCategories = useMemo(
    () => sortedCategories.filter((c) => itemsForCategory(c.id).length > 0),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [sortedCategories, items, onlyAvailable],
  );

  const [selectedId, setSelectedId] = useState<string | null>(null);
  // When a category is selected, scroll-to filter view. Default: show all.
  const renderedCategories = selectedId
    ? visibleCategories.filter((c) => c.id === selectedId)
    : visibleCategories;

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}>
        <TemplateHero restaurant={restaurant} theme={theme} />

        {visibleCategories.length > 1 ? (
          <View style={styles.nav}>
            <CategoryNav
              categories={[
                { id: '__all', name: 'All', order: -1 } as Category,
                ...visibleCategories,
              ]}
              selectedId={selectedId ?? '__all'}
              onSelect={(id) => setSelectedId(id === '__all' ? null : id)}
              theme={theme}
            />
          </View>
        ) : null}

        {renderedCategories.length === 0 ? (
          <View style={styles.empty}>
            <Text
              style={{
                color: theme.colors.textMuted,
                fontFamily: theme.fonts.body,
                fontSize: 14,
                textAlign: 'center',
              }}>
              No items to show yet. Add some from the Builder tab.
            </Text>
          </View>
        ) : (
          renderedCategories.map((c) => (
            <CategorySection
              key={c.id}
              category={c}
              items={itemsForCategory(c.id)}
              theme={theme}
              currency={restaurant.currency}
            />
          ))
        )}
      </ScrollView>
    </View>
  );
}

function CategorySection({
  category,
  items,
  theme,
  currency,
}: Readonly<{
  category: Category;
  items: MenuItem[];
  theme: ResolvedTheme;
  currency: string;
}>) {
  const padding = paddingForDensity(theme.layout.density);
  const gap = gapForDensity(theme.layout.density);
  return (
    <View style={{ marginTop: 24, paddingHorizontal: padding }}>
      <View style={styles.sectionHead}>
        <Text
          style={{
            color: theme.colors.accent,
            fontFamily: theme.fonts.heading,
            fontWeight: theme.typography.headingWeight,
            fontSize: 13,
            letterSpacing: 2,
            textTransform: 'uppercase',
          }}>
          {category.name}
        </Text>
        <View style={[styles.rule, { backgroundColor: theme.colors.border }]} />
      </View>
      <ItemsList items={items} theme={theme} currency={currency} gap={gap} />
    </View>
  );
}

function ItemsList({
  items,
  theme,
  currency,
  gap,
}: Readonly<{
  items: MenuItem[];
  theme: ResolvedTheme;
  currency: string;
  gap: number;
}>) {
  const layout = theme.layout.foodCard;
  if (layout === 'grid') {
    return (
      <View style={[styles.grid, { gap }]}>
        {items.map((item) => (
          <View key={item.id} style={styles.gridCell}>
            <FoodCardGrid item={item} theme={theme} currency={currency} />
          </View>
        ))}
      </View>
    );
  }
  return (
    <View style={{ gap, marginTop: 12 }}>
      {items.map((item) => (
        <CardFor key={item.id} layout={layout} item={item} theme={theme} currency={currency} />
      ))}
    </View>
  );
}

function CardFor({
  layout,
  item,
  theme,
  currency,
}: Readonly<{
  layout: FoodCardLayout;
  item: MenuItem;
  theme: ResolvedTheme;
  currency: string;
}>) {
  if (layout === 'large-image') return <FoodCardLargeImage item={item} theme={theme} currency={currency} />;
  if (layout === 'side-image') return <FoodCardSideImage item={item} theme={theme} currency={currency} />;
  if (layout === 'compact') return <FoodCardCompact item={item} theme={theme} currency={currency} />;
  if (layout === 'minimal') return <FoodCardMinimal item={item} theme={theme} currency={currency} />;
  return <FoodCardLargeImage item={item} theme={theme} currency={currency} />;
}

const styles = StyleSheet.create({
  scroll: { paddingBottom: 48 },
  nav: { paddingVertical: 8 },
  empty: { padding: 32, alignItems: 'center' },
  sectionHead: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 8 },
  rule: { flex: 1, height: StyleSheet.hairlineWidth },
  grid: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 12 },
  gridCell: { width: '48%' },
});
