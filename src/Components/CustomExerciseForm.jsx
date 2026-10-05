import { useState } from 'react';
import { EXERCISE_TYPES, saveCustomExercise } from '../Utils/exerciseLibrary';

const EMPTY_FORM = { name: '', bodyPart: '', target: '', equipment: '', type: 'WeightBased', notes: '' };

export default function CustomExerciseForm({ onCreated }) {
  const [values, setValues] = useState(EMPTY_FORM);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  function submit(event) {
    event.preventDefault();
    setError('');
    setMessage('');
    let exercise;
    try {
      exercise = saveCustomExercise(values);
    } catch (err) {
      setError(err.message);
      return;
    }
    setValues(EMPTY_FORM);
    setMessage(`${exercise.name} saved to your exercise library.`);
    onCreated(exercise);
  }

  return (
    <form className="custom-exercise-form" onSubmit={submit}>
      <h3>Create your own exercise</h3>
      <p>Required fields are marked *. Saved exercises stay on this browser for future workouts.</p>
      <div className="exercise-form-fields">
        {[
          ['name', 'Exercise name', 'Resistance-band row'],
          ['bodyPart', 'Body part / muscle group', 'Back'],
          ['target', 'Target muscle', 'Lats'],
          ['equipment', 'Equipment', 'Resistance band, or none'],
        ].map(([field, label, placeholder]) => (
          <label key={field} htmlFor={`custom-${field}`}>
            {label} *
            <input id={`custom-${field}`} value={values[field]} required maxLength={100}
              placeholder={placeholder}
              onChange={event => setValues({ ...values, [field]: event.target.value })} />
          </label>
        ))}
        <label htmlFor="custom-type">Exercise type *
          <select id="custom-type" value={values.type}
            onChange={event => setValues({ ...values, type: event.target.value })}>
            {Object.entries(EXERCISE_TYPES).map(([value, label]) =>
              <option key={value} value={value}>{label}</option>)}
          </select>
        </label>
        <label htmlFor="custom-notes">Notes / instructions (optional)
          <textarea id="custom-notes" value={values.notes} maxLength={2000}
            onChange={event => setValues({ ...values, notes: event.target.value })} />
        </label>
      </div>
      {error && <p role="alert">{error}</p>}
      <p role="status">{message}</p>
      <button type="submit">Save Exercise</button>
    </form>
  );
}
