import { Redirect } from 'expo-router';
import { NativeTabs } from 'expo-router/unstable-native-tabs';

import { useMenu } from '@/context/menu-context';
import { useMenuTheme } from '@/context/theme-context';

export default function TabsLayout() {
  const { menu } = useMenu();
  const { colors } = useMenuTheme();

  // First launch — send the user through onboarding before they can see the
  // main builder/preview tabs.
  if (!menu.onboardingComplete) {
    return <Redirect href="/onboarding/welcome" />;
  }

  return (
    <NativeTabs
      backgroundColor={colors.background}
      indicatorColor={colors.surface}
      labelStyle={{ selected: { color: colors.accent } }}>
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Label>Builder</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          src={require('@/assets/images/tabIcons/home.png')}
          renderingMode="template"
        />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="preview">
        <NativeTabs.Trigger.Label>Preview</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          src={require('@/assets/images/tabIcons/explore.png')}
          renderingMode="template"
        />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
