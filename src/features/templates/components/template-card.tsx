import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useMenuTheme } from '@/context/theme-context';
import { fontFamilyFor } from '@/features/templates/services/fonts';
import { shadowStyleFor } from '@/features/templates/services/shadow';
import type { TemplateConfig } from '@/features/templates/types/template';

export type TemplateCardProps = Readonly<{
  template: TemplateConfig;
  selected?: boolean;
  favorite?: boolean;
  onPress: () => void;
  onToggleFavorite?: () => void;
}>;

/**
 * Gallery card that previews a template at a glance: colour swatches, a
 * mini typography sample, the food-card layout it uses, and badges for
 * light/dark support, "popular" and "new" status.
 */
export function TemplateCard({
  template,
  selected,
  favorite,
  onPress,
  onToggleFavorite,
}: TemplateCardProps) {
  const { colors: appColors } = useMenuTheme();
  const preview = template.colors.light;
  const headingFont = fontFamilyFor(template.typography.heading);

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.card,
        {
          backgroundColor: appColors.card,
          borderColor: selected ? appColors.accent : appColors.border,
          borderWidth: selected ? 2 : StyleSheet.hairlineWidth,
        },
        shadowStyleFor('soft', appColors.background.length === 0),
      ]}>
      {/* Mini preview pane painted in the template's own colour scheme. */}
      <View
        style={[
          styles.preview,
          { backgroundColor: preview.background, borderColor: preview.border },
        ]}>
        <View style={styles.previewRow}>
          <Text
            numberOfLines={1}
            style={{
              color: preview.text,
              fontFamily: headingFont,
              fontWeight: template.typography.headingWeight,
              fontSize: 18,
              letterSpacing: template.typography.letterSpacing * 0.4,
            }}>
            Aa Menu
          </Text>
          <Text
            style={{
              color: preview.price,
              fontFamily: fontFamilyFor(template.typography.price),
              fontWeight: '700',
              fontSize: 14,
            }}>
            $14
          </Text>
        </View>
        <View
          style={[
            styles.previewBar,
            { backgroundColor: preview.accent, opacity: 0.9 },
          ]}
        />
        <View style={styles.swatchRow}>
          <Swatch color={preview.primary} />
          <Swatch color={preview.accent} />
          <Swatch color={preview.surface} />
          <Swatch color={preview.background} bordered />
        </View>
        <View style={styles.layoutHintRow}>
          <Pill text={layoutLabel(template.layout.foodCard)} color={preview.textMuted} />
          <Pill text={categoryLabel(template.layout.categoryStyle)} color={preview.textMuted} />
        </View>
      </View>

      <View style={styles.meta}>
        <View style={styles.metaTop}>
          <View style={{ flex: 1 }}>
            <Text
              style={{
                color: appColors.text,
                fontFamily: headingFont,
                fontWeight: '700',
                fontSize: 16,
              }}>
              {template.name}
            </Text>
            <Text style={{ color: appColors.textMuted, fontSize: 12, marginTop: 2 }}>
              {template.category} · {template.recommendedFor[0] ?? template.tags[0]}
            </Text>
          </View>
          {onToggleFavorite ? (
            <Pressable onPress={onToggleFavorite} hitSlop={10} accessibilityLabel="Toggle favorite">
              <Text style={{ fontSize: 22 }}>{favorite ? '♥' : '♡'}</Text>
            </Pressable>
          ) : null}
        </View>
        <Text
          numberOfLines={2}
          style={{ color: appColors.textMuted, fontSize: 12, marginTop: 6 }}>
          {template.description}
        </Text>
        <View style={styles.badges}>
          {template.popular ? <Badge text="POPULAR" color={appColors.accent} /> : null}
          {template.isNew ? <Badge text="NEW" color={appColors.primary} /> : null}
          <Badge
            text={template.supportsDarkMode ? 'LIGHT · DARK' : 'LIGHT'}
            color={appColors.textMuted}
          />
        </View>
      </View>
    </Pressable>
  );
}

function Swatch({ color, bordered }: Readonly<{ color: string; bordered?: boolean }>) {
  return (
    <View
      style={[
        styles.swatch,
        { backgroundColor: color, borderColor: bordered ? '#0002' : 'transparent' },
      ]}
    />
  );
}

function Pill({ text, color }: Readonly<{ text: string; color: string }>) {
  return (
    <View style={[styles.pill, { borderColor: color }]}>
      <Text style={{ color, fontSize: 9, fontWeight: '700', letterSpacing: 0.6 }}>{text}</Text>
    </View>
  );
}

function Badge({ text, color }: Readonly<{ text: string; color: string }>) {
  return (
    <View style={[styles.badge, { borderColor: color }]}>
      <Text style={{ color, fontSize: 9, fontWeight: '700', letterSpacing: 0.6 }}>{text}</Text>
    </View>
  );
}

function layoutLabel(layout: string): string {
  if (layout === 'large-image') return 'PHOTO CARDS';
  if (layout === 'side-image') return 'LIST · PHOTO';
  if (layout === 'compact') return 'TEXT LIST';
  if (layout === 'minimal') return 'EDITORIAL';
  return 'GRID';
}

function categoryLabel(style: string): string {
  if (style === 'pills') return 'PILL TABS';
  if (style === 'tabs') return 'UNDERLINE';
  if (style === 'icons') return 'ICONS';
  return 'INLINE';
}

const styles = StyleSheet.create({
  card: { borderRadius: 18, overflow: 'hidden' },
  preview: {
    padding: 14,
    gap: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  previewRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' },
  previewBar: { height: 2, width: 28, borderRadius: 1 },
  swatchRow: { flexDirection: 'row', gap: 8 },
  swatch: { width: 18, height: 18, borderRadius: 4, borderWidth: StyleSheet.hairlineWidth },
  layoutHintRow: { flexDirection: 'row', gap: 6, flexWrap: 'wrap' },
  pill: {
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 4,
    borderWidth: StyleSheet.hairlineWidth,
  },
  meta: { padding: 14, gap: 4 },
  metaTop: { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
  badges: { flexDirection: 'row', gap: 6, marginTop: 8, flexWrap: 'wrap' },
  badge: {
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 4,
    borderWidth: StyleSheet.hairlineWidth,
  },
});
