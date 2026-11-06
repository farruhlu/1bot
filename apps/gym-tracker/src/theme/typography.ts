import { TextStyle } from 'react-native';

export const fonts = {
  display: 'Oswald_600SemiBold',
  displayBold: 'Oswald_700Bold',
  body: 'Manrope_500Medium',
  bodyBold: 'Manrope_700Bold',
  bodySemi: 'Manrope_600SemiBold',
} as const;

export const type: Record<string, TextStyle> = {
  hero: {
    fontFamily: fonts.displayBold,
    fontSize: 42,
    letterSpacing: 0.5,
    lineHeight: 48,
  },
  title: {
    fontFamily: fonts.display,
    fontSize: 28,
    letterSpacing: 0.4,
    lineHeight: 34,
  },
  section: {
    fontFamily: fonts.display,
    fontSize: 22,
    letterSpacing: 0.3,
    lineHeight: 28,
  },
  body: {
    fontFamily: fonts.body,
    fontSize: 16,
    lineHeight: 24,
  },
  bodyStrong: {
    fontFamily: fonts.bodyBold,
    fontSize: 16,
    lineHeight: 24,
  },
  label: {
    fontFamily: fonts.bodySemi,
    fontSize: 13,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  caption: {
    fontFamily: fonts.body,
    fontSize: 13,
    lineHeight: 18,
  },
};
