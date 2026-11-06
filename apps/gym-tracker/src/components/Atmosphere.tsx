import React from 'react';
import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../theme/colors';

export function Atmosphere({ children }: { children: React.ReactNode }) {
  return (
    <View style={styles.root}>
      <LinearGradient
        colors={['#2A1A12', colors.bg, '#0E0C0A']}
        start={{ x: 0.1, y: 0 }}
        end={{ x: 0.9, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <LinearGradient
        colors={['rgba(214,106,46,0.22)', 'transparent', 'rgba(230,211,179,0.06)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0.7 }}
        style={styles.glow}
      />
      <View style={styles.grain} pointerEvents="none" />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  glow: {
    position: 'absolute',
    top: -40,
    left: -20,
    right: -20,
    height: 280,
  },
  grain: {
    ...StyleSheet.absoluteFill,
    opacity: 0.04,
    backgroundColor: 'transparent',
    borderWidth: 0,
  },
});
