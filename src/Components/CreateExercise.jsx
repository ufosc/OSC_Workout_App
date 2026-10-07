import React, { useState } from 'react';

function CreateExercise({ onExerciseCreated }) {
  const [name, setName] = useState('');
  const [mainMuscle, setMainMuscle] = useState('');
  const [secondaryMuscles, setSecondaryMuscles] = useState('');
  const [exerciseType, setExerciseType] = useState('reps');
  const [variant, setVariant] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name.trim() || !mainMuscle.trim()) {
      alert('Exercise name and main muscle are required.');
      return;
    }

    const newExercise = {
      id: `custom-${Date.now()}`,
      name: name.trim(),
      bodyPart: mainMuscle.trim(),
      target: secondaryMuscles.trim() || 'None',
      equipment: exerciseType,
      variant: variant.trim(),
      isCustom: true
    };

    const existingExercises =
      JSON.parse(localStorage.getItem('customExercises')) || [];

    const updatedExercises = [...existingExercises, newExercise];

    localStorage.setItem(
      'customExercises',
      JSON.stringify(updatedExercises)
    );

    if (onExerciseCreated) {
      onExerciseCreated(newExercise);
    }

    setName('');
    setMainMuscle('');
    setSecondaryMuscles('');
    setExerciseType('reps');
    setVariant('');
  };

  return (
    <div>
      <h2>Create Custom Exercise</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Exercise name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="text"
          placeholder="Main muscle"
          value={mainMuscle}
          onChange={(e) => setMainMuscle(e.target.value)}
        />

        <input
          type="text"
          placeholder="Secondary muscles"
          value={secondaryMuscles}
          onChange={(e) => setSecondaryMuscles(e.target.value)}
        />

        <select
          value={exerciseType}
          onChange={(e) => setExerciseType(e.target.value)}
        >
          <option value="reps">Repetitions</option>
          <option value="time">Time</option>
          <option value="distance">Distance</option>
        </select>

        <input
          type="text"
          placeholder="Related exercise / variant"
          value={variant}
          onChange={(e) => setVariant(e.target.value)}
        />

        <button type="submit">Create Exercise</button>
      </form>
    </div>
  );
}

export default CreateExercise;