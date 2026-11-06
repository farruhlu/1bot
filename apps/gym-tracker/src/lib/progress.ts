import type { ExerciseProgress, SetEntry, TrendKind } from './types';

function sessionVolume(s: SetEntry): number {
  return s.weightKg * s.reps * s.sets;
}

export function buildExerciseProgress(sets: SetEntry[]): ExerciseProgress[] {
  const byEx = new Map<string, SetEntry[]>();
  for (const s of sets) {
    const list = byEx.get(s.exerciseId) ?? [];
    list.push(s);
    byEx.set(s.exerciseId, list);
  }

  const result: ExerciseProgress[] = [];
  for (const [exerciseId, list] of byEx) {
    const sorted = [...list].sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    );
    const points = sorted.map((s) => ({
      date: s.createdAt,
      weightKg: s.weightKg,
      volume: sessionVolume(s),
    }));

    const first = points[0];
    const last = points[points.length - 1];
    const deltaWeight = last.weightKg - first.weightKg;
    const { trend, trendLabel } = classifyTrend(points);

    result.push({
      exerciseId,
      exerciseName: sorted[0].exerciseName,
      points,
      trend,
      trendLabel,
      deltaWeight,
      latestWeight: last.weightKg,
      latestVolume: last.volume,
    });
  }

  return result.sort((a, b) => a.exerciseName.localeCompare(b.exerciseName, 'ru'));
}

function classifyTrend(
  points: { weightKg: number; volume: number }[],
): { trend: TrendKind; trendLabel: string } {
  if (points.length < 2) {
    return { trend: 'new', trendLabel: 'Мало данных' };
  }

  const recent = points.slice(-4);
  const weights = recent.map((p) => p.weightKg);
  const first = weights[0];
  const last = weights[weights.length - 1];
  const delta = last - first;
  const avg = weights.reduce((a, b) => a + b, 0) / weights.length;
  const variance =
    weights.reduce((acc, w) => acc + (w - avg) ** 2, 0) / weights.length;
  const swing = Math.max(...weights) - Math.min(...weights);

  if (delta <= -2.5 || (delta < 0 && last < first - 0.5)) {
    return { trend: 'regression', trendLabel: 'Регрессия' };
  }
  if (Math.abs(delta) < 2.5 && swing <= 5 && variance < 12) {
    return { trend: 'plateau', trendLabel: 'Плато' };
  }
  if (delta >= 2.5) {
    return { trend: 'gain', trendLabel: 'Рост' };
  }
  if (delta < 0) {
    return { trend: 'regression', trendLabel: 'Снижение' };
  }
  return { trend: 'plateau', trendLabel: 'Стабильно' };
}
