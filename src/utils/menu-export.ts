import * as DocumentPicker from 'expo-document-picker';
import { File, Paths } from 'expo-file-system';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

import { migrateMenu } from '@/storage/menu-storage';
import type { Menu } from '@/types/menu';
import { buildMenuHtml } from '@/utils/menu-html';

function safeFilename(name: string): string {
  return name.replace(/[^a-z0-9-_]+/gi, '_').slice(0, 40) || 'menu';
}

export async function exportMenuAsJson(menu: Menu): Promise<void> {
  const filename = `${safeFilename(menu.restaurant.name)}.menu.json`;
  const file = new File(Paths.cache, filename);
  if (file.exists) file.delete();
  file.create();
  file.write(JSON.stringify(menu, null, 2));

  if (await Sharing.isAvailableAsync()) {
    await Sharing.shareAsync(file.uri, {
      mimeType: 'application/json',
      dialogTitle: 'Export menu',
      UTI: 'public.json',
    });
  }
}

export async function importMenuFromJson(): Promise<Menu | null> {
  const result = await DocumentPicker.getDocumentAsync({
    type: 'application/json',
    copyToCacheDirectory: true,
    multiple: false,
  });
  if (result.canceled || !result.assets?.length) return null;
  const asset = result.assets[0];
  const file = new File(asset.uri);
  const text = await file.text();
  const parsed: unknown = JSON.parse(text);
  if (!parsed || typeof parsed !== 'object' || !('restaurant' in parsed)) {
    throw new Error('This file does not look like a MenuBuilder export.');
  }
  // Run through the same migration path as on-disk loads so older exports
  // remain importable after schema bumps.
  return migrateMenu(parsed);
}

export async function exportMenuAsPdf(menu: Menu): Promise<void> {
  const html = buildMenuHtml(menu);
  const { uri } = await Print.printToFileAsync({ html });

  if (await Sharing.isAvailableAsync()) {
    await Sharing.shareAsync(uri, {
      mimeType: 'application/pdf',
      dialogTitle: 'Share menu PDF',
      UTI: 'com.adobe.pdf',
    });
  }
}
