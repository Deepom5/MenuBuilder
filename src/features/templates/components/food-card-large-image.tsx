import { Image, StyleSheet, Text, View } from 'react-native';

import { DietDot } from '@/features/templates/components/diet-dot';
import type { FoodCardProps } from '@/features/templates/components/food-card-props';
import { paddingForDensity } from '@/features/templates/services/resolve-theme';
import { shadowStyleFor } from '@/features/templates/services/shadow';
import { formatPrice } from '@/utils/format';

/** Magazine-style card: hero photo on top, name/description/price stacked below. */
export function FoodCardLargeImage({ item, theme, currency }: FoodCardProps) {
  const isDark = theme.appearance === 'dark';
  const padding = paddingForDensity(theme.layout.density);
  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.colors.card,
          borderColor: theme.colors.border,
          borderRadius: theme.shape.cardRadius,
        },
        shadowStyleFor(theme.shadow, isDark),
      ]}>
      {item.photoUri ? (
        <Image
          source={{ uri: item.photoUri }}
          style={[styles.photo, { borderRadius: theme.shape.imageRadius }]}
        />
      ) : (
        <View
          style={[
            styles.photoPlaceholder,
            {
              backgroundColor: theme.colors.surfaceMuted,
              borderRadius: theme.shape.imageRadius,
            },
          ]}
        />
      )}
      <View style={[styles.body, { padding }]}>
        <View style={styles.headRow}>
          <Text
            numberOfLines={2}
            style={[
              styles.name,
              {
                color: theme.colors.text,
                fontFamily: theme.fonts.heading,
                fontWeight: theme.typography.headingWeight,
                fontSize: 18 * theme.typography.scale,
                letterSpacing: theme.typography.letterSpacing * 0.4,
              },
            ]}>
            {item.name}
          </Text>
          <Text
            style={{
              color: theme.colors.price,
              fontFamily: theme.fonts.price,
              fontWeight: '700',
              fontSize: 16 * theme.typography.scale,
            }}>
            {formatPrice(item.price, currency)}
          </Text>
        </View>
        {item.description ? (
          <Text
            numberOfLines={2}
            style={{
              color: theme.colors.textMuted,
              fontFamily: theme.fonts.body,
              fontSize: 13 * theme.typography.scale,
              marginTop: 4,
            }}>
            {item.description}
          </Text>
        ) : null}
        <View style={styles.metaRow}>
          <DietDot diet={item.diet} theme={theme} withLabel />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: StyleSheet.hairlineWidth,
    overflow: 'hidden',
  },
  photo: { width: '100%', height: 180 },
  photoPlaceholder: { width: '100%', height: 140 },
  body: { gap: 4 },
  headRow: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 },
  name: { flex: 1 },
  metaRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
});
