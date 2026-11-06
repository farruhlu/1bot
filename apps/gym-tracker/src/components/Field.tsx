import React from 'react';
import { StyleSheet, Text, TextInput, View, TextInputProps } from 'react-native';
import { colors } from '../theme/colors';
import { type } from '../theme/typography';

type Props = TextInputProps & {
  label: string;
};

export function Field({ label, style, ...rest }: Props) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        placeholderTextColor={colors.inkFaint}
        style={[styles.input, style]}
        {...rest}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: 8,
  },
  label: {
    ...type.label,
    color: colors.inkMuted,
  },
  input: {
    minHeight: 56,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: colors.bgSoft,
    color: colors.ink,
    fontFamily: 'Manrope_500Medium',
    fontSize: 18,
    borderWidth: 1,
    borderColor: colors.line,
  },
});
