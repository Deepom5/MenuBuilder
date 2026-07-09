import { useMemo, useState } from 'react';
import {
    FlatList,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';

import { useMenuTheme } from '@/context/theme-context';
import { TemplateCard } from '@/features/templates/components/template-card';
import {
    filterTemplates,
    listTemplateCategories,
    TEMPLATES,
} from '@/features/templates/configs';
import type { TemplateConfig } from '@/features/templates/types/template';

export type TemplateGalleryViewProps = Readonly<{
  selectedId?: string;
  favorites: string[];
  recents: string[];
  onPreview: (template: TemplateConfig) => void;
  onToggleFavorite?: (template: TemplateConfig) => void;
}>;

/**
 * Filterable template grid: search box, category chips, optional Favorites
 * and Recents sections at the top. Used by both the onboarding gallery and
 * the post-onboarding `/gallery` modal so behaviour stays identical.
 */
export function TemplateGalleryView({
  selectedId,
  favorites,
  recents,
  onPreview,
  onToggleFavorite,
}: TemplateGalleryViewProps) {
  const { colors } = useMenuTheme();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<string>('All');
  const [popularOnly, setPopularOnly] = useState(false);

  const cats = useMemo(() => listTemplateCategories(), []);
  const results = useMemo(
    () => filterTemplates({ query, category, popularOnly }),
    [query, category, popularOnly],
  );

  const favoriteTemplates = TEMPLATES.filter((t) => favorites.includes(t.id));
  const recentTemplates = recents
    .map((id) => TEMPLATES.find((t) => t.id === id))
    .filter((t): t is TemplateConfig => Boolean(t));

  const showCollections = !query && category === 'All' && !popularOnly;

  return (
    <FlatList
      keyboardShouldPersistTaps="handled"
      data={results}
      keyExtractor={(t) => t.id}
      numColumns={1}
      contentContainerStyle={styles.list}
      ListHeaderComponent={
        <View style={{ gap: 16 }}>
          <View
            style={[
              styles.search,
              { backgroundColor: colors.surface, borderColor: colors.border },
            ]}>
            <Text style={{ color: colors.textMuted, fontSize: 16 }}>⌕</Text>
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="Search templates, cuisines, styles"
              placeholderTextColor={colors.textMuted}
              style={{ flex: 1, color: colors.text, fontSize: 15 }}
              returnKeyType="search"
            />
          </View>

          <FlatList
            horizontal
            data={cats}
            keyExtractor={(c) => c}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 8, paddingRight: 16 }}
            renderItem={({ item }) => {
              const active = item === category;
              return (
                <Pressable
                  onPress={() => setCategory(item)}
                  style={[
                    styles.chip,
                    {
                      backgroundColor: active ? colors.accent : colors.surface,
                      borderColor: active ? colors.accent : colors.border,
                    },
                  ]}>
                  <Text
                    style={{
                      color: active ? colors.accentOn : colors.text,
                      fontWeight: active ? '700' : '500',
                      fontSize: 13,
                    }}>
                    {item}
                  </Text>
                </Pressable>
              );
            }}
          />

          <Pressable
            onPress={() => setPopularOnly((v) => !v)}
            style={{ alignSelf: 'flex-start' }}>
            <Text
              style={{
                color: popularOnly ? colors.accent : colors.textMuted,
                fontWeight: '600',
                fontSize: 12,
                letterSpacing: 0.4,
              }}>
              {popularOnly ? '★ POPULAR ONLY' : '☆ POPULAR ONLY'}
            </Text>
          </Pressable>

          {showCollections && favoriteTemplates.length > 0 ? (
            <Collection
              title="FAVOURITES"
              templates={favoriteTemplates}
              selectedId={selectedId}
              favorites={favorites}
              onPreview={onPreview}
              onToggleFavorite={onToggleFavorite}
            />
          ) : null}

          {showCollections && recentTemplates.length > 0 ? (
            <Collection
              title="RECENT"
              templates={recentTemplates}
              selectedId={selectedId}
              favorites={favorites}
              onPreview={onPreview}
              onToggleFavorite={onToggleFavorite}
            />
          ) : null}

          {showCollections ? (
            <Text
              style={{
                color: colors.textMuted,
                fontSize: 11,
                fontWeight: '700',
                letterSpacing: 1,
                marginTop: 8,
              }}>
              ALL TEMPLATES
            </Text>
          ) : null}
        </View>
      }
      renderItem={({ item }) => (
        <View style={{ marginTop: 12 }}>
          <TemplateCard
            template={item}
            selected={item.id === selectedId}
            favorite={favorites.includes(item.id)}
            onPress={() => onPreview(item)}
            onToggleFavorite={onToggleFavorite ? () => onToggleFavorite(item) : undefined}
          />
        </View>
      )}
      ListEmptyComponent={
        <View style={{ padding: 32, alignItems: 'center' }}>
          <Text style={{ color: colors.textMuted }}>No templates match your filters.</Text>
        </View>
      }
    />
  );
}

function Collection({
  title,
  templates,
  selectedId,
  favorites,
  onPreview,
  onToggleFavorite,
}: Readonly<{
  title: string;
  templates: TemplateConfig[];
  selectedId?: string;
  favorites: string[];
  onPreview: (t: TemplateConfig) => void;
  onToggleFavorite?: (t: TemplateConfig) => void;
}>) {
  const { colors } = useMenuTheme();
  return (
    <View style={{ gap: 8 }}>
      <Text
        style={{
          color: colors.textMuted,
          fontSize: 11,
          fontWeight: '700',
          letterSpacing: 1,
        }}>
        {title}
      </Text>
      <FlatList
        horizontal
        data={templates}
        keyExtractor={(t) => `${title}-${t.id}`}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 12 }}
        renderItem={({ item }) => (
          <View style={{ width: 260 }}>
            <TemplateCard
              template={item}
              selected={item.id === selectedId}
              favorite={favorites.includes(item.id)}
              onPress={() => onPreview(item)}
              onToggleFavorite={onToggleFavorite ? () => onToggleFavorite(item) : undefined}
            />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  list: { padding: 16, gap: 12, paddingBottom: 48 },
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 12,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: StyleSheet.hairlineWidth,
  },
});
