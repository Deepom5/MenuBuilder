import { router } from 'expo-router';
import { useContext, useState } from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedButton } from '@/components/menu/themed-button';
import { MenuContext } from '@/context/menu-context';
import { useMenuTheme } from '@/context/theme-context';

const CURRENCY_OPTIONS = ['USD', 'EUR', 'GBP', 'INR', 'JPY', 'AUD', 'CAD'];

export default function RestaurantSetupScreen() {
  const ctx = useContext(MenuContext);
  const { colors, theme } = useMenuTheme();
  const [name, setName] = useState(ctx?.menu.restaurant.name ?? '');
  const [tagline, setTagline] = useState(ctx?.menu.restaurant.tagline ?? '');
  const [currency, setCurrency] = useState(ctx?.menu.restaurant.currency ?? 'USD');

  if (!ctx) return null;
  const canContinue = name.trim().length > 0;

  const handleNext = () => {
    ctx.updateRestaurant({ name: name.trim(), tagline: tagline.trim(), currency });
    router.push('/onboarding/gallery');
  };

  return (
    <SafeAreaView
      edges={['top', 'bottom']}
      style={[styles.flex, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flex}>
        <View style={styles.body}>
          <Text style={[styles.step, { color: colors.textMuted }]}>STEP 1 OF 3</Text>
          <Text
            style={[
              styles.title,
              {
                color: colors.text,
                fontFamily: theme.fonts.heading,
                fontWeight: theme.typography.headingWeight,
              },
            ]}>
            Tell us about your place.
          </Text>
          <Text style={[styles.subtitle, { color: colors.textMuted }]}>
            We&apos;ll use this everywhere your menu appears. You can change it later.
          </Text>

          <Label color={colors.text}>Restaurant name</Label>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Trattoria Luna"
            placeholderTextColor={colors.textMuted}
            style={[
              styles.input,
              { color: colors.text, backgroundColor: colors.surface, borderColor: colors.border },
            ]}
            autoFocus
            returnKeyType="next"
          />

          <Label color={colors.text}>Tagline (optional)</Label>
          <TextInput
            value={tagline}
            onChangeText={setTagline}
            placeholder="Hand-rolled pasta, slow nights"
            placeholderTextColor={colors.textMuted}
            style={[
              styles.input,
              { color: colors.text, backgroundColor: colors.surface, borderColor: colors.border },
            ]}
          />

          <Label color={colors.text}>Currency</Label>
          <View style={styles.chips}>
            {CURRENCY_OPTIONS.map((code) => {
              const active = code === currency;
              return (
                <Pressable
                  key={code}
                  onPress={() => setCurrency(code)}
                  style={[
                    styles.chip,
                    {
                      backgroundColor: active ? colors.accent : colors.surface,
                      borderColor: active ? colors.accent : colors.border,
                    },
                  ]}>
                  <Text
                    style={{
                      color: active ? colors.accentOn : colors.text,
                      fontWeight: active ? '700' : '500',
                    }}>
                    {code}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View style={styles.footer}>
          <ThemedButton
            label={canContinue ? 'Continue' : 'Enter a name to continue'}
            onPress={handleNext}
            disabled={!canContinue}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function Label({ color, children }: Readonly<{ color: string; children: React.ReactNode }>) {
  return <Text style={[styles.label, { color }]}>{children}</Text>;
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  body: { flex: 1, paddingHorizontal: 24, paddingTop: 16, gap: 8 },
  step: { fontSize: 11, letterSpacing: 4, fontWeight: '700' },
  title: { fontSize: 28, lineHeight: 34, marginTop: 8 },
  subtitle: { fontSize: 14, marginBottom: 20, lineHeight: 22 },
  label: { fontSize: 13, fontWeight: '600', marginTop: 16, marginBottom: 6 },
  input: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
  },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 4 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: StyleSheet.hairlineWidth,
  },
  footer: { paddingHorizontal: 24, paddingBottom: 16 },
});
