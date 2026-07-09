import { Image, StyleSheet, Text, View } from 'react-native';

import { DietDot } from '@/features/templates/components/diet-dot';
import type { FoodCardProps } from '@/features/templates/components/food-card-props';
import { shadowStyleFor } from '@/features/templates/services/shadow';
import { formatPrice } from '@/utils/format';

/** Grid tile — photo on top, condensed name + price below. Designed to pair with
 * a two-column FlatList container. */
export function FoodCardGrid({ item, theme, currency }: FoodCardProps) {
  const isDark = theme.appearance === 'dark';
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
          style={[styles.photo, { borderTopLeftRadius: theme.shape.cardRadius, borderTopRightRadius: theme.shape.cardRadius }]}
        />
      ) : (
        <View
          style={[
            styles.placeholder,
            {
              backgroundColor: theme.colors.surfaceMuted,
              borderTopLeftRadius: theme.shape.cardRadius,
              borderTopRightRadius: theme.shape.cardRadius,
            },
          ]}
        />
      )}
      <View style={styles.body}>
        <View style={styles.dietRow}>
          <DietDot diet={item.diet} theme={theme} size={8} />
        </View>
        <Text
          numberOfLines={2}
          style={{
            color: theme.colors.text,
            fontFamily: theme.fonts.heading,
            fontWeight: theme.typography.headingWeight,
            fontSize: 14 * theme.typography.scale,
            letterSpacing: theme.typography.letterSpacing * 0.3,
          }}>
          {item.name}
        </Text>
        <Text
          style={{
            color: theme.colors.price,
            fontFamily: theme.fonts.price,
            fontWeight: '700',
            fontSize: 14 * theme.typography.scale,
            marginTop: 4,
          }}>
          {formatPrice(item.price, currency)}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: 'hidden',
  },
  photo: { width: '100%', height: 120 },
  placeholder: { width: '100%', height: 100 },
  body: { padding: 12, gap: 2 },
  dietRow: { marginBottom: 4 },
});
