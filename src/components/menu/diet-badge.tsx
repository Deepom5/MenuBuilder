import { StyleSheet, Text, View } from 'react-native';

import { useMenuTheme } from '@/context/theme-context';
import type { DietType } from '@/types/menu';

const LABEL: Record<DietType, string> = { veg: 'VEG', nonveg: 'NON-VEG', vegan: 'VEGAN' };

function colorForDiet(diet: DietType, colors: ReturnType<typeof useMenuTheme>['colors']) {
  if (diet === 'nonveg') return colors.nonveg;
  if (diet === 'vegan') return colors.vegan;
  return colors.veg;
}

export function DietBadge({ diet }: Readonly<{ diet: DietType }>) {
  const { colors } = useMenuTheme();
  const color = colorForDiet(diet, colors);

  return (
    <View style={[styles.box, { borderColor: color }]}>
      <View style={[styles.dot, { backgroundColor: color }]} />
      <Text style={[styles.label, { color }]}>{LABEL[diet]}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    alignSelf: 'flex-start',
  },
  dot: { width: 8, height: 8, borderRadius: 2, marginRight: 4 },
  label: { fontSize: 10, fontWeight: '700', letterSpacing: 0.5 },
});
