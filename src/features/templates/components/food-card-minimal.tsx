import { StyleSheet, Text, View } from 'react-native';

import { DietDot } from '@/features/templates/components/diet-dot';
import type { FoodCardProps } from '@/features/templates/components/food-card-props';
import { formatPrice } from '@/utils/format';

/** Editorial minimal layout — name dot-leadered to its price. */
export function FoodCardMinimal({ item, theme, currency }: FoodCardProps) {
  return (
    <View style={styles.wrap}>
      <View style={styles.row}>
        <Text
          numberOfLines={1}
          style={[
            styles.name,
            {
              color: theme.colors.text,
              fontFamily: theme.fonts.heading,
              fontWeight: theme.typography.headingWeight,
              fontSize: 16 * theme.typography.scale,
              letterSpacing: theme.typography.letterSpacing * 0.5,
            },
          ]}>
          {item.name}
        </Text>
        <View style={[styles.leader, { borderBottomColor: theme.colors.border }]} />
        <Text
          style={{
            color: theme.colors.price,
            fontFamily: theme.fonts.price,
            fontSize: 16 * theme.typography.scale,
          }}>
          {formatPrice(item.price, currency)}
        </Text>
      </View>
      {item.description ? (
        <Text
          style={{
            color: theme.colors.textMuted,
            fontFamily: theme.fonts.body,
            fontSize: 13 * theme.typography.scale,
            fontStyle: 'italic',
            marginTop: 4,
            paddingRight: 60,
          }}>
          {item.description}
        </Text>
      ) : null}
      <View style={{ marginTop: 6 }}>
        <DietDot diet={item.diet} theme={theme} size={8} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { paddingVertical: 14 },
  row: { flexDirection: 'row', alignItems: 'baseline', gap: 8 },
  name: { maxWidth: '60%' },
  leader: { flex: 1, borderBottomWidth: StyleSheet.hairlineWidth, marginBottom: 4 },
});
