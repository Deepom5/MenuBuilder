import { StyleSheet, Text, View } from 'react-native';

import { DietDot } from '@/features/templates/components/diet-dot';
import type { FoodCardProps } from '@/features/templates/components/food-card-props';
import { formatPrice } from '@/utils/format';

/** Text-only compact row — every dish on one line with the price aligned right. */
export function FoodCardCompact({ item, theme, currency }: FoodCardProps) {
  return (
    <View style={[styles.row, { borderBottomColor: theme.colors.border }]}>
      <View style={styles.left}>
        <View style={styles.titleRow}>
          <DietDot diet={item.diet} theme={theme} size={8} />
          <Text
            numberOfLines={1}
            style={{
              flex: 1,
              color: theme.colors.text,
              fontFamily: theme.fonts.heading,
              fontWeight: theme.typography.headingWeight,
              fontSize: 15 * theme.typography.scale,
              letterSpacing: theme.typography.letterSpacing * 0.3,
            }}>
            {item.name}
          </Text>
        </View>
        {item.description ? (
          <Text
            numberOfLines={1}
            style={{
              color: theme.colors.textMuted,
              fontFamily: theme.fonts.body,
              fontSize: 12 * theme.typography.scale,
              marginTop: 2,
              marginLeft: 14,
            }}>
            {item.description}
          </Text>
        ) : null}
      </View>
      <Text
        style={{
          color: theme.colors.price,
          fontFamily: theme.fonts.price,
          fontWeight: '600',
          fontSize: 15 * theme.typography.scale,
        }}>
        {formatPrice(item.price, currency)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  left: { flex: 1 },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
});
