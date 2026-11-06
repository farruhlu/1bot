import { parseWorkoutLine } from '../src/lib/parser';

const cases: [string, Partial<ReturnType<typeof parseWorkoutLine>>][] = [
  ['жим лёжа 80 килограмм на 8', { exerciseName: 'Жим лёжа', weightKg: 80, reps: 8, sets: 1 }],
  ['присед 100 кг 5х5', { exerciseName: 'Приседания', weightKg: 100, reps: 5, sets: 5 }],
  ['становая 140 на 3', { exerciseName: 'Становая тяга', weightKg: 140, reps: 3 }],
];

let failed = 0;
for (const [input, expected] of cases) {
  const got = parseWorkoutLine(input);
  for (const [k, v] of Object.entries(expected)) {
    if ((got as Record<string, unknown>)[k] !== v) {
      console.error('FAIL', input, k, 'expected', v, 'got', (got as Record<string, unknown>)[k]);
      failed++;
    }
  }
}
if (failed) {
  console.error(`Failed: ${failed}`);
  process.exit(1);
}
console.log('parser ok');
