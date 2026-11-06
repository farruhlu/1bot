import AsyncStorage from '@react-native-async-storage/async-storage';
import { buildSeedData } from './seed';
import type { AppData, Exercise, SetEntry } from './types';

const KEY = 'gym-tracker/v1';

function uid(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export async function loadData(): Promise<AppData> {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    if (!raw) {
      const seed = buildSeedData();
      await AsyncStorage.setItem(KEY, JSON.stringify(seed));
      return seed;
    }
    return JSON.parse(raw) as AppData;
  } catch {
    return buildSeedData();
  }
}

export async function saveData(data: AppData): Promise<void> {
  await AsyncStorage.setItem(KEY, JSON.stringify(data));
}

export async function resetToSeed(): Promise<AppData> {
  const seed = buildSeedData();
  await saveData(seed);
  return seed;
}

export function ensureExercise(data: AppData, name: string): { data: AppData; exercise: Exercise } {
  const trimmed = name.trim();
  const existing = data.exercises.find(
    (e) => e.name.toLowerCase() === trimmed.toLowerCase(),
  );
  if (existing) return { data, exercise: existing };

  const exercise: Exercise = { id: uid('ex'), name: trimmed };
  return {
    data: { ...data, exercises: [...data.exercises, exercise] },
    exercise,
  };
}

export function addSet(
  data: AppData,
  input: {
    exerciseName: string;
    weightKg: number;
    reps: number;
    sets: number;
    notes: string;
    source: SetEntry['source'];
    rawTranscript?: string;
  },
): AppData {
  const { data: withEx, exercise } = ensureExercise(data, input.exerciseName);
  const entry: SetEntry = {
    id: uid('set'),
    exerciseId: exercise.id,
    exerciseName: exercise.name,
    weightKg: input.weightKg,
    reps: input.reps,
    sets: input.sets,
    notes: input.notes.trim(),
    createdAt: new Date().toISOString(),
    source: input.source,
    rawTranscript: input.rawTranscript,
  };
  return { ...withEx, sets: [entry, ...withEx.sets] };
}

export function updateSet(data: AppData, id: string, patch: Partial<SetEntry>): AppData {
  return {
    ...data,
    sets: data.sets.map((s) => (s.id === id ? { ...s, ...patch } : s)),
  };
}

export function deleteSet(data: AppData, id: string): AppData {
  return { ...data, sets: data.sets.filter((s) => s.id !== id) };
}
