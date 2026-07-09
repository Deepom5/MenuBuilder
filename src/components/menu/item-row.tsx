import { Image } from 'expo-image';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useMenuTheme } from '@/context/theme-context';
import type { MenuItem } from '@/types/menu';
import { formatPrice } from '@/utils/format';

import { DietBadge } from './diet-badge';

type Props = {
  item: MenuItem;
  currency: string;
  onPress?: () => void;
  showAvailability?: boolean;
};

export function ItemRow({ item, currency, onPress, showAvailability }: Readonly<Props>) {
  const { colors } = useMenuTheme();
  const dimmed = showAvailability && !item.available;

  const content = (
    <View
      style={[
        styles.row,
        { backgroundColor: colors.surface, borderColor: colors.border, opacity: dimmed ? 0.5 : 1 },
      ]}>
      {item.photoUri ? (
        <Image source={{ uri: item.photoUri }} style={styles.thumb} contentFit="cover" />
      ) : (
        <View style={[styles.thumb, styles.thumbPlaceholder, { backgroundColor: colors.surfaceMuted }]}>
          <Text style={{ color: colors.textMuted, fontSize: 22 }}>🍽️</Text>
        </View>
      )}
      <View style={styles.body}>
        <View style={styles.headRow}>
          <Text numberOfLines={1} style={[styles.name, { color: colors.text }]}>
            {item.name}
          </Text>
          <Text style={[styles.price, { color: colors.accent }]}>
            {formatPrice(item.price, currency)}
          </Text>
        </View>
        {item.description ? (
          <Text numberOfLines={2} style={[styles.desc, { color: colors.textMuted }]}>
            {item.description}
          </Text>
        ) : null}
        <View style={styles.footRow}>
          <DietBadge diet={item.diet} />
          {showAvailability && !item.available ? (
            <Text style={[styles.unavailable, { color: colors.textMuted }]}>Unavailable</Text>
          ) : null}
        </View>
      </View>
    </View>
  );

  if (!onPress) return content;
  return (
    <Pressable onPress={onPress} style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}>
      {content}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 12,
    padding: 12,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
  },
  thumb: { width: 72, height: 72, borderRadius: 8 },
  thumbPlaceholder: { alignItems: 'center', justifyContent: 'center' },
  body: { flex: 1, gap: 4 },
  headRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', gap: 8 },
  name: { fontSize: 16, fontWeight: '600', flex: 1 },
  price: { fontSize: 16, fontWeight: '700' },
  desc: { fontSize: 13, lineHeight: 18 },
  footRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 2 },
  unavailable: { fontSize: 11, fontStyle: 'italic' },
});
