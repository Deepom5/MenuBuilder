import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { router, useLocalSearchParams } from 'expo-router';
import { useContext, useMemo, useState } from 'react';
import {
    Alert,
    Pressable,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TextInput,
    View,
} from 'react-native';

import { DietBadge } from '@/components/menu/diet-badge';
import { ThemedButton } from '@/components/menu/themed-button';
import { MenuContext } from '@/context/menu-context';
import { useMenuTheme } from '@/context/theme-context';
import type { DietType, MenuItem } from '@/types/menu';

const DIET_OPTIONS: DietType[] = ['veg', 'nonveg', 'vegan'];

export default function ItemEditorScreen() {
  const params = useLocalSearchParams<{ id: string; categoryId?: string }>();
  const ctx = useContext(MenuContext);
  const { colors } = useMenuTheme();
  const isNew = params.id === 'new';

  const existing = useMemo<MenuItem | null>(() => {
    if (isNew || !ctx) return null;
    return ctx.menu.items.find((i) => i.id === params.id) ?? null;
  }, [ctx, isNew, params.id]);

  const initialCategoryId =
    existing?.categoryId ?? params.categoryId ?? ctx?.menu.categories[0]?.id ?? '';

  const [name, setName] = useState(existing?.name ?? '');
  const [description, setDescription] = useState(existing?.description ?? '');
  const [priceText, setPriceText] = useState(existing ? String(existing.price) : '');
  const [diet, setDiet] = useState<DietType>(existing?.diet ?? 'veg');
  const [photoUri, setPhotoUri] = useState<string | undefined>(existing?.photoUri);
  const [available, setAvailable] = useState<boolean>(existing?.available ?? true);
  const [categoryId, setCategoryId] = useState<string>(initialCategoryId);

  if (!ctx) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.textMuted }}>Loading…</Text>
      </View>
    );
  }

  if (!isNew && !existing) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.textMuted }}>Item not found.</Text>
        <ThemedButton label="Close" variant="secondary" onPress={() => router.back()} />
      </View>
    );
  }

  if (ctx.menu.categories.length === 0) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <Text style={[styles.title, { color: colors.text }]}>No categories yet</Text>
        <Text style={{ color: colors.textMuted, textAlign: 'center' }}>
          Create a category first before adding items.
        </Text>
        <ThemedButton label="Back" variant="secondary" onPress={() => router.back()} />
      </View>
    );
  }

  const pickPhoto = async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      Alert.alert('Permission required', 'Allow photo access to add a photo.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]) {
      try {
        const localUri = await ctx.pickPhotoFromAsset(result.assets[0].uri);
        setPhotoUri(localUri);
      } catch (err) {
        Alert.alert('Could not save photo', String(err));
      }
    }
  };

  const save = () => {
    const trimmed = name.trim();
    if (!trimmed) {
      Alert.alert('Name required', 'Please give the item a name.');
      return;
    }
    const price = parseFloat(priceText.replace(',', '.')) || 0;
    if (isNew) {
      ctx.addItem({
        categoryId,
        name: trimmed,
        description: description.trim() || undefined,
        price,
        diet,
        photoUri,
        available,
      });
    } else if (existing) {
      ctx.updateItem(existing.id, {
        categoryId,
        name: trimmed,
        description: description.trim() || undefined,
        price,
        diet,
        photoUri,
        available,
      });
    }
    router.back();
  };

  const remove = () => {
    if (!existing) return;
    Alert.alert('Delete item?', `Remove "${existing.name}". This cannot be undone.`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          ctx.deleteItem(existing.id);
          router.back();
        },
      },
    ]);
  };

  return (
    <ScrollView
      contentContainerStyle={styles.content}
      style={{ backgroundColor: colors.background }}
      keyboardShouldPersistTaps="handled">
      <Field label="NAME" colors={colors}>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="e.g. Margherita Pizza"
          placeholderTextColor={colors.textMuted}
          style={[
            styles.input,
            { color: colors.text, backgroundColor: colors.surface, borderColor: colors.border },
          ]}
        />
      </Field>

      <Field label="DESCRIPTION" colors={colors}>
        <TextInput
          value={description}
          onChangeText={setDescription}
          placeholder="Short description (optional)"
          placeholderTextColor={colors.textMuted}
          multiline
          style={[
            styles.input,
            styles.multiline,
            { color: colors.text, backgroundColor: colors.surface, borderColor: colors.border },
          ]}
        />
      </Field>

      <View style={styles.row2}>
        <View style={{ flex: 1 }}>
          <Field label={`PRICE (${ctx.menu.restaurant.currency})`} colors={colors}>
            <TextInput
              value={priceText}
              onChangeText={setPriceText}
              placeholder="0.00"
              placeholderTextColor={colors.textMuted}
              keyboardType="decimal-pad"
              style={[
                styles.input,
                { color: colors.text, backgroundColor: colors.surface, borderColor: colors.border },
              ]}
            />
          </Field>
        </View>
        <View style={{ flex: 1 }}>
          <Field label="DIET" colors={colors}>
            <View style={styles.dietRow}>
              {DIET_OPTIONS.map((d) => {
                const selected = d === diet;
                return (
                  <Pressable
                    key={d}
                    onPress={() => setDiet(d)}
                    style={[
                      styles.dietBtn,
                      {
                        backgroundColor: selected ? colors.accent : colors.surface,
                        borderColor: selected ? colors.accent : colors.border,
                      },
                    ]}>
                    {selected ? (
                      <Text style={{ color: colors.accentOn, fontSize: 12, fontWeight: '700' }}>
                        {d.toUpperCase()}
                      </Text>
                    ) : (
                      <DietBadge diet={d} />
                    )}
                  </Pressable>
                );
              })}
            </View>
          </Field>
        </View>
      </View>

      <Field label="CATEGORY" colors={colors}>
        <View style={styles.chipsRow}>
          {[...ctx.menu.categories]
            .sort((a, b) => a.order - b.order)
            .map((c) => {
              const selected = c.id === categoryId;
              return (
                <Pressable
                  key={c.id}
                  onPress={() => setCategoryId(c.id)}
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
                    {c.name}
                  </Text>
                </Pressable>
              );
            })}
        </View>
      </Field>

      <Field label="PHOTO" colors={colors}>
        <View style={styles.photoRow}>
          {photoUri ? (
            <Image source={{ uri: photoUri }} style={styles.photo} contentFit="cover" />
          ) : (
            <View style={[styles.photo, styles.photoPlaceholder, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <Text style={{ color: colors.textMuted, fontSize: 28 }}>📷</Text>
            </View>
          )}
          <View style={{ gap: 8, flex: 1 }}>
            <ThemedButton label={photoUri ? 'Change photo' : 'Choose photo'} onPress={pickPhoto} variant="secondary" />
            {photoUri ? (
              <ThemedButton label="Remove" variant="secondary" onPress={() => setPhotoUri(undefined)} />
            ) : null}
          </View>
        </View>
      </Field>

      <View style={[styles.switchRow, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <View style={{ flex: 1 }}>
          <Text style={{ color: colors.text, fontWeight: '600' }}>Available</Text>
          <Text style={{ color: colors.textMuted, fontSize: 12 }}>
            Unavailable items are hidden from the customer view.
          </Text>
        </View>
        <Switch value={available} onValueChange={setAvailable} />
      </View>

      <View style={styles.actions}>
        <ThemedButton label={isNew ? 'Add item' : 'Save'} onPress={save} style={{ flex: 1 }} />
        {!isNew ? <ThemedButton label="Delete" variant="danger" onPress={remove} /> : null}
      </View>
    </ScrollView>
  );
}

function Field({
  label,
  colors,
  children,
}: {
  label: string;
  colors: ReturnType<typeof useMenuTheme>['colors'];
  children: React.ReactNode;
}) {
  return (
    <View style={{ gap: 6 }}>
      <Text style={{ color: colors.textMuted, fontSize: 11, fontWeight: '700', letterSpacing: 0.5 }}>
        {label}
      </Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  content: { padding: 16, gap: 14, paddingBottom: 48 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, gap: 12 },
  title: { fontSize: 18, fontWeight: '700' },
  input: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
  },
  multiline: { minHeight: 80, textAlignVertical: 'top' },
  row2: { flexDirection: 'row', gap: 12 },
  dietRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  dietBtn: {
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 8,
    borderWidth: StyleSheet.hairlineWidth,
    minHeight: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipsRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: StyleSheet.hairlineWidth,
  },
  photoRow: { flexDirection: 'row', gap: 12, alignItems: 'center' },
  photo: { width: 96, height: 96, borderRadius: 12 },
  photoPlaceholder: {
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
    justifyContent: 'center',
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderRadius: 10,
    borderWidth: StyleSheet.hairlineWidth,
  },
  actions: { flexDirection: 'row', gap: 12, marginTop: 8 },
});
