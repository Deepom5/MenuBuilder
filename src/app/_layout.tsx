import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import { useContext } from 'react';
import { useColorScheme } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { MenuContext, MenuProvider } from '@/context/menu-context';
import { MenuThemeProvider } from '@/context/theme-context';
import { DEFAULT_TEMPLATE_ID } from '@/features/templates/configs';

/**
 * Reads the active template + overrides from the loaded menu so the theme
 * re-resolves whenever the user picks a different template or tweaks the
 * customization studio.
 */
function MenuThemeBridge({ children }: Readonly<{ children: React.ReactNode }>) {
  const ctx = useContext(MenuContext);
  const templateId = ctx?.menu.restaurant.templateId ?? DEFAULT_TEMPLATE_ID;
  const overrides = ctx?.menu.restaurant.overrides ?? {};
  return (
    <MenuThemeProvider templateId={templateId} overrides={overrides}>
      {children}
    </MenuThemeProvider>
  );
}

export default function RootLayout() {
  const colorScheme = useColorScheme();
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <MenuProvider>
          <MenuThemeBridge>
            <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
              <Stack>
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen name="onboarding/welcome" options={{ headerShown: false }} />
                <Stack.Screen name="onboarding/restaurant" options={{ headerShown: false }} />
                <Stack.Screen name="onboarding/gallery" options={{ headerShown: false }} />
                <Stack.Screen
                  name="template-preview/[id]"
                  options={{ title: 'Preview', headerShown: false, presentation: 'modal' }}
                />
                <Stack.Screen
                  name="gallery"
                  options={{ title: 'Templates', presentation: 'modal' }}
                />
                <Stack.Screen
                  name="customize"
                  options={{ title: 'Customize', presentation: 'modal' }}
                />
                <Stack.Screen
                  name="category/[id]"
                  options={{ title: 'Category', presentation: 'modal' }}
                />
                <Stack.Screen
                  name="item/[id]"
                  options={{ title: 'Item', presentation: 'modal' }}
                />
                <Stack.Screen
                  name="settings"
                  options={{ title: 'Settings', presentation: 'modal' }}
                />
                <Stack.Screen
                  name="qr"
                  options={{ title: 'Share Menu', presentation: 'modal' }}
                />
              </Stack>
            </ThemeProvider>
          </MenuThemeBridge>
        </MenuProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
