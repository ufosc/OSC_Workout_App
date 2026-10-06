// custom exercises the user creates, saved in localStorage until the app has a backend
const STORAGE_KEY = 'customExercises';

// the kinds of exercise a user can pick (from the issue #10 discussion)
export const EXERCISE_TYPES = ['reps', 'time', 'distance'];

// load all saved custom exercises (returns an empty list if nothing is saved yet)
export function loadCustomExercises() {
    try {
        const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
        return Array.isArray(saved) ? saved : [];
    } catch {
        return []; // saved data was broken, so start fresh
    }
}

// write the full list back to localStorage
function saveAll(list) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

// check the form input, returns an error message or null if it's good
export function validateExercise(input, existingExercises = []) {
    const name = (input.name || '').trim();

    if (!name) {
        return 'Exercise name is required.';
    }
    if (name.length > 60) {
        return 'Exercise name must be 60 characters or less.';
    }

    // don't allow two exercises with the same name (ignores upper/lower case)
    const taken = existingExercises.some(
        (ex) => ex.name?.toLowerCase() === name.toLowerCase()
    );
    if (taken) {
        return 'An exercise with that name already exists.';
    }

    // type is optional, but if it's given it has to be one we know
    if (input.type && !EXERCISE_TYPES.includes(input.type)) {
        return 'Exercise type must be reps, time, or distance.';
    }

    return null;
}

// build a new custom exercise in the same shape as the ExerciseDB API data
export function createCustomExercise(input, parent = null) {
    return {
        id: `custom-${Date.now()}`, // "custom-" so it never clashes with API ids
        name: input.name.trim(),
        // if a field is left blank, borrow it from the parent exercise
        bodyPart: input.bodyPart || parent?.bodyPart || '',
        target: input.target || parent?.target || '',
        equipment: input.equipment || parent?.equipment || '',
        secondaryMuscles: cleanMuscles(input.secondaryMuscles, parent?.secondaryMuscles),
        type: input.type || 'reps', // most exercises are counted in reps
        variantOf: parent ? parent.id : null,
        variantOfName: parent ? parent.name : null,
        isCustom: true,
    };
}

// turn secondary muscles into a clean list (accepts a list or "biceps, forearms")
function cleanMuscles(muscles, parentMuscles = []) {
    const list = Array.isArray(muscles) ? muscles : (muscles || '').split(',');
    const cleaned = list.map((m) => m.trim().toLowerCase()).filter(Boolean);
    return cleaned.length > 0 ? cleaned : [...(parentMuscles || [])];
}

// validate, create, and save a new custom exercise
// returns { exercise } on success or { error } if the input was bad
export function addCustomExercise(input, existingExercises = [], parent = null) {
    const error = validateExercise(input, existingExercises);
    if (error) {
        return { error };
    }

    const exercise = createCustomExercise(input, parent);
    saveAll([...loadCustomExercises(), exercise]);
    return { exercise };
}

// remove a custom exercise by its id
export function deleteCustomExercise(id) {
    saveAll(loadCustomExercises().filter((ex) => ex.id !== id));
}

// find all custom exercises that are variants of a given exercise
export function getVariantsOf(parentId) {
    return loadCustomExercises().filter((ex) => ex.variantOf === parentId);
}
