import { router } from 'expo-router';
import { useContext, useState } from 'react';
import {
    Alert,
    FlatList,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { EmptyState } from '@/components/menu/empty-state';
import { ItemRow } from '@/components/menu/item-row';
import { ThemedButton } from '@/components/menu/themed-button';
import { MenuContext } from '@/context/menu-context';
import { useMenuTheme } from '@/context/theme-context';
import type { Category } from '@/types/menu';

export default function BuilderScreen() {
  const ctx = useContext(MenuContext);
  const { colors } = useMenuTheme();
  const [newCategory, setNewCategory] = useState('');

  if (!ctx) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.textMuted }}>Loading…</Text>
      </View>
    );
  }

  const { menu, addCategory, deleteCategory, itemsByCategory } = ctx;
  const categories = [...menu.categories].sort((a, b) => a.order - b.order);

  const handleAddCategory = () => {
    const name = newCategory.trim();
    if (!name) return;
    addCategory(name);
    setNewCategory('');
  };

  const confirmDeleteCategory = (category: Category) => {
    Alert.alert(
      'Delete category?',
      `Remove "${category.name}" and all items in it. This cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => deleteCategory(category.id) },
      ],
    );
  };

  return (
    <SafeAreaView edges={['top']} style={[styles.flex, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={[styles.title, { color: colors.text }]}>{menu.restaurant.name}</Text>
          {menu.restaurant.tagline ? (
            <Text style={[styles.tagline, { color: colors.textMuted }]}>
              {menu.restaurant.tagline}
            </Text>
          ) : null}
        </View>
        <Pressable
          onPress={() => router.push('/qr')}
          style={[styles.iconBtn, { backgroundColor: colors.surface, borderColor: colors.border }]}
          accessibilityLabel="Share or export menu">
          <Text style={{ fontSize: 18 }}>📤</Text>
        </Pressable>
        <Pressable
          onPress={() => router.push('/settings')}
          style={[styles.iconBtn, { backgroundColor: colors.surface, borderColor: colors.border }]}
          accessibilityLabel="Open settings">
          <Text style={{ fontSize: 20 }}>⚙️</Text>
        </Pressable>
      </View>

      <View style={[styles.addRow, { borderColor: colors.border, backgroundColor: colors.surface }]}>
        <TextInput
          placeholder="Add a category (e.g. Starters)"
          placeholderTextColor={colors.textMuted}
          value={newCategory}
          onChangeText={setNewCategory}
          onSubmitEditing={handleAddCategory}
          returnKeyType="done"
          style={[styles.input, { color: colors.text }]}
        />
        <ThemedButton label="Add" onPress={handleAddCategory} />
      </View>

      <FlatList
        data={categories}
        keyExtractor={(c) => c.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <EmptyState
            icon="🧾"
            title="No categories yet"
            hint="Add a category above to start building your menu."
          />
        }
        renderItem={({ item: category }) => {
          const items = itemsByCategory(category.id);
          return (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Pressable
                  onPress={() => router.push({ pathname: '/category/[id]', params: { id: category.id } })}
                  style={{ flex: 1 }}
                  hitSlop={6}>
                  <Text style={[styles.sectionTitle, { color: colors.text }]}>{category.name}</Text>
                  <Text style={[styles.sectionMeta, { color: colors.textMuted }]}>
                    {items.length} {items.length === 1 ? 'item' : 'items'}
                  </Text>
                </Pressable>
                <Pressable
                  onPress={() => confirmDeleteCategory(category)}
                  hitSlop={10}
                  accessibilityLabel={`Delete ${category.name}`}>
                  <Text style={{ color: colors.textMuted, fontSize: 20 }}>🗑️</Text>
                </Pressable>
              </View>

              <View style={{ gap: 8 }}>
                {items.map((item) => (
                  <ItemRow
                    key={item.id}
                    item={item}
                    currency={menu.restaurant.currency}
                    showAvailability
                    onPress={() =>
                      router.push({ pathname: '/item/[id]', params: { id: item.id } })
                    }
                  />
                ))}
              </View>

              <Pressable
                onPress={() =>
                  router.push({
                    pathname: '/item/[id]',
                    params: { id: 'new', categoryId: category.id },
                  })
                }
                style={[styles.addItem, { borderColor: colors.border }]}
                accessibilityLabel={`Add item to ${category.name}`}>
                <Text style={{ color: colors.accent, fontWeight: '600' }}>+ Add item</Text>
              </Pressable>
            </View>
          );
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
    gap: 12,
  },
  title: { fontSize: 24, fontWeight: '700' },
  tagline: { fontSize: 13, marginTop: 2 },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 10,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 10,
    borderWidth: StyleSheet.hairlineWidth,
  },
  input: { flex: 1, fontSize: 15, paddingVertical: 6 },
  list: { padding: 16, paddingTop: 8, gap: 16, paddingBottom: 24 },
  section: { gap: 8 },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  sectionTitle: { fontSize: 18, fontWeight: '700' },
  sectionMeta: { fontSize: 12 },
  addItem: {
    padding: 12,
    borderRadius: 10,
    borderWidth: StyleSheet.hairlineWidth,
    borderStyle: 'dashed',
    alignItems: 'center',
  },
});
