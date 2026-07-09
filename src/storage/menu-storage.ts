import { Directory, File, Paths } from 'expo-file-system';

import { DEFAULT_TEMPLATE_ID } from '@/features/templates/configs';
import type { Menu } from '@/types/menu';
import { createId } from '@/utils/id';

const MENU_FILENAME = 'menu.json';
const PHOTOS_DIRNAME = 'photos';

function menuFile(): File {
  return new File(Paths.document, MENU_FILENAME);
}

function photosDir(): Directory {
  return new Directory(Paths.document, PHOTOS_DIRNAME);
}

export function createEmptyMenu(): Menu {
  return {
    version: 2,
    restaurant: {
      id: createId(),
      name: '',
      tagline: '',
      currency: 'USD',
      templateId: DEFAULT_TEMPLATE_ID,
      overrides: {},
    },
    categories: [],
    items: [],
    favoriteTemplates: [],
    recentTemplates: [],
    onboardingComplete: false,
    updatedAt: new Date().toISOString(),
  };
}

export async function loadMenu(): Promise<Menu> {
  const file = menuFile();
  if (!file.exists) return createEmptyMenu();
  try {
    const text = await file.text();
    const parsed = JSON.parse(text) as unknown;
    return migrateMenu(parsed);
  } catch {
    return createEmptyMenu();
  }
}

export async function saveMenu(menu: Menu): Promise<void> {
  const next: Menu = { ...menu, updatedAt: new Date().toISOString() };
  const file = menuFile();
  if (!file.exists) file.create();
  file.write(JSON.stringify(next));
}

export async function copyPhotoToAppStorage(sourceUri: string): Promise<string> {
  const dir = photosDir();
  if (!dir.exists) dir.create({ intermediates: true });
  const ext = sourceUri.split('.').pop()?.split('?')[0] || 'jpg';
  const dest = new File(dir, `${createId()}.${ext}`);
  const src = new File(sourceUri);
  await src.copy(dest);
  return dest.uri;
}

export function deletePhoto(uri: string | undefined): void {
  if (!uri) return;
  try {
    const file = new File(uri);
    if (file.exists) file.delete();
  } catch {
    // ignore — orphan files won't break the app
  }
}

/**
 * Migrates any persisted blob into the current `Menu` schema. Unknown shapes
 * fall back to a fresh empty menu rather than crashing.
 */
export function migrateMenu(input: unknown): Menu {
  if (!input || typeof input !== 'object') return createEmptyMenu();
  const raw = input as Record<string, unknown>;
  const version = typeof raw.version === 'number' ? raw.version : 1;

  if (version === 2) return normalizeV2(raw);
  if (version === 1) return migrateV1ToV2(raw);
  return createEmptyMenu();
}

function normalizeV2(raw: Record<string, unknown>): Menu {
  const empty = createEmptyMenu();
  const restaurant = (raw.restaurant ?? {}) as Record<string, unknown>;
  return {
    version: 2,
    restaurant: {
      id: (restaurant.id as string) || empty.restaurant.id,
      name: (restaurant.name as string) ?? '',
      tagline: (restaurant.tagline as string) ?? '',
      currency: (restaurant.currency as string) || 'USD',
      templateId: (restaurant.templateId as string) || DEFAULT_TEMPLATE_ID,
      overrides: (restaurant.overrides as Menu['restaurant']['overrides']) ?? {},
      logoUri: (restaurant.logoUri as string) || undefined,
      coverUri: (restaurant.coverUri as string) || undefined,
    },
    categories: Array.isArray(raw.categories) ? (raw.categories as Menu['categories']) : [],
    items: Array.isArray(raw.items) ? (raw.items as Menu['items']) : [],
    favoriteTemplates: Array.isArray(raw.favoriteTemplates)
      ? (raw.favoriteTemplates as string[])
      : [],
    recentTemplates: Array.isArray(raw.recentTemplates) ? (raw.recentTemplates as string[]) : [],
    onboardingComplete: Boolean(raw.onboardingComplete),
    updatedAt: (raw.updatedAt as string) || new Date().toISOString(),
  };
}

// Legacy v1 stored a `themeId` per Restaurant. Map old palette ids to the
// closest new template so users keep a familiar look after upgrading; legacy
// users skip onboarding since they already have data.
const LEGACY_THEME_TO_TEMPLATE: Record<string, string> = {
  classic: 'minimal-white',
  warm: 'modern-cafe',
  forest: 'vegan-green',
  midnight: 'luxury-black',
  rose: 'bakery-sweet',
};

function migrateV1ToV2(raw: Record<string, unknown>): Menu {
  const restaurant = (raw.restaurant ?? {}) as Record<string, unknown>;
  const legacyThemeId = (restaurant.themeId as string) || '';
  return {
    version: 2,
    restaurant: {
      id: (restaurant.id as string) || createId(),
      name: (restaurant.name as string) ?? '',
      tagline: (restaurant.tagline as string) ?? '',
      currency: (restaurant.currency as string) || 'USD',
      templateId: LEGACY_THEME_TO_TEMPLATE[legacyThemeId] ?? DEFAULT_TEMPLATE_ID,
      overrides: {},
    },
    categories: Array.isArray(raw.categories) ? (raw.categories as Menu['categories']) : [],
    items: Array.isArray(raw.items) ? (raw.items as Menu['items']) : [],
    favoriteTemplates: [],
    recentTemplates: [],
    onboardingComplete: true,
    updatedAt: (raw.updatedAt as string) || new Date().toISOString(),
  };
}
