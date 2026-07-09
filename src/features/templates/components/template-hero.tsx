import { Image, StyleSheet, Text, View } from 'react-native';

import type { ResolvedTheme } from '@/features/templates/types/template';
import type { Restaurant } from '@/types/menu';

export type TemplateHeroProps = Readonly<{
  restaurant: Restaurant;
  theme: ResolvedTheme;
}>;

export function TemplateHero({ restaurant, theme }: TemplateHeroProps) {
  const style = theme.layout.heroStyle;
  if (style === 'banner') return <BannerHero restaurant={restaurant} theme={theme} />;
  if (style === 'split') return <SplitHero restaurant={restaurant} theme={theme} />;
  if (style === 'minimal') return <MinimalHero restaurant={restaurant} theme={theme} />;
  return <CenteredHero restaurant={restaurant} theme={theme} />;
}

function BannerHero({ restaurant, theme }: TemplateHeroProps) {
  const hasCover = theme.layout.showCover && restaurant.coverUri;
  return (
    <View style={styles.banner}>
      {hasCover ? (
        <Image source={{ uri: restaurant.coverUri }} style={styles.bannerImg} />
      ) : (
        <View style={[styles.bannerImg, { backgroundColor: theme.colors.surfaceMuted }]} />
      )}
      <View style={styles.bannerOverlay}>
        <View style={[styles.bannerScrim, { backgroundColor: scrim(theme) }]} />
        <View style={styles.bannerText}>
          {theme.layout.showLogo && restaurant.logoUri ? (
            <Image source={{ uri: restaurant.logoUri }} style={styles.logo} />
          ) : null}
          <Text
            style={[
              styles.bannerTitle,
              {
                color: '#fff',
                fontFamily: theme.fonts.heading,
                fontWeight: theme.typography.headingWeight,
                letterSpacing: theme.typography.letterSpacing,
                fontSize: 30 * theme.typography.scale,
              },
            ]}>
            {restaurant.name || 'Your Restaurant'}
          </Text>
          {restaurant.tagline ? (
            <Text
              style={{
                color: 'rgba(255,255,255,0.85)',
                fontFamily: theme.fonts.body,
                fontStyle: 'italic',
                fontSize: 14 * theme.typography.scale,
              }}>
              {restaurant.tagline}
            </Text>
          ) : null}
        </View>
      </View>
    </View>
  );
}

function CenteredHero({ restaurant, theme }: TemplateHeroProps) {
  return (
    <View style={[styles.centered, { backgroundColor: theme.colors.background }]}>
      {theme.layout.showLogo && restaurant.logoUri ? (
        <Image source={{ uri: restaurant.logoUri }} style={styles.logoLarge} />
      ) : null}
      <Text
        style={{
          color: theme.colors.text,
          fontFamily: theme.fonts.heading,
          fontWeight: theme.typography.headingWeight,
          fontSize: 32 * theme.typography.scale,
          letterSpacing: theme.typography.letterSpacing,
          textAlign: 'center',
        }}>
        {restaurant.name || 'Your Restaurant'}
      </Text>
      {restaurant.tagline ? (
        <Text
          style={{
            color: theme.colors.textMuted,
            fontFamily: theme.fonts.body,
            fontStyle: 'italic',
            fontSize: 14 * theme.typography.scale,
            textAlign: 'center',
            marginTop: 6,
          }}>
          {restaurant.tagline}
        </Text>
      ) : null}
      <View style={[styles.divider, { backgroundColor: theme.colors.accent }]} />
    </View>
  );
}

function MinimalHero({ restaurant, theme }: TemplateHeroProps) {
  return (
    <View style={styles.minimal}>
      <Text
        style={{
          color: theme.colors.text,
          fontFamily: theme.fonts.heading,
          fontWeight: theme.typography.headingWeight,
          fontSize: 22 * theme.typography.scale,
          letterSpacing: theme.typography.letterSpacing,
          textTransform: 'uppercase',
        }}>
        {restaurant.name || 'Your Restaurant'}
      </Text>
    </View>
  );
}

function SplitHero({ restaurant, theme }: TemplateHeroProps) {
  const hasCover = theme.layout.showCover && restaurant.coverUri;
  return (
    <View style={styles.split}>
      {hasCover ? (
        <Image source={{ uri: restaurant.coverUri }} style={styles.splitImg} />
      ) : (
        <View style={[styles.splitImg, { backgroundColor: theme.colors.surfaceMuted }]} />
      )}
      <View style={[styles.splitBody, { backgroundColor: theme.colors.surface }]}>
        {theme.layout.showLogo && restaurant.logoUri ? (
          <Image source={{ uri: restaurant.logoUri }} style={styles.logo} />
        ) : null}
        <Text
          style={{
            color: theme.colors.text,
            fontFamily: theme.fonts.heading,
            fontWeight: theme.typography.headingWeight,
            fontSize: 26 * theme.typography.scale,
            letterSpacing: theme.typography.letterSpacing * 0.6,
          }}>
          {restaurant.name || 'Your Restaurant'}
        </Text>
        {restaurant.tagline ? (
          <Text
            style={{
              color: theme.colors.textMuted,
              fontFamily: theme.fonts.body,
              fontSize: 13 * theme.typography.scale,
              marginTop: 4,
            }}>
            {restaurant.tagline}
          </Text>
        ) : null}
      </View>
    </View>
  );
}

function scrim(theme: ResolvedTheme): string {
  return theme.appearance === 'dark' ? 'rgba(0,0,0,0.45)' : 'rgba(0,0,0,0.35)';
}

const styles = StyleSheet.create({
  banner: { position: 'relative', overflow: 'hidden' },
  bannerImg: { width: '100%', height: 220 },
  bannerOverlay: { position: 'absolute', inset: 0 },
  bannerScrim: { ...StyleSheet.absoluteFill },
  bannerText: { position: 'absolute', left: 20, right: 20, bottom: 20 },
  bannerTitle: { marginBottom: 4 },
  logo: { width: 40, height: 40, borderRadius: 8, marginBottom: 8 },
  logoLarge: { width: 64, height: 64, borderRadius: 12, marginBottom: 8 },
  centered: { alignItems: 'center', paddingVertical: 28, paddingHorizontal: 20 },
  divider: { width: 40, height: 2, marginTop: 14 },
  minimal: { paddingVertical: 20, paddingHorizontal: 20 },
  split: { flexDirection: 'row', minHeight: 160 },
  splitImg: { flex: 1 },
  splitBody: { flex: 1, padding: 18, justifyContent: 'center' },
});
