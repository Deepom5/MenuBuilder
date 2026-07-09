import { StyleSheet, Text, View } from 'react-native';

import { useMenuTheme } from '@/context/theme-context';

export function EmptyState({
  title,
  hint,
  icon = '✨',
}: Readonly<{
  title: string;
  hint?: string;
  icon?: string;
}>) {
  const { colors } = useMenuTheme();
  return (
    <View style={styles.box}>
      <Text style={styles.icon}>{icon}</Text>
      <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
      {hint ? <Text style={[styles.hint, { color: colors.textMuted }]}>{hint}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  box: { alignItems: 'center', justifyContent: 'center', padding: 32, gap: 8 },
  icon: { fontSize: 40 },
  title: { fontSize: 17, fontWeight: '600', textAlign: 'center' },
  hint: { fontSize: 14, textAlign: 'center', lineHeight: 20 },
});
