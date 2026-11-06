import type { AppData, Exercise, SetEntry } from './types';

export const SEED_EXERCISES: Exercise[] = [
  { id: 'ex-bench', name: 'Жим лёжа', seeded: true },
  { id: 'ex-squat', name: 'Приседания', seeded: true },
  { id: 'ex-deadlift', name: 'Становая тяга', seeded: true },
  { id: 'ex-ohp', name: 'Жим стоя', seeded: true },
  { id: 'ex-row', name: 'Тяга штанги в наклоне', seeded: true },
  { id: 'ex-pullup', name: 'Подтягивания', seeded: true },
  { id: 'ex-curl', name: 'Сгибания на бицепс', seeded: true },
  { id: 'ex-tricep', name: 'Разгибания на трицепс', seeded: true },
];

function daysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(18, 30, 0, 0);
  return d.toISOString();
}

function set(
  partial: Omit<SetEntry, 'id' | 'source'> & { id: string },
): SetEntry {
  return { ...partial, source: 'seed' };
}

/** Demo history: gains, plateau, and a mild regression so charts aren't only "up". */
export function buildSeedData(): AppData {
  const sets: SetEntry[] = [
    // Жим лёжа — рост
    set({
      id: 's1',
      exerciseId: 'ex-bench',
      exerciseName: 'Жим лёжа',
      weightKg: 70,
      reps: 8,
      sets: 3,
      notes: '',
      createdAt: daysAgo(28),
    }),
    set({
      id: 's2',
      exerciseId: 'ex-bench',
      exerciseName: 'Жим лёжа',
      weightKg: 75,
      reps: 8,
      sets: 3,
      notes: '',
      createdAt: daysAgo(21),
    }),
    set({
      id: 's3',
      exerciseId: 'ex-bench',
      exerciseName: 'Жим лёжа',
      weightKg: 80,
      reps: 8,
      sets: 3,
      notes: 'Комфортно',
      createdAt: daysAgo(14),
    }),
    set({
      id: 's4',
      exerciseId: 'ex-bench',
      exerciseName: 'Жим лёжа',
      weightKg: 82.5,
      reps: 6,
      sets: 3,
      notes: '',
      createdAt: daysAgo(7),
    }),
    set({
      id: 's5',
      exerciseId: 'ex-bench',
      exerciseName: 'Жим лёжа',
      weightKg: 85,
      reps: 5,
      sets: 3,
      notes: '',
      createdAt: daysAgo(2),
    }),
    // Приседания — плато
    set({
      id: 's6',
      exerciseId: 'ex-squat',
      exerciseName: 'Приседания',
      weightKg: 100,
      reps: 5,
      sets: 5,
      notes: '',
      createdAt: daysAgo(24),
    }),
    set({
      id: 's7',
      exerciseId: 'ex-squat',
      exerciseName: 'Приседания',
      weightKg: 100,
      reps: 5,
      sets: 5,
      notes: '',
      createdAt: daysAgo(17),
    }),
    set({
      id: 's8',
      exerciseId: 'ex-squat',
      exerciseName: 'Приседания',
      weightKg: 102.5,
      reps: 5,
      sets: 5,
      notes: '',
      createdAt: daysAgo(10),
    }),
    set({
      id: 's9',
      exerciseId: 'ex-squat',
      exerciseName: 'Приседания',
      weightKg: 100,
      reps: 5,
      sets: 5,
      notes: 'Тяжело',
      createdAt: daysAgo(3),
    }),
    // Становая — лёгкая регрессия
    set({
      id: 's10',
      exerciseId: 'ex-deadlift',
      exerciseName: 'Становая тяга',
      weightKg: 140,
      reps: 3,
      sets: 3,
      notes: '',
      createdAt: daysAgo(20),
    }),
    set({
      id: 's11',
      exerciseId: 'ex-deadlift',
      exerciseName: 'Становая тяга',
      weightKg: 145,
      reps: 3,
      sets: 3,
      notes: '',
      createdAt: daysAgo(13),
    }),
    set({
      id: 's12',
      exerciseId: 'ex-deadlift',
      exerciseName: 'Становая тяга',
      weightKg: 140,
      reps: 3,
      sets: 3,
      notes: 'Спина устала',
      createdAt: daysAgo(6),
    }),
    set({
      id: 's13',
      exerciseId: 'ex-deadlift',
      exerciseName: 'Становая тяга',
      weightKg: 135,
      reps: 5,
      sets: 3,
      notes: '',
      createdAt: daysAgo(1),
    }),
  ];

  return {
    version: 1,
    exercises: SEED_EXERCISES,
    sets,
  };
}
