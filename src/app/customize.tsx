import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { useContext, useMemo, useState } from 'react';
import {
    Alert,
    Image,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';

import { ThemedButton } from '@/components/menu/themed-button';
import { MenuContext } from '@/context/menu-context';
import { useMenuTheme } from '@/context/theme-context';
import { TemplateRenderer } from '@/features/templates/components/template-renderer';
import { getTemplateById } from '@/features/templates/configs';
import { fontFamilyFor } from '@/features/templates/services/fonts';
import { previewMenuOrSample } from '@/features/templates/services/sample-menu';
import type {
    AppearancePref,
    Density,
    FontFamilyKey,
} from '@/features/templates/types/template';

type Tab = 'branding' | 'colors' | 'type' | 'layout';

/**
 * Customization Studio (essentials tier): branding assets, colours, font
 * family, density, and appearance preference. Every tweak is applied to
 * `restaurant.overrides` and rendered live in the preview pane above.
 */
export default function CustomizeScreen() {
  const ctx = useContext(MenuContext);
  const { colors, theme: liveTheme } = useMenuTheme();
  const [tab, setTab] = useState<Tab>('branding');

  // Hooks must run before any conditional return.
  const previewMenu = useMemo(() => (ctx ? previewMenuOrSample(ctx.menu) : null), [ctx]);

  if (!ctx || !previewMenu) return null;
  const { menu } = ctx;
  const overrides = menu.restaurant.overrides;
  void overrides;

  return (
    <View style={[styles.flex, { backgroundColor: colors.background }]}>
      <View style={[styles.preview, { borderColor: colors.border }]}>
        <TemplateRenderer menu={previewMenu} theme={liveTheme} />
      </View>

      <View style={[styles.tabs, { borderColor: colors.border }]}>
        {(['branding', 'colors', 'type', 'layout'] as const).map((id) => {
          const active = id === tab;
          return (
            <Pressable key={id} onPress={() => setTab(id)} style={styles.tabBtn}>
              <Text
                style={{
                  color: active ? colors.accent : colors.textMuted,
                  fontWeight: '700',
                  fontSize: 12,
                  letterSpacing: 1,
                  textTransform: 'uppercase',
                }}>
                {tabLabel(id)}
              </Text>
              {active ? (
                <View style={[styles.tabIndicator, { backgroundColor: colors.accent }]} />
              ) : null}
            </Pressable>
          );
        })}
      </View>

      <ScrollView
        contentContainerStyle={styles.body}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        {tab === 'branding' ? <BrandingTab /> : null}
        {tab === 'colors' ? <ColorsTab /> : null}
        {tab === 'type' ? <TypeTab /> : null}
        {tab === 'layout' ? <LayoutTab /> : null}

        <View style={styles.footerRow}>
          <ThemedButton
            label="Reset to template"
            variant="secondary"
            onPress={() =>
              Alert.alert('Reset customizations?', 'Restore the template defaults.', [
                { text: 'Cancel', style: 'cancel' },
                {
                  text: 'Reset',
                  style: 'destructive',
                  onPress: () => ctx.resetOverrides(),
                },
              ])
            }
            style={{ flex: 1 }}
          />
          <ThemedButton label="Done" onPress={() => router.back()} style={{ flex: 1 }} />
        </View>
      </ScrollView>
    </View>
  );
}

function tabLabel(t: Tab): string {
  if (t === 'branding') return 'Branding';
  if (t === 'colors') return 'Colors';
  if (t === 'type') return 'Type';
  return 'Layout';
}

function BrandingTab() {
  const ctx = useContext(MenuContext)!;
  const { colors } = useMenuTheme();
  const { menu, updateRestaurant, pickPhotoFromAsset } = ctx;

  const pick = async (kind: 'logoUri' | 'coverUri') => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.85,
      allowsEditing: kind === 'logoUri',
      aspect: kind === 'logoUri' ? [1, 1] : [16, 9],
    });
    if (result.canceled || result.assets.length === 0) return;
    const local = await pickPhotoFromAsset(result.assets[0].uri);
    updateRestaurant({ [kind]: local } as Partial<typeof menu.restaurant>);
  };

  return (
    <View style={{ gap: 16 }}>
      <Field label="Logo" hint="Square. Shows on hero and PDFs.">
        <Pressable
          onPress={() => pick('logoUri')}
          style={[styles.assetBox, { borderColor: colors.border, backgroundColor: colors.surface }]}>
          {menu.restaurant.logoUri ? (
            <Image source={{ uri: menu.restaurant.logoUri }} style={styles.logoPreview} />
          ) : (
            <Text style={{ color: colors.textMuted }}>Tap to choose logo</Text>
          )}
        </Pressable>
        {menu.restaurant.logoUri ? (
          <Pressable onPress={() => updateRestaurant({ logoUri: undefined })}>
            <Text style={{ color: colors.textMuted, fontSize: 12 }}>Remove logo</Text>
          </Pressable>
        ) : null}
      </Field>

      <Field label="Cover photo" hint="Banner above the menu (16:9).">
        <Pressable
          onPress={() => pick('coverUri')}
          style={[styles.coverBox, { borderColor: colors.border, backgroundColor: colors.surface }]}>
          {menu.restaurant.coverUri ? (
            <Image source={{ uri: menu.restaurant.coverUri }} style={styles.coverPreview} />
          ) : (
            <Text style={{ color: colors.textMuted }}>Tap to choose cover photo</Text>
          )}
        </Pressable>
        {menu.restaurant.coverUri ? (
          <Pressable onPress={() => updateRestaurant({ coverUri: undefined })}>
            <Text style={{ color: colors.textMuted, fontSize: 12 }}>Remove cover</Text>
          </Pressable>
        ) : null}
      </Field>
    </View>
  );
}

function ColorsTab() {
  const ctx = useContext(MenuContext)!;
  const { colors: appColors } = useMenuTheme();
  const template = getTemplateById(ctx.menu.restaurant.templateId);
  const base = template.colors.light;
  const overrides = ctx.menu.restaurant.overrides.colors ?? {};

  const PRIMARY_SWATCHES = ['#0E1116', '#1B2A4A', '#7A1F1F', '#2F5D3A', '#C2185B', '#B85C2E', '#D7263D'];
  const ACCENT_SWATCHES = ['#C9A24B', '#D7263D', '#FFB400', '#4F7942', '#E07A1F', '#1B2A4A', '#B71C1C'];
  const BG_SWATCHES = ['#FFFFFF', '#FAFAF7', '#FBF6EE', '#F8F4EA', '#FFF5F8', '#FFF8E1', '#FFFBEC'];

  return (
    <View style={{ gap: 18 }}>
      <ColorRow
        label="Primary"
        hint="Used for headings and text accents."
        current={overrides.primary ?? base.primary}
        defaultColor={base.primary}
        swatches={PRIMARY_SWATCHES}
        onPick={(c) => ctx.updateOverrides({ colors: { primary: c } })}
        onReset={() => ctx.updateOverrides({ colors: { primary: undefined } })}
      />
      <ColorRow
        label="Accent"
        hint="Buttons, category titles, prices."
        current={overrides.accent ?? base.accent}
        defaultColor={base.accent}
        swatches={ACCENT_SWATCHES}
        onPick={(c) => ctx.updateOverrides({ colors: { accent: c } })}
        onReset={() => ctx.updateOverrides({ colors: { accent: undefined } })}
      />
      <ColorRow
        label="Background"
        hint="Canvas color behind the menu."
        current={overrides.background ?? base.background}
        defaultColor={base.background}
        swatches={BG_SWATCHES}
        onPick={(c) => ctx.updateOverrides({ colors: { background: c } })}
        onReset={() => ctx.updateOverrides({ colors: { background: undefined } })}
      />
      <Text style={{ color: appColors.textMuted, fontSize: 12 }}>
        Other colors (surfaces, borders, diet badges) follow the template so contrast stays
        balanced.
      </Text>
    </View>
  );
}

function ColorRow({
  label,
  hint,
  current,
  defaultColor,
  swatches,
  onPick,
  onReset,
}: Readonly<{
  label: string;
  hint: string;
  current: string;
  defaultColor: string;
  swatches: string[];
  onPick: (c: string) => void;
  onReset: () => void;
}>) {
  const { colors } = useMenuTheme();
  return (
    <View style={{ gap: 8 }}>
      <View style={{ flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between' }}>
        <Text style={{ color: colors.text, fontWeight: '600' }}>{label}</Text>
        {current !== defaultColor ? (
          <Pressable onPress={onReset} hitSlop={6}>
            <Text style={{ color: colors.textMuted, fontSize: 12 }}>reset</Text>
          </Pressable>
        ) : null}
      </View>
      <Text style={{ color: colors.textMuted, fontSize: 12 }}>{hint}</Text>
      <View style={styles.swatchRow}>
        <View
          style={[styles.swatchCurrent, { backgroundColor: current, borderColor: colors.border }]}
        />
        {swatches.map((c) => {
          const active = c.toLowerCase() === current.toLowerCase();
          return (
            <Pressable
              key={c}
              onPress={() => onPick(c)}
              style={[
                styles.swatch,
                {
                  backgroundColor: c,
                  borderColor: active ? colors.accent : colors.border,
                  borderWidth: active ? 2.5 : 1,
                },
              ]}
            />
          );
        })}
      </View>
    </View>
  );
}

function TypeTab() {
  const ctx = useContext(MenuContext)!;
  const { colors } = useMenuTheme();
  const template = getTemplateById(ctx.menu.restaurant.templateId);
  const headingOverride = ctx.menu.restaurant.overrides.typography?.heading;
  const scale = ctx.menu.restaurant.overrides.typography?.scale ?? template.typography.scale;

  const FONTS: { id: FontFamilyKey; label: string; sample: string }[] = [
    { id: 'sans', label: 'Sans-serif', sample: 'Aa' },
    { id: 'serif', label: 'Serif', sample: 'Aa' },
    { id: 'rounded', label: 'Rounded', sample: 'Aa' },
    { id: 'mono', label: 'Monospace', sample: 'Aa' },
  ];

  return (
    <View style={{ gap: 18 }}>
      <View style={{ gap: 8 }}>
        <Text style={{ color: colors.text, fontWeight: '600' }}>Heading font</Text>
        <Text style={{ color: colors.textMuted, fontSize: 12 }}>
          Used for restaurant name, category titles and item names.
        </Text>
        <View style={styles.fontGrid}>
          {FONTS.map((f) => {
            const active = (headingOverride ?? template.typography.heading) === f.id;
            return (
              <Pressable
                key={f.id}
                onPress={() => ctx.updateOverrides({ typography: { heading: f.id } })}
                style={[
                  styles.fontCard,
                  {
                    backgroundColor: colors.surface,
                    borderColor: active ? colors.accent : colors.border,
                    borderWidth: active ? 2 : StyleSheet.hairlineWidth,
                  },
                ]}>
                <Text
                  style={{
                    color: colors.text,
                    fontSize: 28,
                    fontFamily: fontFamilyFor(f.id),
                  }}>
                  {f.sample}
                </Text>
                <Text style={{ color: colors.textMuted, fontSize: 11 }}>{f.label}</Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <View style={{ gap: 8 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={{ color: colors.text, fontWeight: '600' }}>Scale</Text>
          <Text style={{ color: colors.textMuted }}>{scale.toFixed(2)}×</Text>
        </View>
        <View style={styles.fontGrid}>
          {[
            { id: 0.9, label: 'Compact' },
            { id: 1.0, label: 'Default' },
            { id: 1.1, label: 'Comfort' },
            { id: 1.2, label: 'Large' },
          ].map((s) => {
            const active = Math.abs(scale - s.id) < 0.001;
            return (
              <Pressable
                key={s.id}
                onPress={() => ctx.updateOverrides({ typography: { scale: s.id } })}
                style={[
                  styles.scaleCard,
                  {
                    backgroundColor: colors.surface,
                    borderColor: active ? colors.accent : colors.border,
                    borderWidth: active ? 2 : StyleSheet.hairlineWidth,
                  },
                ]}>
                <Text style={{ color: colors.text, fontWeight: '700' }}>{s.id.toFixed(2)}×</Text>
                <Text style={{ color: colors.textMuted, fontSize: 11 }}>{s.label}</Text>
              </Pressable>
            );
          })}
        </View>
      </View>
    </View>
  );
}

function LayoutTab() {
  const ctx = useContext(MenuContext)!;
  const { colors } = useMenuTheme();
  const template = getTemplateById(ctx.menu.restaurant.templateId);
  const density: Density =
    ctx.menu.restaurant.overrides.layout?.density ?? template.layout.density;
  const appearance: AppearancePref = ctx.menu.restaurant.overrides.appearance ?? 'auto';

  return (
    <View style={{ gap: 18 }}>
      <View style={{ gap: 8 }}>
        <Text style={{ color: colors.text, fontWeight: '600' }}>Density</Text>
        <Text style={{ color: colors.textMuted, fontSize: 12 }}>
          How much breathing room around each item.
        </Text>
        <View style={styles.row}>
          {(['compact', 'comfortable', 'spacious'] as const).map((d) => {
            const active = d === density;
            return (
              <Pressable
                key={d}
                onPress={() => ctx.updateOverrides({ layout: { density: d } })}
                style={[
                  styles.segment,
                  {
                    backgroundColor: active ? colors.accent : colors.surface,
                    borderColor: active ? colors.accent : colors.border,
                  },
                ]}>
                <Text
                  style={{
                    color: active ? colors.accentOn : colors.text,
                    textTransform: 'capitalize',
                    fontWeight: active ? '700' : '500',
                  }}>
                  {d}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <View style={{ gap: 8 }}>
        <Text style={{ color: colors.text, fontWeight: '600' }}>Appearance</Text>
        <Text style={{ color: colors.textMuted, fontSize: 12 }}>
          {template.supportsDarkMode
            ? 'Override your system colour scheme for this menu.'
            : 'This template only supports light mode.'}
        </Text>
        <View style={styles.row}>
          {(['auto', 'light', 'dark'] as const).map((a) => {
            const active = a === appearance;
            const disabled = !template.supportsDarkMode && a === 'dark';
            return (
              <Pressable
                key={a}
                onPress={() => !disabled && ctx.updateOverrides({ appearance: a })}
                style={[
                  styles.segment,
                  {
                    opacity: disabled ? 0.4 : 1,
                    backgroundColor: active ? colors.accent : colors.surface,
                    borderColor: active ? colors.accent : colors.border,
                  },
                ]}>
                <Text
                  style={{
                    color: active ? colors.accentOn : colors.text,
                    textTransform: 'capitalize',
                    fontWeight: active ? '700' : '500',
                  }}>
                  {a}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>
    </View>
  );
}

function Field({
  label,
  hint,
  children,
}: Readonly<{ label: string; hint?: string; children: React.ReactNode }>) {
  const { colors } = useMenuTheme();
  return (
    <View style={{ gap: 6 }}>
      <Text style={{ color: colors.text, fontWeight: '600' }}>{label}</Text>
      {hint ? <Text style={{ color: colors.textMuted, fontSize: 12 }}>{hint}</Text> : null}
      {children}
    </View>
  );
}

// Customize wraps the live theme from `useMenuTheme` so every override change
// re-renders the preview through the same code path users will see at runtime.

const styles = StyleSheet.create({
  flex: { flex: 1 },
  preview: {
    height: 280,
    borderBottomWidth: StyleSheet.hairlineWidth,
    overflow: 'hidden',
  },
  tabs: {
    flexDirection: 'row',
    borderBottomWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 8,
  },
  tabBtn: { paddingHorizontal: 14, paddingVertical: 12 },
  tabIndicator: { height: 2, marginTop: 6, borderRadius: 1 },
  body: { padding: 16, gap: 18, paddingBottom: 36 },
  assetBox: {
    height: 120,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  logoPreview: { width: 120, height: 120, resizeMode: 'cover' },
  coverBox: {
    height: 140,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  coverPreview: { width: '100%', height: '100%', resizeMode: 'cover' },
  swatchRow: { flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
  swatchCurrent: {
    width: 36,
    height: 36,
    borderRadius: 10,
    borderWidth: StyleSheet.hairlineWidth,
  },
  swatch: {
    width: 30,
    height: 30,
    borderRadius: 8,
    borderWidth: 1,
  },
  fontGrid: { flexDirection: 'row', gap: 10, flexWrap: 'wrap' },
  fontCard: {
    flexBasis: '22%',
    minWidth: 70,
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    borderRadius: 12,
  },
  scaleCard: {
    flexBasis: '22%',
    minWidth: 70,
    paddingVertical: 14,
    alignItems: 'center',
    gap: 4,
    borderRadius: 12,
  },
  row: { flexDirection: 'row', gap: 8 },
  segment: {
    flex: 1,
    paddingVertical: 10,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 10,
    alignItems: 'center',
  },
  footerRow: { flexDirection: 'row', gap: 10, marginTop: 8 },
});
