import React, { useState } from 'react';

function CreateExercise({ exercises, onCreate }) {
  const [name, setName] = useState('');
  const [variantOf, setVariantOf] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    const trimmed = name.trim();

    if (!trimmed) {
      setError('Enter an exercise name.');
      return;
    }
    const duplicate = exercises.some(
      (ex) => ex.name?.toLowerCase() === trimmed.toLowerCase()
    );
    if (duplicate) {
      setError('An exercise with the same name already exists.');
      return;
    }

    const parent = exercises.find((ex) => String(ex.id) === variantOf);

    onCreate({
      id: `custom-${Date.now()}`,
      name: trimmed,
      variantOf: parent ? parent.id : null,
      bodyPart: parent?.bodyPart || 'custom',
      target: parent?.target || '',
      equipment: parent?.equipment || '',
      isCustom: true,
    });

    setName('');
    setVariantOf('');
    setError('');
  };

  return (
    <form className="create-exercise" onSubmit={handleSubmit}>
      <h3>Create your own exercise</h3>
      <input
        type="text"
        placeholder="Exercise name (e.g. Incline Push-up)"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <select value={variantOf} onChange={(e) => setVariantOf(e.target.value)}>
        <option value="">Not a variant of another exercise</option>
        {exercises.map((ex) => (
          <option key={ex.id} value={String(ex.id)}>
            {ex.name}
          </option>
        ))}
      </select>
      <button type="submit">Add exercise</button>
      {error && <p className="error-message">{error}</p>}
    </form>
  );
}

export default CreateExercise;
