import React from 'react';
import { Tabs } from 'expo-router';
import { colors } from '../../theme/colors';
import { fonts } from '../../theme/typography';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarIcon: () => null,
        tabBarStyle: {
          backgroundColor: colors.bgElevated,
          borderTopColor: colors.line,
          height: 64,
          paddingBottom: 12,
          paddingTop: 10,
        },
        tabBarActiveTintColor: colors.copperBright,
        tabBarInactiveTintColor: colors.inkFaint,
        tabBarLabelStyle: {
          fontFamily: fonts.bodySemi,
          fontSize: 14,
        },
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Запись', tabBarLabel: 'Запись' }} />
      <Tabs.Screen name="history" options={{ title: 'История', tabBarLabel: 'История' }} />
      <Tabs.Screen name="progress" options={{ title: 'Прогресс', tabBarLabel: 'Прогресс' }} />
    </Tabs>
  );
}
