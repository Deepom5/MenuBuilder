import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import type { ResolvedTheme } from '@/features/templates/types/template';
import type { Category } from '@/types/menu';

export type CategoryNavProps = Readonly<{
  categories: Category[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  theme: ResolvedTheme;
}>;

export function CategoryNav({ categories, selectedId, onSelect, theme }: CategoryNavProps) {
  if (categories.length === 0) return null;
  const style = theme.layout.categoryStyle;
  if (style === 'pills') return <Pills categories={categories} selectedId={selectedId} onSelect={onSelect} theme={theme} />;
  if (style === 'tabs') return <Tabs categories={categories} selectedId={selectedId} onSelect={onSelect} theme={theme} />;
  if (style === 'icons') return <Icons categories={categories} selectedId={selectedId} onSelect={onSelect} theme={theme} />;
  return <Horizontal categories={categories} selectedId={selectedId} onSelect={onSelect} theme={theme} />;
}

function Pills({ categories, selectedId, onSelect, theme }: CategoryNavProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.scrollPad}>
      {categories.map((c) => {
        const active = c.id === selectedId;
        return (
          <Pressable
            key={c.id}
            onPress={() => onSelect(c.id)}
            style={[
              styles.pill,
              {
                backgroundColor: active ? theme.colors.accent : theme.colors.surface,
                borderColor: active ? theme.colors.accent : theme.colors.border,
                borderRadius: theme.shape.buttonRadius,
              },
            ]}>
            <Text
              style={{
                color: active ? theme.colors.accentOn : theme.colors.text,
                fontFamily: theme.fonts.heading,
                fontWeight: active ? '700' : '500',
                fontSize: 14,
                letterSpacing: theme.typography.letterSpacing * 0.3,
              }}>
              {c.name}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

function Tabs({ categories, selectedId, onSelect, theme }: CategoryNavProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.scrollPad}>
      {categories.map((c) => {
        const active = c.id === selectedId;
        return (
          <Pressable key={c.id} onPress={() => onSelect(c.id)} style={styles.tab}>
            <Text
              style={{
                color: active ? theme.colors.accent : theme.colors.textMuted,
                fontFamily: theme.fonts.heading,
                fontWeight: '700',
                fontSize: 13,
                letterSpacing: 1.5,
                textTransform: 'uppercase',
              }}>
              {c.name}
            </Text>
            <View
              style={{
                height: 2,
                marginTop: 6,
                backgroundColor: active ? theme.colors.accent : 'transparent',
              }}
            />
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

function Horizontal({ categories, selectedId, onSelect, theme }: CategoryNavProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.scrollPad}>
      {categories.map((c, i) => {
        const active = c.id === selectedId;
        return (
          <Pressable
            key={c.id}
            onPress={() => onSelect(c.id)}
            style={styles.linkItem}>
            <Text
              style={{
                color: active ? theme.colors.text : theme.colors.textMuted,
                fontFamily: theme.fonts.heading,
                fontWeight: active ? theme.typography.headingWeight : '400',
                fontSize: 13,
                letterSpacing: 4,
                textTransform: 'uppercase',
              }}>
              {c.name}
            </Text>
            {i < categories.length - 1 ? (
              <Text style={{ color: theme.colors.textMuted, marginHorizontal: 14 }}>·</Text>
            ) : null}
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

function Icons({ categories, selectedId, onSelect, theme }: CategoryNavProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.scrollPad}>
      {categories.map((c) => {
        const active = c.id === selectedId;
        return (
          <Pressable key={c.id} onPress={() => onSelect(c.id)} style={styles.iconCard}>
            <View
              style={[
                styles.iconBubble,
                {
                  backgroundColor: active ? theme.colors.accent : theme.colors.surface,
                  borderColor: active ? theme.colors.accent : theme.colors.border,
                  borderRadius: theme.shape.cardRadius,
                },
              ]}>
              <Text style={{ fontSize: 22 }}>{c.icon || iconForName(c.name)}</Text>
            </View>
            <Text
              style={{
                color: active ? theme.colors.text : theme.colors.textMuted,
                fontFamily: theme.fonts.heading,
                fontSize: 12,
                fontWeight: '600',
                maxWidth: 80,
                textAlign: 'center',
              }}
              numberOfLines={1}>
              {c.name}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

// Tiny heuristic so a freshly added category gets a sensible emoji without
// the user having to pick one. Falls back to a generic dish.
function iconForName(name: string): string {
  const n = name.toLowerCase();
  if (n.includes('drink') || n.includes('beverage')) return '🥤';
  if (n.includes('dessert') || n.includes('sweet')) return '🍰';
  if (n.includes('pizza')) return '🍕';
  if (n.includes('burger')) return '🍔';
  if (n.includes('salad')) return '🥗';
  if (n.includes('soup')) return '🍲';
  if (n.includes('breakfast')) return '🥐';
  if (n.includes('coffee') || n.includes('tea')) return '☕';
  if (n.includes('starter') || n.includes('appet')) return '🥟';
  if (n.includes('main')) return '🍛';
  if (n.includes('side')) return '🍟';
  return '🍽️';
}

const styles = StyleSheet.create({
  scrollPad: { gap: 8, paddingHorizontal: 16, paddingVertical: 8, alignItems: 'center' },
  pill: { paddingHorizontal: 14, paddingVertical: 8, borderWidth: StyleSheet.hairlineWidth },
  tab: { alignItems: 'center', paddingHorizontal: 4 },
  linkItem: { flexDirection: 'row', alignItems: 'center' },
  iconCard: { alignItems: 'center', gap: 6, width: 84 },
  iconBubble: {
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: StyleSheet.hairlineWidth,
  },
});
