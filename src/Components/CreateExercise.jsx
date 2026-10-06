// form that lets the user create their own exercise, optionally as a variant of an existing one (issue #10)
import React, { useState, useMemo } from 'react';
import { addCustomExercise, EXERCISE_TYPES } from '../Utils/customExercises';
import './CreateExercise.css';

// empty form values
const EMPTY_FORM = {
    name: '',
    variantOfId: '',
    bodyPart: '',
    target: '',
    secondaryMuscles: '',
    equipment: '',
    type: 'reps',
};

const CreateExercise = ({ existingExercises = [], onCreated, onCancel }) => {
    const [form, setForm] = useState(EMPTY_FORM);
    const [error, setError] = useState(null);

    // the exercise the user picked as the "parent" (or null if none)
    const parent = useMemo(
        () => existingExercises.find((ex) => ex.id === form.variantOfId) || null,
        [existingExercises, form.variantOfId]
    );

    // sort the dropdown list alphabetically so it's easy to find things
    const sortedExercises = useMemo(
        () => [...existingExercises].sort((a, b) => a.name.localeCompare(b.name)),
        [existingExercises]
    );

    // update one field in the form
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
        setError(null);
    };

    // save the exercise when the user clicks Create
    const handleSubmit = () => {
        const result = addCustomExercise(form, existingExercises, parent);
        if (result.error) {
            setError(result.error);
            return;
        }
        setForm(EMPTY_FORM);
        if (onCreated) {
            onCreated(result.exercise);
        }
    };

    // show the parent's value as a hint so the user knows what gets filled in
    const hint = (field, fallback) => {
        const value = parent?.[field];
        if (Array.isArray(value)) return value.length ? `From parent: ${value.join(', ')}` : fallback;
        return value ? `From parent: ${value}` : fallback;
    };

    return (
        <div className="create-exercise">
            <h3>Create Your Own Exercise</h3>

            {/* name of the new exercise */}
            <label>
                Exercise name *
                <input name="name" value={form.name} onChange={handleChange} placeholder="e.g. Paused Squat" />
            </label>

            {/* pick an existing exercise this one is a variant of */}
            <label>
                Variant of (optional)
                <select name="variantOfId" value={form.variantOfId} onChange={handleChange}>
                    <option value="">None - this is a brand new exercise</option>
                    {sortedExercises.map((ex) => (
                        <option key={ex.id} value={ex.id}>{ex.name}</option>
                    ))}
                </select>
            </label>

            {/* muscles worked - blank fields get copied from the parent */}
            <label>
                Muscle group
                <input name="bodyPart" value={form.bodyPart} onChange={handleChange} placeholder={hint('bodyPart', 'e.g. upper legs')} />
            </label>
            <label>
                Main muscle
                <input name="target" value={form.target} onChange={handleChange} placeholder={hint('target', 'e.g. glutes')} />
            </label>
            <label>
                Secondary muscles (comma separated)
                <input name="secondaryMuscles" value={form.secondaryMuscles} onChange={handleChange} placeholder={hint('secondaryMuscles', 'e.g. quadriceps, hamstrings')} />
            </label>

            {/* equipment and how the exercise is measured */}
            <label>
                Equipment
                <input name="equipment" value={form.equipment} onChange={handleChange} placeholder={hint('equipment', 'e.g. barbell')} />
            </label>
            <label>
                Measured by
                <select name="type" value={form.type} onChange={handleChange}>
                    {EXERCISE_TYPES.map((t) => (
                        <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
                    ))}
                </select>
            </label>

            {/* error message and buttons */}
            {error && <p className="create-exercise-error" role="alert">{error}</p>}
            <div className="create-exercise-buttons">
                <button onClick={handleSubmit}>Create Exercise</button>
                {onCancel && <button className="secondary" onClick={onCancel}>Cancel</button>}
            </div>
        </div>
    );
};

export default CreateExercise;
