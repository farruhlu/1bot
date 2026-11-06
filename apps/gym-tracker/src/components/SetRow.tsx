import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';
import { type } from '../theme/typography';
import type { SetEntry } from '../lib/types';

function formatDate(iso: string): string {
  try {
    return new Intl.DateTimeFormat('ru-RU', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

type Props = {
  item: SetEntry;
  onPress?: () => void;
  showExercise?: boolean;
};

export function SetRow({ item, onPress, showExercise }: Props) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.row, pressed && { opacity: 0.85 }]}
    >
      <View style={styles.left}>
        {showExercise ? (
          <Text style={styles.exercise}>{item.exerciseName}</Text>
        ) : null}
        <Text style={styles.main}>
          {item.weightKg} кг · {item.sets}×{item.reps}
        </Text>
        {item.notes ? <Text style={styles.notes}>{item.notes}</Text> : null}
      </View>
      <View style={styles.right}>
        <Text style={styles.date}>{formatDate(item.createdAt)}</Text>
        <Text style={styles.source}>
          {item.source === 'voice' ? 'голос' : item.source === 'seed' ? 'демо' : 'текст'}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    minHeight: 72,
    paddingVertical: 14,
    paddingHorizontal: 4,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.line,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  left: { flex: 1, gap: 4 },
  right: { alignItems: 'flex-end', gap: 4 },
  exercise: { ...type.bodyStrong, color: colors.sand },
  main: { ...type.bodyStrong, color: colors.ink, fontSize: 18 },
  notes: { ...type.caption, color: colors.inkMuted },
  date: { ...type.caption, color: colors.inkFaint },
  source: { ...type.label, fontSize: 10, color: colors.copperBright },
});
