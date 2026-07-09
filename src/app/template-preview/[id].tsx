import { router, useLocalSearchParams } from 'expo-router';
import { useContext, useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedButton } from '@/components/menu/themed-button';
import { MenuContext } from '@/context/menu-context';
import { TemplateRenderer } from '@/features/templates/components/template-renderer';
import { getTemplateById } from '@/features/templates/configs';
import { resolveTheme } from '@/features/templates/services/resolve-theme';
import { previewMenuOrSample } from '@/features/templates/services/sample-menu';

/**
 * Full-screen preview of a single template. The preview renders the user's
 * own menu data when available so they can compare templates against their
 * real dishes; falls back to sample data otherwise.
 */
export default function TemplatePreviewScreen() {
  const params = useLocalSearchParams<{ id: string; from?: string }>();
  const ctx = useContext(MenuContext);
  const template = getTemplateById(params.id);
  const previewMenu = useMemo(() => (ctx ? previewMenuOrSample(ctx.menu) : null), [ctx]);
  // Preview ignores the user's overrides so they see the template as-shipped.
  const theme = useMemo(() => resolveTheme(template, {}, 'light'), [template]);

  if (!ctx || !previewMenu) return null;

  const isOnboarding = params.from === 'onboarding';

  const apply = () => {
    ctx.selectTemplate(template.id);
    if (isOnboarding) {
      ctx.completeOnboarding();
      router.replace('/(tabs)');
    } else {
      router.back();
    }
  };

  return (
    <SafeAreaView
      edges={['top', 'bottom']}
      style={[styles.flex, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.topBar, { borderColor: theme.colors.border }]}>
        <Pressable onPress={() => router.back()} hitSlop={10}>
          <Text style={{ color: theme.colors.text, fontSize: 22 }}>✕</Text>
        </Pressable>
        <View style={{ flex: 1, alignItems: 'center' }}>
          <Text style={{ color: theme.colors.textMuted, fontSize: 11, letterSpacing: 2 }}>
            PREVIEW
          </Text>
          <Text style={{ color: theme.colors.text, fontWeight: '700', fontSize: 15 }}>
            {template.name}
          </Text>
        </View>
        <Pressable
          onPress={() => ctx.toggleFavoriteTemplate(template.id)}
          hitSlop={10}
          accessibilityLabel="Toggle favorite">
          <Text style={{ fontSize: 22, color: theme.colors.text }}>
            {ctx.menu.favoriteTemplates.includes(template.id) ? '♥' : '♡'}
          </Text>
        </Pressable>
      </View>

      <View style={{ flex: 1 }}>
        <TemplateRenderer menu={previewMenu} theme={theme} />
      </View>

      <View style={[styles.footer, { borderColor: theme.colors.border, backgroundColor: theme.colors.background }]}>
        <Text style={{ color: theme.colors.textMuted, fontSize: 12, textAlign: 'center' }}>
          {template.description}
        </Text>
        <ThemedButton label={isOnboarding ? 'Use this template' : 'Apply template'} onPress={apply} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    gap: 12,
  },
  footer: {
    padding: 16,
    gap: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
});
