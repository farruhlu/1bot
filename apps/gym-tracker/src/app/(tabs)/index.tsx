import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  FadeInDown,
  FadeIn,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { Atmosphere } from '../../components/Atmosphere';
import { Field } from '../../components/Field';
import { PrimaryButton } from '../../components/PrimaryButton';
import { useVoiceInput } from '../../hooks/useVoiceInput';
import { parseWorkoutLine } from '../../lib/parser';
import { useData } from '../../store/DataContext';
import { colors } from '../../theme/colors';
import { type } from '../../theme/typography';

export default function LogScreen() {
  const insets = useSafeAreaInsets();
  const { data, logSet } = useData();
  const [exerciseName, setExerciseName] = useState('Жим лёжа');
  const [weight, setWeight] = useState('80');
  const [reps, setReps] = useState('8');
  const [sets, setSets] = useState('3');
  const [notes, setNotes] = useState('');
  const [rawLine, setRawLine] = useState('');
  const [source, setSource] = useState<'typed' | 'voice'>('typed');
  const [transcript, setTranscript] = useState('');
  const [savedFlash, setSavedFlash] = useState(false);

  const applyParsed = useCallback((text: string, fromVoice: boolean) => {
    const parsed = parseWorkoutLine(text);
    if (parsed.exerciseName) setExerciseName(parsed.exerciseName);
    if (parsed.weightKg != null) setWeight(String(parsed.weightKg));
    if (parsed.reps != null) setReps(String(parsed.reps));
    if (parsed.sets != null) setSets(String(parsed.sets));
    if (parsed.notes) setNotes(parsed.notes);
    setRawLine(text);
    setSource(fromVoice ? 'voice' : 'typed');
    setTranscript(text);
  }, []);

  const voice = useVoiceInput((finalText) => {
    applyParsed(finalText, true);
  });

  const pulse = useSharedValue(1);
  useEffect(() => {
    if (voice.listening) {
      pulse.value = withRepeat(withTiming(1.15, { duration: 650 }), -1, true);
    } else {
      pulse.value = withTiming(1, { duration: 200 });
    }
  }, [voice.listening, pulse]);

  const micStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
  }));

  const suggestions = useMemo(
    () => data?.exercises.slice(0, 8) ?? [],
    [data],
  );

  const onSave = async () => {
    const w = Number(String(weight).replace(',', '.'));
    const r = Number(reps);
    const s = Number(sets);
    if (!exerciseName.trim() || !Number.isFinite(w) || !Number.isFinite(r) || !Number.isFinite(s)) {
      Alert.alert('Проверьте поля', 'Нужны упражнение, вес, повторы и подходы.');
      return;
    }
    await logSet({
      exerciseName: exerciseName.trim(),
      weightKg: w,
      reps: r,
      sets: s,
      notes,
      source,
      rawTranscript: transcript || undefined,
    });
    setSavedFlash(true);
    setNotes('');
    setTimeout(() => setSavedFlash(false), 1600);
  };

  return (
    <Atmosphere>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 32 },
        ]}
        keyboardShouldPersistTaps="handled"
      >
        <Animated.View entering={FadeIn.duration(500)}>
          <Text style={styles.brand}>ЗАЛ</Text>
          <Text style={styles.subtitle}>Быстрая запись подхода — текстом или голосом</Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(80).duration(450)} style={styles.block}>
          <Text style={styles.section}>Голос</Text>
          <Text style={styles.hint}>
            Пример: «жим лёжа 80 килограмм на 8» — разберём и дадим поправить
          </Text>
          <View style={styles.voiceRow}>
            <Animated.View style={micStyle}>
              <PrimaryButton
                label={voice.listening ? 'Слушаю…' : 'Диктовать'}
                onPress={() => {
                  if (voice.listening) voice.stop();
                  else void voice.start();
                }}
                style={{ flexGrow: 1, minWidth: 160 }}
              />
            </Animated.View>
            <PrimaryButton
              label="Разобрать строку"
              variant="ghost"
              onPress={() => applyParsed(rawLine || transcript, false)}
              style={{ flexGrow: 1 }}
            />
          </View>
          {voice.error ? <Text style={styles.error}>{voice.error}</Text> : null}
          <Field
            label="Фраза"
            value={rawLine || voice.transcript}
            onChangeText={(t) => {
              setRawLine(t);
              setSource('typed');
            }}
            placeholder="жим лёжа 80 килограмм на 8"
            multiline
          />
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(160).duration(450)} style={styles.block}>
          <Text style={styles.section}>Подход</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chips}>
            {suggestions.map((ex) => (
              <Pressable
                key={ex.id}
                onPress={() => setExerciseName(ex.name)}
                style={[
                  styles.chip,
                  exerciseName === ex.name && styles.chipActive,
                ]}
              >
                <Text
                  style={[
                    styles.chipText,
                    exerciseName === ex.name && styles.chipTextActive,
                  ]}
                >
                  {ex.name}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
          <Field
            label="Упражнение"
            value={exerciseName}
            onChangeText={setExerciseName}
            placeholder="Название"
          />
          <View style={styles.row3}>
            <View style={styles.col}>
              <Field
                label="Вес, кг"
                value={weight}
                onChangeText={setWeight}
                keyboardType="decimal-pad"
              />
            </View>
            <View style={styles.col}>
              <Field
                label="Подходы"
                value={sets}
                onChangeText={setSets}
                keyboardType="number-pad"
              />
            </View>
            <View style={styles.col}>
              <Field
                label="Повторы"
                value={reps}
                onChangeText={setReps}
                keyboardType="number-pad"
              />
            </View>
          </View>
          <Field
            label="Заметки"
            value={notes}
            onChangeText={setNotes}
            placeholder="Опционально"
          />
          <PrimaryButton label="Сохранить подход" onPress={() => void onSave()} />
          {savedFlash ? (
            <Animated.Text entering={FadeIn} style={styles.saved}>
              Сохранено
            </Animated.Text>
          ) : null}
        </Animated.View>
      </ScrollView>
    </Atmosphere>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 20,
    gap: 28,
  },
  brand: {
    ...type.hero,
    color: colors.sand,
  },
  subtitle: {
    ...type.body,
    color: colors.inkMuted,
    marginTop: 6,
    maxWidth: 320,
  },
  block: {
    gap: 14,
  },
  section: {
    ...type.section,
    color: colors.ink,
  },
  hint: {
    ...type.caption,
    color: colors.inkFaint,
  },
  voiceRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  error: {
    ...type.caption,
    color: colors.danger,
  },
  chips: {
    maxHeight: 48,
  },
  chip: {
    minHeight: 44,
    paddingHorizontal: 14,
    marginRight: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.line,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.bgElevated,
  },
  chipActive: {
    borderColor: colors.copper,
    backgroundColor: 'rgba(214,106,46,0.18)',
  },
  chipText: {
    ...type.caption,
    color: colors.inkMuted,
  },
  chipTextActive: {
    color: colors.sand,
    fontFamily: 'Manrope_700Bold',
  },
  row3: {
    flexDirection: 'row',
    gap: 10,
  },
  col: { flex: 1 },
  saved: {
    ...type.bodyStrong,
    color: colors.success,
    textAlign: 'center',
  },
});
