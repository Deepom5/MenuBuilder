import { Image, StyleSheet, Text, View } from 'react-native';

import { DietDot } from '@/features/templates/components/diet-dot';
import type { FoodCardProps } from '@/features/templates/components/food-card-props';
import { paddingForDensity } from '@/features/templates/services/resolve-theme';
import { shadowStyleFor } from '@/features/templates/services/shadow';
import { formatPrice } from '@/utils/format';

/** Horizontal card: small square photo on the left, content fills the rest. */
export function FoodCardSideImage({ item, theme, currency }: FoodCardProps) {
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
          padding,
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
            { backgroundColor: theme.colors.surfaceMuted, borderRadius: theme.shape.imageRadius },
          ]}
        />
      )}
      <View style={styles.body}>
        <View style={styles.headRow}>
          <Text
            numberOfLines={2}
            style={[
              styles.name,
              {
                color: theme.colors.text,
                fontFamily: theme.fonts.heading,
                fontWeight: theme.typography.headingWeight,
                fontSize: 16 * theme.typography.scale,
              },
            ]}>
            {item.name}
          </Text>
          <DietDot diet={item.diet} theme={theme} />
        </View>
        {item.description ? (
          <Text
            numberOfLines={2}
            style={{
              color: theme.colors.textMuted,
              fontFamily: theme.fonts.body,
              fontSize: 13 * theme.typography.scale,
            }}>
            {item.description}
          </Text>
        ) : null}
        <Text
          style={{
            color: theme.colors.price,
            fontFamily: theme.fonts.price,
            fontWeight: '700',
            fontSize: 15 * theme.typography.scale,
          }}>
          {formatPrice(item.price, currency)}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    gap: 12,
    borderWidth: StyleSheet.hairlineWidth,
  },
  photo: { width: 84, height: 84 },
  photoPlaceholder: { width: 84, height: 84 },
  body: { flex: 1, gap: 4 },
  headRow: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 },
  name: { flex: 1 },
});
