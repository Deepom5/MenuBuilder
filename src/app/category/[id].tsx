import { router, useLocalSearchParams } from 'expo-router';
import { useContext, useMemo, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { ItemRow } from '@/components/menu/item-row';
import { ThemedButton } from '@/components/menu/themed-button';
import { MenuContext } from '@/context/menu-context';
import { useMenuTheme } from '@/context/theme-context';

export default function CategoryScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const ctx = useContext(MenuContext);
  const { colors } = useMenuTheme();

  const category = useMemo(
    () => ctx?.menu.categories.find((c) => c.id === id) ?? null,
    [ctx, id],
  );
  const [name, setName] = useState(category?.name ?? '');

  if (!ctx || !category) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.textMuted }}>Category not found.</Text>
        <ThemedButton label="Close" variant="secondary" onPress={() => router.back()} />
      </View>
    );
  }

  const { updateCategory, deleteCategory, itemsByCategory, menu } = ctx;
  const items = itemsByCategory(category.id);

  const save = () => {
    updateCategory(category.id, { name: name.trim() || category.name });
    router.back();
  };

  const remove = () => {
    Alert.alert('Delete category?', `Removes "${category.name}" and all its items.`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          deleteCategory(category.id);
          router.back();
        },
      },
    ]);
  };

  return (
    <ScrollView
      contentContainerStyle={styles.content}
      style={{ backgroundColor: colors.background }}>
      <Text style={[styles.label, { color: colors.textMuted }]}>NAME</Text>
      <TextInput
        value={name}
        onChangeText={setName}
        placeholder="Category name"
        placeholderTextColor={colors.textMuted}
        style={[
          styles.input,
          { color: colors.text, backgroundColor: colors.surface, borderColor: colors.border },
        ]}
      />

      <Text style={[styles.label, { color: colors.textMuted, marginTop: 16 }]}>
        {items.length} {items.length === 1 ? 'ITEM' : 'ITEMS'}
      </Text>
      <View style={{ gap: 8 }}>
        {items.map((item) => (
          <ItemRow
            key={item.id}
            item={item}
            currency={menu.restaurant.currency}
            showAvailability
            onPress={() => router.push({ pathname: '/item/[id]', params: { id: item.id } })}
          />
        ))}
        {items.length === 0 ? (
          <Text style={{ color: colors.textMuted, fontStyle: 'italic' }}>No items yet.</Text>
        ) : null}
      </View>

      <View style={styles.actions}>
        <ThemedButton label="Save" onPress={save} style={{ flex: 1 }} />
        <ThemedButton label="Delete" variant="danger" onPress={remove} style={{ flex: 1 }} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { padding: 16, gap: 6, paddingBottom: 48 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, gap: 12 },
  label: { fontSize: 11, fontWeight: '700', letterSpacing: 0.5 },
  input: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
  },
  actions: { flexDirection: 'row', gap: 12, marginTop: 24 },
});
