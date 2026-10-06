import {
    loadCustomExercises,
    validateExercise,
    createCustomExercise,
    addCustomExercise,
    deleteCustomExercise,
    getVariantsOf,
} from './customExercises';

// a fake exercise that looks like one from the ExerciseDB API
const squat = { id: '0043', name: 'barbell full squat', bodyPart: 'upper legs', target: 'glutes', equipment: 'barbell', secondaryMuscles: ['quadriceps', 'hamstrings'] };

// start every test with empty storage
beforeEach(() => {
    localStorage.clear();
});

// loading
test('returns an empty list when nothing is saved', () => {
    expect(loadCustomExercises()).toEqual([]);
});

test('returns an empty list when saved data is broken', () => {
    localStorage.setItem('customExercises', 'not json');
    expect(loadCustomExercises()).toEqual([]);
});

// validation
test('rejects an empty name', () => {
    expect(validateExercise({ name: '   ' })).toBe('Exercise name is required.');
});

test('rejects a duplicate name no matter the case', () => {
    expect(validateExercise({ name: 'Barbell Full Squat' }, [squat])).toBe('An exercise with that name already exists.');
});

test('accepts a good name', () => {
    expect(validateExercise({ name: 'paused squat' }, [squat])).toBeNull();
});

// creating variants
test('a variant borrows blank fields from its parent', () => {
    const ex = createCustomExercise({ name: 'paused squat' }, squat);
    expect(ex.bodyPart).toBe('upper legs');
    expect(ex.target).toBe('glutes');
    expect(ex.variantOf).toBe('0043');
    expect(ex.variantOfName).toBe('barbell full squat');
    expect(ex.isCustom).toBe(true);
});

test('fields the user fills in are kept over the parent ones', () => {
    const ex = createCustomExercise({ name: 'goblet squat', equipment: 'kettlebell' }, squat);
    expect(ex.equipment).toBe('kettlebell');
});

// saving and deleting
test('adds a custom exercise and saves it', () => {
    const { exercise, error } = addCustomExercise({ name: 'paused squat' }, [squat], squat);
    expect(error).toBeUndefined();
    expect(loadCustomExercises()).toEqual([exercise]);
    expect(getVariantsOf('0043')).toHaveLength(1);
});

test('does not save bad input', () => {
    const { error } = addCustomExercise({ name: '' }, [squat]);
    expect(error).toBeTruthy();
    expect(loadCustomExercises()).toEqual([]);
});

test('deletes a custom exercise by id', () => {
    const { exercise } = addCustomExercise({ name: 'paused squat' }, [squat], squat);
    deleteCustomExercise(exercise.id);
    expect(loadCustomExercises()).toEqual([]);
});

// fields from the issue #10 discussion
test('rejects an unknown exercise type', () => {
    expect(validateExercise({ name: 'plank', type: 'weight' })).toBe('Exercise type must be reps, time, or distance.');
});

test('type defaults to reps', () => {
    expect(createCustomExercise({ name: 'paused squat' }).type).toBe('reps');
});

test('keeps the type the user picks', () => {
    expect(createCustomExercise({ name: 'plank', type: 'time' }).type).toBe('time');
});

test('turns typed secondary muscles into a clean list', () => {
    const ex = createCustomExercise({ name: 'hammer curl', secondaryMuscles: ' Forearms, brachialis ,' });
    expect(ex.secondaryMuscles).toEqual(['forearms', 'brachialis']);
});

test('a variant borrows secondary muscles from its parent when left blank', () => {
    const ex = createCustomExercise({ name: 'paused squat' }, squat);
    expect(ex.secondaryMuscles).toEqual(['quadriceps', 'hamstrings']);
});
