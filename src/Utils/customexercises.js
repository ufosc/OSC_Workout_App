const STORAGE_KEY = 'osc_custom_exercises';
 
export function getCustomExercises() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (error) {
    return [];
  }
}

export function addCustomExercise(exercise) {
  const updated = [...getCustomExercises(), exercise];
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error('Error cant save custom exercise', error);
  }
  return updated;
}