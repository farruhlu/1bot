import { SEED_EXERCISES } from './seed';

export type ParsedWorkout = {
  exerciseName: string;
  weightKg: number | null;
  reps: number | null;
  sets: number | null;
  notes: string;
  confidence: 'high' | 'medium' | 'low';
  matchedKnown: boolean;
};

const WEIGHT_RE =
  /(\d+(?:[.,]\d+)?)\s*(?:кг|килограмм(?:а|ов)?|киллограмм(?:а|ов)?)/i;
const REPS_ON_RE = /(?:на|по)\s+(\d{1,3})(?:\s*(?:раз|повтор(?:а|ов|ений)?))?/i;
const SETS_X_REPS_RE = /(\d{1,2})\s*[xх×*]\s*(\d{1,3})/i;
const SETS_ONLY_RE =
  /(\d{1,2})\s*(?:подход(?:а|ов)?|сета?|сетов)/i;
const REPS_ONLY_RE =
  /(\d{1,3})\s*(?:повтор(?:а|ов|ений)?|раз)/i;

function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/ё/g, 'е')
    .replace(/,/g, '.')
    .replace(/\s+/g, ' ')
    .trim();
}

function findExercise(text: string): { name: string; matched: boolean; rest: string } {
  const n = normalize(text);
  const sorted = [...SEED_EXERCISES].sort((a, b) => b.name.length - a.name.length);
  for (const ex of sorted) {
    const key = normalize(ex.name);
    const idx = n.indexOf(key);
    if (idx >= 0) {
      const rest = (n.slice(0, idx) + ' ' + n.slice(idx + key.length)).trim();
      return { name: ex.name, matched: true, rest };
    }
  }

  // Aliases / short forms
  const aliases: [string, string][] = [
    ['жим лежа', 'Жим лёжа'],
    ['жим штанги лежа', 'Жим лёжа'],
    ['присед', 'Приседания'],
    ['приседания со штангой', 'Приседания'],
    ['становая', 'Становая тяга'],
    ['тяга', 'Становая тяга'],
    ['армейский жим', 'Жим стоя'],
    ['жим над головой', 'Жим стоя'],
    ['тяга в наклоне', 'Тяга штанги в наклоне'],
    ['подтягивания', 'Подтягивания'],
    ['бицепс', 'Сгибания на бицепс'],
    ['трицепс', 'Разгибания на трицепс'],
  ];
  for (const [alias, name] of aliases) {
    const idx = n.indexOf(alias);
    if (idx >= 0) {
      const rest = (n.slice(0, idx) + ' ' + n.slice(idx + alias.length)).trim();
      return { name, matched: true, rest };
    }
  }

  // Free-form: take leading words before first number as name
  const m = n.match(/^([^\d]+?)(?=\s*\d)/);
  if (m) {
    const name = m[1].trim().replace(/\s+/g, ' ');
    if (name.length >= 3) {
      return {
        name: name.charAt(0).toUpperCase() + name.slice(1),
        matched: false,
        rest: n.slice(m[0].length).trim(),
      };
    }
  }

  return { name: text.trim(), matched: false, rest: n };
}

/**
 * Parse spoken/typed Russian lines like:
 * «жим лёжа 80 килограмм на 8»
 * «присед 100 кг 5х5»
 * «становая 140 на 3, 3 подхода»
 */
export function parseWorkoutLine(raw: string): ParsedWorkout {
  const original = raw.trim();
  if (!original) {
    return {
      exerciseName: '',
      weightKg: null,
      reps: null,
      sets: null,
      notes: '',
      confidence: 'low',
      matchedKnown: false,
    };
  }

  const { name, matched, rest } = findExercise(original);
  let working = rest || normalize(original);

  let weightKg: number | null = null;
  let reps: number | null = null;
  let sets: number | null = null;

  const sx = working.match(SETS_X_REPS_RE);
  if (sx) {
    sets = Number(sx[1]);
    reps = Number(sx[2]);
    working = working.replace(sx[0], ' ');
  }

  const w = working.match(WEIGHT_RE);
  if (w) {
    weightKg = Number(w[1]);
    working = working.replace(w[0], ' ');
  } else {
    const bare = working.match(/(\d+(?:\.\d+)?)/);
    if (bare && !SETS_ONLY_RE.test(working) && !REPS_ONLY_RE.test(working) && !REPS_ON_RE.test(working)) {
      weightKg = Number(bare[1]);
      working = working.replace(bare[0], ' ');
    }
  }

  if (reps == null) {
    const on = working.match(REPS_ON_RE);
    if (on) {
      reps = Number(on[1]);
      working = working.replace(on[0], ' ');
    }
  }

  if (sets == null) {
    const so = working.match(SETS_ONLY_RE);
    if (so) {
      sets = Number(so[1]);
      working = working.replace(so[0], ' ');
    }
  }

  if (reps == null) {
    const ro = working.match(REPS_ONLY_RE);
    if (ro) {
      reps = Number(ro[1]);
      working = working.replace(ro[0], ' ');
    }
  }

  // leftover digits: prefer weight if missing
  if (weightKg == null) {
    const leftover = working.match(/(\d+(?:\.\d+)?)/);
    if (leftover) {
      weightKg = Number(leftover[1]);
      working = working.replace(leftover[0], ' ');
    }
  }

  const notes = working.replace(/\s+/g, ' ').trim();

  if (sets == null) sets = 1;

  let confidence: ParsedWorkout['confidence'] = 'low';
  if (matched && weightKg != null && reps != null) confidence = 'high';
  else if (weightKg != null && (reps != null || name.length > 2)) confidence = 'medium';

  return {
    exerciseName: name,
    weightKg,
    reps,
    sets,
    notes,
    confidence,
    matchedKnown: matched,
  };
}
