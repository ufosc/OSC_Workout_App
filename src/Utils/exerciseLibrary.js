// Shared exercise definitions, separate from the sets logged during a workout.
export const EXERCISE_LIBRARY_KEY = 'osc-exercise-library';
export const EXERCISE_TYPES = { WeightBased: 'Weight and repetitions', Bodyweight: 'Bodyweight repetitions', TimeBased: 'Timed exercise' };

export function getSavedExercises() {
  try {
    const saved = JSON.parse(localStorage.getItem(EXERCISE_LIBRARY_KEY));
    return Array.isArray(saved) ? saved.filter(exercise =>
      exercise && typeof exercise.id === 'string' &&
      ['name', 'bodyPart', 'target', 'equipment'].every(field =>
        typeof exercise[field] === 'string' && exercise[field].trim())) : [];
  } catch {
    return [];
  }
}

export function saveCustomExercise(values) {
  const exercise = {};
  for (const field of ['name', 'bodyPart', 'target', 'equipment']) {
    exercise[field] = String(values[field] || '').trim();
    if (!exercise[field]) throw new Error('Please complete all required fields.');
  }
  if (!Object.prototype.hasOwnProperty.call(EXERCISE_TYPES, values.type)) {
    throw new Error('Please choose an exercise type.');
  }
  const saved = getSavedExercises();
  if (saved.some(item => item.name.toLowerCase() === exercise.name.toLowerCase())) {
    throw new Error('An exercise with that name is already saved.');
  }
  const id = window.crypto?.randomUUID
    ? window.crypto.randomUUID()
    : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
  exercise.id = `custom-${id}`;
  exercise.type = values.type;
  exercise.notes = String(values.notes || '').trim();
  exercise.isCustom = true;
  persist([...saved, exercise]);
  return exercise;
}

// Keep selected API exercises too, so they can be reused without another fetch.
export function rememberExercise(exercise) {
  const saved = getSavedExercises();
  if (!saved.some(item => item.id === exercise.id)) persist([...saved, exercise]);
}

function persist(exercises) {
  try {
    localStorage.setItem(EXERCISE_LIBRARY_KEY, JSON.stringify(exercises));
  } catch {
    throw new Error('Unable to save exercises on this device. Check available storage and browser permissions.');
  }
}
