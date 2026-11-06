import React, { useMemo, useState } from 'react';
import {
  Alert,
  FlatList,
  Modal,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Atmosphere } from '../../components/Atmosphere';
import { Field } from '../../components/Field';
import { PrimaryButton } from '../../components/PrimaryButton';
import { SetRow } from '../../components/SetRow';
import { TrendChart } from '../../components/TrendChart';
import { buildExerciseProgress } from '../../lib/progress';
import { useData } from '../../store/DataContext';
import type { SetEntry } from '../../lib/types';
import { colors } from '../../theme/colors';
import { type } from '../../theme/typography';

export default function ExerciseScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const { data, editSet, removeSet } = useData();
  const [editing, setEditing] = useState<SetEntry | null>(null);
  const [weight, setWeight] = useState('');
  const [reps, setReps] = useState('');
  const [sets, setSets] = useState('');
  const [notes, setNotes] = useState('');

  const exercise = data?.exercises.find((e) => e.id === id);
  const entries = useMemo(
    () => (data?.sets ?? []).filter((s) => s.exerciseId === id),
    [data, id],
  );
  const progress = useMemo(
    () => buildExerciseProgress(entries)[0],
    [entries],
  );

  const openEdit = (item: SetEntry) => {
    setEditing(item);
    setWeight(String(item.weightKg));
    setReps(String(item.reps));
    setSets(String(item.sets));
    setNotes(item.notes);
  };

  const saveEdit = async () => {
    if (!editing) return;
    await editSet(editing.id, {
      weightKg: Number(String(weight).replace(',', '.')),
      reps: Number(reps),
      sets: Number(sets),
      notes,
    });
    setEditing(null);
  };

  return (
    <Atmosphere>
      <View style={[styles.root, { paddingTop: insets.top + 12 }]}>
        <PrimaryButton
          label="← Назад"
          variant="ghost"
          onPress={() => router.back()}
          style={{ alignSelf: 'flex-start', marginHorizontal: 20, minHeight: 48 }}
        />
        <Text style={styles.title}>{exercise?.name ?? 'Упражнение'}</Text>
        {progress ? (
          <View style={styles.chartBlock}>
            <Text style={styles.trend}>{progress.trendLabel}</Text>
            <TrendChart
              points={progress.points.map((p) => ({
                date: p.date,
                value: p.weightKg,
              }))}
              trend={progress.trend}
            />
          </View>
        ) : null}
        <FlatList
          data={entries}
          keyExtractor={(i) => i.id}
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingBottom: insets.bottom + 24,
          }}
          renderItem={({ item }) => (
            <SetRow item={item} onPress={() => openEdit(item)} />
          )}
          ListEmptyComponent={
            <Text style={styles.empty}>Нет записей по этому упражнению</Text>
          }
        />
      </View>

      <Modal visible={!!editing} animationType="slide" transparent>
        <View style={styles.modalBackdrop}>
          <View style={[styles.modal, { paddingBottom: insets.bottom + 16 }]}>
            <Text style={styles.modalTitle}>Править подход</Text>
            <Field label="Вес, кг" value={weight} onChangeText={setWeight} keyboardType="decimal-pad" />
            <Field label="Подходы" value={sets} onChangeText={setSets} keyboardType="number-pad" />
            <Field label="Повторы" value={reps} onChangeText={setReps} keyboardType="number-pad" />
            <Field label="Заметки" value={notes} onChangeText={setNotes} />
            <PrimaryButton label="Сохранить" onPress={() => void saveEdit()} />
            <PrimaryButton
              label="Удалить"
              variant="danger"
              onPress={() => {
                if (!editing) return;
                Alert.alert('Удалить подход?', '', [
                  { text: 'Отмена', style: 'cancel' },
                  {
                    text: 'Удалить',
                    style: 'destructive',
                    onPress: () => {
                      void removeSet(editing.id);
                      setEditing(null);
                    },
                  },
                ]);
              }}
            />
            <PrimaryButton label="Закрыть" variant="ghost" onPress={() => setEditing(null)} />
          </View>
        </View>
      </Modal>
    </Atmosphere>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  title: {
    ...type.title,
    color: colors.sand,
    paddingHorizontal: 20,
    marginTop: 8,
    marginBottom: 8,
  },
  chartBlock: { paddingHorizontal: 20, marginBottom: 8, gap: 6 },
  trend: { ...type.label, color: colors.copperBright },
  empty: { ...type.body, color: colors.inkFaint, textAlign: 'center', marginTop: 24 },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'flex-end',
  },
  modal: {
    backgroundColor: colors.bgElevated,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    gap: 12,
  },
  modalTitle: { ...type.section, color: colors.ink, marginBottom: 4 },
});
