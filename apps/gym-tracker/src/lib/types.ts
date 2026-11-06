export type Exercise = {
  id: string;
  name: string;
  seeded?: boolean;
};

export type SetEntry = {
  id: string;
  exerciseId: string;
  exerciseName: string;
  weightKg: number;
  reps: number;
  sets: number;
  notes: string;
  createdAt: string; // ISO
  source: 'typed' | 'voice' | 'seed';
  rawTranscript?: string;
};

export type AppData = {
  exercises: Exercise[];
  sets: SetEntry[];
  version: 1;
};

export type TrendKind = 'gain' | 'plateau' | 'regression' | 'new';

export type ExerciseProgress = {
  exerciseId: string;
  exerciseName: string;
  points: { date: string; weightKg: number; volume: number }[];
  trend: TrendKind;
  trendLabel: string;
  deltaWeight: number;
  latestWeight: number;
  latestVolume: number;
};
