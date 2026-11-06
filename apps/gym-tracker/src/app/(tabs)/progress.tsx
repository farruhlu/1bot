import React, { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Atmosphere } from '../../components/Atmosphere';
import { TrendChart } from '../../components/TrendChart';
import { buildExerciseProgress } from '../../lib/progress';
import { useData } from '../../store/DataContext';
import type { TrendKind } from '../../lib/types';
import { colors } from '../../theme/colors';
import { type } from '../../theme/typography';

const badgeColor: Record<TrendKind, string> = {
  gain: colors.success,
  plateau: colors.warning,
  regression: colors.danger,
  new: colors.inkMuted,
};

export default function ProgressScreen() {
  const insets = useSafeAreaInsets();
  const { data } = useData();
  const reports = useMemo(
    () => buildExerciseProgress(data?.sets ?? []),
    [data],
  );

  return (
    <Atmosphere>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 32 },
        ]}
      >
        <Animated.View entering={FadeInDown.duration(400)} style={styles.header}>
          <Text style={styles.title}>Прогресс</Text>
          <Text style={styles.sub}>
            Вес и объём во времени — рост, плато и регрессии
          </Text>
        </Animated.View>

        {reports.length === 0 ? (
          <Text style={styles.empty}>Нет данных для отчёта</Text>
        ) : (
          reports.map((r, idx) => (
            <Animated.View
              key={r.exerciseId}
              entering={FadeInDown.delay(60 * idx).duration(400)}
              style={styles.card}
            >
              <Pressable onPress={() => router.push(`/exercise/${r.exerciseId}`)}>
                <View style={styles.cardHead}>
                  <Text style={styles.exName}>{r.exerciseName}</Text>
                  <View
                    style={[
                      styles.badge,
                      { borderColor: badgeColor[r.trend] },
                    ]}
                  >
                    <Text style={[styles.badgeText, { color: badgeColor[r.trend] }]}>
                      {r.trendLabel}
                    </Text>
                  </View>
                </View>
                <Text style={styles.meta}>
                  Сейчас {r.latestWeight} кг · объём {Math.round(r.latestVolume)} · Δ{' '}
                  {r.deltaWeight > 0 ? '+' : ''}
                  {r.deltaWeight.toFixed(1)} кг
                </Text>
                <TrendChart
                  points={r.points.map((p) => ({ date: p.date, value: p.weightKg }))}
                  trend={r.trend}
                />
                <Text style={styles.volumeLabel}>Объём (вес × повторы × подходы)</Text>
                <TrendChart
                  points={r.points.map((p) => ({ date: p.date, value: p.volume }))}
                  trend={r.trend}
                  unit=""
                  height={100}
                />
              </Pressable>
            </Animated.View>
          ))
        )}
      </ScrollView>
    </Atmosphere>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 20, gap: 18 },
  header: { gap: 6, marginBottom: 4 },
  title: { ...type.title, color: colors.sand },
  sub: { ...type.body, color: colors.inkMuted },
  empty: { ...type.body, color: colors.inkFaint, marginTop: 40, textAlign: 'center' },
  card: {
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.line,
    gap: 8,
  },
  cardHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  exName: { ...type.section, color: colors.ink, flex: 1 },
  badge: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
    minHeight: 36,
    justifyContent: 'center',
  },
  badgeText: { ...type.label, fontSize: 11 },
  meta: { ...type.caption, color: colors.inkMuted },
  volumeLabel: { ...type.label, color: colors.inkFaint, marginTop: 8 },
});
