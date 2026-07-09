import { Pressable, StyleSheet, Text, View, type ViewStyle } from 'react-native';

import { useMenuTheme } from '@/context/theme-context';

type Variant = 'primary' | 'secondary' | 'danger';

type Props = {
  label: string;
  onPress: () => void;
  variant?: Variant;
  disabled?: boolean;
  style?: ViewStyle;
};

export function ThemedButton({ label, onPress, variant = 'primary', disabled, style }: Readonly<Props>) {
  const { colors } = useMenuTheme();

  const palette = (() => {
    if (variant === 'danger') return { bg: colors.nonveg, fg: '#FFFFFF', border: colors.nonveg };
    if (variant === 'secondary')
      return { bg: colors.surface, fg: colors.text, border: colors.border };
    return { bg: colors.accent, fg: colors.accentOn, border: colors.accent };
  })();

  const computeOpacity = (pressed: boolean) => {
    if (disabled) return 0.5;
    return pressed ? 0.8 : 1;
  };

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.btn,
        {
          backgroundColor: palette.bg,
          borderColor: palette.border,
          opacity: computeOpacity(pressed),
        },
        style,
      ]}>
      <Text style={[styles.label, { color: palette.fg }]}>{label}</Text>
    </Pressable>
  );
}

export function ThemedTextInputBox({ children }: Readonly<{ children: React.ReactNode }>) {
  const { colors } = useMenuTheme();
  return (
    <View
      style={{
        backgroundColor: colors.surface,
        borderColor: colors.border,
        borderWidth: StyleSheet.hairlineWidth,
        borderRadius: 10,
        paddingHorizontal: 12,
        paddingVertical: 10,
      }}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  btn: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: { fontSize: 15, fontWeight: '600' },
});
