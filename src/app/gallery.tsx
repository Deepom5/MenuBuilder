import { router } from 'expo-router';
import { useContext } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { MenuContext } from '@/context/menu-context';
import { useMenuTheme } from '@/context/theme-context';
import { TemplateGalleryView } from '@/features/templates/components/template-gallery-view';

/** Re-accessible template gallery for users who already finished onboarding. */
export default function GalleryScreen() {
  const ctx = useContext(MenuContext);
  const { colors } = useMenuTheme();
  if (!ctx) return null;

  return (
    <SafeAreaView edges={['top']} style={[styles.flex, { backgroundColor: colors.background }]}>
      <View style={styles.head}>
        <Text style={[styles.title, { color: colors.text }]}>Templates</Text>
        <Text style={[styles.subtitle, { color: colors.textMuted }]}>
          Switching templates clears your customizations. Preview first.
        </Text>
      </View>
      <TemplateGalleryView
        selectedId={ctx.menu.restaurant.templateId}
        favorites={ctx.menu.favoriteTemplates}
        recents={ctx.menu.recentTemplates}
        onPreview={(t) =>
          router.push({ pathname: '/template-preview/[id]', params: { id: t.id, from: 'gallery' } })
        }
        onToggleFavorite={(t) => ctx.toggleFavoriteTemplate(t.id)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  head: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 4 },
  title: { fontSize: 26, fontWeight: '700' },
  subtitle: { fontSize: 13, marginTop: 4 },
});
