import { useContext } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';

import { ThemedButton } from '@/components/menu/themed-button';
import { MenuContext } from '@/context/menu-context';
import { useMenuTheme } from '@/context/theme-context';
import { buildPreviewDeepLink } from '@/utils/deep-link';
import { exportMenuAsJson, exportMenuAsPdf } from '@/utils/menu-export';

export default function ShareScreen() {
  const ctx = useContext(MenuContext);
  const { colors } = useMenuTheme();

  if (!ctx) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.textMuted }}>Loading…</Text>
      </View>
    );
  }

  const { menu } = ctx;
  const deepLink = buildPreviewDeepLink(menu.restaurant.id);

  return (
    <ScrollView
      contentContainerStyle={styles.content}
      style={{ backgroundColor: colors.background }}>
      <View style={[styles.qrCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <View style={[styles.qrFrame, { backgroundColor: '#FFFFFF' }]}>
          <QRCode value={deepLink} size={220} backgroundColor="#FFFFFF" color="#000000" />
        </View>
        <Text style={[styles.qrTitle, { color: colors.text }]}>{menu.restaurant.name}</Text>
        <Text style={[styles.qrSub, { color: colors.textMuted }]}>
          Scan with another device that has MenuBuilder installed to open this preview.
        </Text>
        <Text style={[styles.deeplink, { color: colors.textMuted }]} selectable>
          {deepLink}
        </Text>
      </View>

      <View style={styles.actions}>
        <ThemedButton label="Export as PDF" onPress={() => exportMenuAsPdf(menu)} />
        <ThemedButton
          label="Export as JSON"
          variant="secondary"
          onPress={() => exportMenuAsJson(menu)}
        />
      </View>

      <Text style={[styles.note, { color: colors.textMuted }]}>
        Everything stays on this device. Use Export to send your menu to a printer, customers,
        or another device.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { padding: 16, gap: 16, paddingBottom: 48 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  qrCard: {
    alignItems: 'center',
    padding: 20,
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    gap: 10,
  },
  qrFrame: { padding: 16, borderRadius: 12 },
  qrTitle: { fontSize: 18, fontWeight: '700', marginTop: 8 },
  qrSub: { fontSize: 13, textAlign: 'center', lineHeight: 18 },
  deeplink: { fontSize: 11, fontFamily: 'monospace' },
  actions: { gap: 10 },
  note: { fontSize: 12, textAlign: 'center', lineHeight: 18 },
});
