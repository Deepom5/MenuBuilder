import { StyleSheet, Text, View } from 'react-native';

import type { ResolvedTheme } from '@/features/templates/types/template';
import type { DietType } from '@/types/menu';

export type DietDotProps = Readonly<{
  diet: DietType;
  theme: ResolvedTheme;
  withLabel?: boolean;
  size?: number;
}>;

function dietColor(diet: DietType, theme: ResolvedTheme): string {
  if (diet === 'nonveg') return theme.colors.nonveg;
  if (diet === 'vegan') return theme.colors.vegan;
  return theme.colors.veg;
}

function dietLabel(diet: DietType): string {
  if (diet === 'nonveg') return 'NON-VEG';
  if (diet === 'vegan') return 'VEGAN';
  return 'VEG';
}

export function DietDot({ diet, theme, withLabel, size = 10 }: DietDotProps) {
  const color = dietColor(diet, theme);
  return (
    <View style={styles.row}>
      <View
        style={[
          styles.dot,
          { width: size, height: size, borderRadius: size / 4, borderColor: color },
        ]}>
        <View style={[styles.inner, { backgroundColor: color }]} />
      </View>
      {withLabel ? (
        <Text
          style={{
            color,
            fontSize: 10,
            fontWeight: '700',
            letterSpacing: 1,
            fontFamily: theme.fonts.body,
          }}>
          {dietLabel(diet)}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  dot: { borderWidth: 1.5, alignItems: 'center', justifyContent: 'center' },
  inner: { width: '60%', height: '60%', borderRadius: 999 },
});
