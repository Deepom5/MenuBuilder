/**
 * Deep-link helpers. The QR code on a restaurant's table encodes a
 * `menubuilder://preview/<restaurantId>` URL so any device that has the
 * app installed and the same menu loaded will open straight to the
 * customer preview screen.
 */

const SCHEME = 'menubuilder';

export function buildPreviewDeepLink(restaurantId: string): string {
  return `${SCHEME}://preview/${encodeURIComponent(restaurantId)}`;
}
