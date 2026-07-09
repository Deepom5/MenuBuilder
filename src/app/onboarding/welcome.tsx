import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedButton } from '@/components/menu/themed-button';
import { useMenuTheme } from '@/context/theme-context';

export default function WelcomeScreen() {
  const { colors, theme } = useMenuTheme();
  return (
    <SafeAreaView
      edges={['top', 'bottom']}
      style={[styles.flex, { backgroundColor: colors.background }]}>
      <View style={styles.center}>
        <Text style={styles.kicker}>{`MENUBUILDER`}</Text>
        <Text
          style={[
            styles.title,
            {
              color: colors.text,
              fontFamily: theme.fonts.heading,
              fontWeight: theme.typography.headingWeight,
              letterSpacing: theme.typography.letterSpacing,
            },
          ]}>
          Design a menu your guests will remember.
        </Text>
        <Text style={[styles.subtitle, { color: colors.textMuted }]}>
          Pick a template, drop in your dishes, and share a polished menu in minutes — no design
          skills required.
        </Text>
        <View style={styles.bullets}>
          <Bullet color={colors.text} mutedColor={colors.textMuted} icon="◆" title="10 professional templates" subtitle="From minimal café to fine-dining" />
          <Bullet color={colors.text} mutedColor={colors.textMuted} icon="◆" title="Customize the essentials" subtitle="Colors, fonts, density, dark mode" />
          <Bullet color={colors.text} mutedColor={colors.textMuted} icon="◆" title="Offline-first & private" subtitle="Everything stays on your device" />
        </View>
      </View>
      <View style={styles.footer}>
        <ThemedButton label="Get Started" onPress={() => router.push('/onboarding/restaurant')} />
        <Text style={[styles.legal, { color: colors.textMuted }]}>
          Your data lives on this device only.
        </Text>
      </View>
    </SafeAreaView>
  );
}

function Bullet({
  icon,
  title,
  subtitle,
  color,
  mutedColor,
}: Readonly<{ icon: string; title: string; subtitle: string; color: string; mutedColor: string }>) {
  return (
    <View style={styles.bullet}>
      <Text style={{ color, fontSize: 14, width: 18 }}>{icon}</Text>
      <View style={{ flex: 1 }}>
        <Text style={{ color, fontSize: 15, fontWeight: '600' }}>{title}</Text>
        <Text style={{ color: mutedColor, fontSize: 13 }}>{subtitle}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  center: { flex: 1, paddingHorizontal: 24, paddingTop: 32, justifyContent: 'center' },
  kicker: { fontSize: 11, letterSpacing: 4, color: '#9aa', marginBottom: 12 },
  title: { fontSize: 32, lineHeight: 38 },
  subtitle: { marginTop: 14, fontSize: 16, lineHeight: 24 },
  bullets: { marginTop: 36, gap: 16 },
  bullet: { flexDirection: 'row', gap: 12, alignItems: 'flex-start' },
  footer: { paddingHorizontal: 24, paddingBottom: 16, gap: 10 },
  legal: { textAlign: 'center', fontSize: 11 },
});
