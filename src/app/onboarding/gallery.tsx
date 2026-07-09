import { router } from 'expo-router';
import { useContext } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { MenuContext } from '@/context/menu-context';
import { useMenuTheme } from '@/context/theme-context';
import { TemplateGalleryView } from '@/features/templates/components/template-gallery-view';

export default function OnboardingGalleryScreen() {
  const ctx = useContext(MenuContext);
  const { colors, theme } = useMenuTheme();
  if (!ctx) return null;

  return (
    <SafeAreaView
      edges={['top', 'bottom']}
      style={[styles.flex, { backgroundColor: colors.background }]}>
      <View style={styles.head}>
        <Text style={[styles.step, { color: colors.textMuted }]}>STEP 2 OF 3</Text>
        <Text
          style={[
            styles.title,
            {
              color: colors.text,
              fontFamily: theme.fonts.heading,
              fontWeight: theme.typography.headingWeight,
            },
          ]}>
          Pick a starting point.
        </Text>
        <Text style={[styles.subtitle, { color: colors.textMuted }]}>
          You can customize colors, fonts and density after. Tap a template to preview it.
        </Text>
      </View>
      <TemplateGalleryView
        selectedId={ctx.menu.restaurant.templateId}
        favorites={ctx.menu.favoriteTemplates}
        recents={ctx.menu.recentTemplates}
        onPreview={(t) =>
          router.push({ pathname: '/template-preview/[id]', params: { id: t.id, from: 'onboarding' } })
        }
        onToggleFavorite={(t) => ctx.toggleFavoriteTemplate(t.id)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  head: { paddingHorizontal: 24, paddingTop: 12, paddingBottom: 4, gap: 6 },
  step: { fontSize: 11, letterSpacing: 4, fontWeight: '700' },
  title: { fontSize: 26, lineHeight: 32 },
  subtitle: { fontSize: 14, lineHeight: 20 },
});
