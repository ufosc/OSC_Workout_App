import { EXERCISE_LIBRARY_KEY, getSavedExercises, rememberExercise, saveCustomExercise } from './exerciseLibrary';

const values = { name: 'Band row', bodyPart: 'Back', target: 'Lats', equipment: 'Band', type: 'WeightBased', notes: 'Keep elbows close' };

beforeEach(() => {
  localStorage.clear();
  // jsdom may not provide randomUUID even though modern browsers do.
  Object.defineProperty(globalThis, 'crypto', { configurable: true, value: { randomUUID: () => 'test-id' } });
});

test('custom definitions survive reading storage again with their metadata', () => {
  const exercise = saveCustomExercise({ ...values, name: '  Band row  ' });
  expect(exercise).toMatchObject({ ...values, id: 'custom-test-id', isCustom: true });
  expect(getSavedExercises()).toEqual([exercise]);
  expect(exercise.setList).toBeUndefined();
});

test('rejects blank required fields, invalid types, and duplicate names', () => {
  expect(() => saveCustomExercise({ ...values, target: ' ' })).toThrow('required');
  expect(() => saveCustomExercise({ ...values, type: 'unknown' })).toThrow('type');
  saveCustomExercise(values);
  expect(() => saveCustomExercise({ ...values, name: ' BAND ROW ' })).toThrow('already saved');
  expect(getSavedExercises()).toHaveLength(1);
});

test('selected API exercises persist once and can be reused without an API', () => {
  const exercise = { id: 'api-1', name: 'Push-up', bodyPart: 'chest', target: 'pectorals', equipment: 'body weight' };
  rememberExercise(exercise);
  rememberExercise(exercise);
  expect(getSavedExercises()).toEqual([exercise]);
});

test('handles corrupt storage and skips malformed definitions', () => {
  localStorage.setItem(EXERCISE_LIBRARY_KEY, 'broken json');
  expect(getSavedExercises()).toEqual([]);
  localStorage.setItem(EXERCISE_LIBRARY_KEY, JSON.stringify([null, {}, { id: 4, ...values }, { id: 'valid', ...values }]));
  expect(getSavedExercises()).toEqual([{ id: 'valid', ...values }]);
});

test('reports failed storage writes instead of claiming the exercise was saved', () => {
  const write = jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new Error('quota'); });
  try {
    expect(() => saveCustomExercise(values)).toThrow('Unable to save');
    expect(getSavedExercises()).toEqual([]);
  } finally {
    write.mockRestore();
  }
});
