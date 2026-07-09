import { router } from 'expo-router';
import { useContext, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { ThemedButton } from '@/components/menu/themed-button';
import { MenuContext } from '@/context/menu-context';
import { useMenuTheme } from '@/context/theme-context';
import { getTemplateById } from '@/features/templates/configs';
import { exportMenuAsJson, importMenuFromJson } from '@/utils/menu-export';

const CURRENCY_OPTIONS = ['USD', 'EUR', 'GBP', 'INR', 'JPY', 'AUD', 'CAD'];

export default function SettingsScreen() {
  const ctx = useContext(MenuContext);
  const { colors } = useMenuTheme();

  const [name, setName] = useState(ctx?.menu.restaurant.name ?? '');
  const [tagline, setTagline] = useState(ctx?.menu.restaurant.tagline ?? '');

  if (!ctx) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.textMuted }}>Loading…</Text>
      </View>
    );
  }

  const { menu, updateRestaurant, replaceMenu } = ctx;
  const template = getTemplateById(menu.restaurant.templateId);

  const saveBasics = () => {
    updateRestaurant({ name: name.trim() || menu.restaurant.name, tagline: tagline.trim() });
  };

  const handleImport = async () => {
    try {
      const imported = await importMenuFromJson();
      if (!imported) return;
      Alert.alert(
        'Replace current menu?',
        `Import "${imported.restaurant.name}"? This overwrites your current menu.`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Replace',
            style: 'destructive',
            onPress: () => {
              replaceMenu(imported);
              router.back();
            },
          },
        ],
      );
    } catch (err) {
      Alert.alert('Import failed', err instanceof Error ? err.message : String(err));
    }
  };

  return (
    <ScrollView
      contentContainerStyle={styles.content}
      style={{ backgroundColor: colors.background }}
      keyboardShouldPersistTaps="handled">
      <Section title="Restaurant" colors={colors}>
        <LabeledInput
          label="Name"
          value={name}
          onChangeText={setName}
          onBlur={saveBasics}
          colors={colors}
        />
        <LabeledInput
          label="Tagline"
          value={tagline}
          onChangeText={setTagline}
          onBlur={saveBasics}
          placeholder="Optional"
          colors={colors}
        />
      </Section>

      <Section title="Currency" colors={colors}>
        <View style={styles.chipsRow}>
          {CURRENCY_OPTIONS.map((code) => {
            const selected = code === menu.restaurant.currency;
            return (
              <Pressable
                key={code}
                onPress={() => updateRestaurant({ currency: code })}
                style={[
                  styles.chip,
                  {
                    backgroundColor: selected ? colors.accent : colors.surface,
                    borderColor: selected ? colors.accent : colors.border,
                  },
                ]}>
                <Text
                  style={{
                    color: selected ? colors.accentOn : colors.text,
                    fontWeight: selected ? '700' : '500',
                  }}>
                  {code}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </Section>

      <Section title="Design" colors={colors}>
        <Pressable
          onPress={() => router.push('/gallery')}
          style={[
            styles.row,
            { backgroundColor: colors.surface, borderColor: colors.border },
          ]}>
          <View style={{ flex: 1, gap: 2 }}>
            <Text style={{ color: colors.text, fontSize: 16, fontWeight: '600' }}>Template</Text>
            <Text style={{ color: colors.textMuted, fontSize: 13 }}>{template.name}</Text>
          </View>
          <Text style={{ color: colors.textMuted, fontSize: 22 }}>›</Text>
        </Pressable>
        <Pressable
          onPress={() => router.push('/customize')}
          style={[
            styles.row,
            { backgroundColor: colors.surface, borderColor: colors.border },
          ]}>
          <View style={{ flex: 1, gap: 2 }}>
            <Text style={{ color: colors.text, fontSize: 16, fontWeight: '600' }}>Customize</Text>
            <Text style={{ color: colors.textMuted, fontSize: 13 }}>
              Colors, font, density, dark mode
            </Text>
          </View>
          <Text style={{ color: colors.textMuted, fontSize: 22 }}>›</Text>
        </Pressable>
      </Section>

      <Section title="Backup" colors={colors}>
        <ThemedButton label="Export menu as JSON" onPress={() => exportMenuAsJson(menu)} />
        <ThemedButton label="Import menu from JSON" variant="secondary" onPress={handleImport} />
      </Section>
    </ScrollView>
  );
}

function Section({
  title,
  colors,
  children,
}: Readonly<{
  title: string;
  colors: ReturnType<typeof useMenuTheme>['colors'];
  children: React.ReactNode;
}>) {
  return (
    <View style={{ gap: 10 }}>
      <Text style={{ color: colors.textMuted, fontSize: 12, fontWeight: '700', letterSpacing: 0.5 }}>
        {title.toUpperCase()}
      </Text>
      <View style={{ gap: 10 }}>{children}</View>
    </View>
  );
}

function LabeledInput({
  label,
  colors,
  ...rest
}: Readonly<{
  label: string;
  colors: ReturnType<typeof useMenuTheme>['colors'];
  value: string;
  onChangeText: (v: string) => void;
  onBlur?: () => void;
  placeholder?: string;
}>) {
  return (
    <View style={{ gap: 4 }}>
      <Text style={{ color: colors.text, fontSize: 14 }}>{label}</Text>
      <TextInput
        {...rest}
        placeholderTextColor={colors.textMuted}
        style={{
          color: colors.text,
          backgroundColor: colors.surface,
          borderColor: colors.border,
          borderWidth: StyleSheet.hairlineWidth,
          borderRadius: 10,
          padding: 12,
          fontSize: 16,
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  content: { padding: 16, gap: 18, paddingBottom: 48 },
  chipsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: StyleSheet.hairlineWidth,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
  },
});
