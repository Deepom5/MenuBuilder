import { useContext } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { MenuContext } from '@/context/menu-context';
import { useMenuTheme } from '@/context/theme-context';
import { TemplateRenderer } from '@/features/templates/components/template-renderer';

export default function PreviewScreen() {
  const ctx = useContext(MenuContext);
  const { theme, colors } = useMenuTheme();

  if (!ctx) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.textMuted }}>Loading…</Text>
      </View>
    );
  }

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <TemplateRenderer menu={ctx.menu} theme={theme} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
