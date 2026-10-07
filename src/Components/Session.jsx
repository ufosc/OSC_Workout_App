// current session the user will be working on during their workout,
// where they will log exercises, weight, and reps

import React, { useState } from 'react';
import Timer from './Timer';
import WorkoutList from './WorkoutList';
import { getCurrentUser } from '../Utils/streak';
import './Session.css';

function Session() {
  const [selectedExercises, setSelectedExercises] = useState([]);

  const handleSelectExercise = (exercise) => {
    const alreadySelected = selectedExercises.some(
      (selected) => selected.id === exercise.id
    );

    if (alreadySelected) {
      return;
    }

    setSelectedExercises([
      ...selectedExercises,
      {
        id: exercise.id,
        name: exercise.name,
        weight: '',
        reps: ''
      }
    ]);
  };

  const handleWorkoutChange = (id, field, value) => {
    setSelectedExercises(
      selectedExercises.map((exercise) =>
        exercise.id === id
          ? { ...exercise, [field]: value }
          : exercise
      )
    );
  };

  const handleRemoveExercise = (id) => {
    setSelectedExercises(
      selectedExercises.filter((exercise) => exercise.id !== id)
    );
  };

  const handleCompleteSession = () => {
    const currentUser = getCurrentUser();

    if (!currentUser) {
      alert('Please log in before saving a workout.');
      return;
    }

    if (selectedExercises.length === 0) {
      alert('Add at least one exercise before completing the workout.');
      return;
    }

    const incompleteExercise = selectedExercises.some(
      (exercise) =>
        exercise.weight === '' ||
        exercise.reps === ''
    );

    if (incompleteExercise) {
      alert('Enter weight and reps for every exercise.');
      return;
    }

    const session = {
      user: currentUser,
      completedAt: new Date().toISOString(),
      exercises: selectedExercises
    };

    const storageKey = `workoutSessions_${currentUser}`;

    const existingSessions =
      JSON.parse(localStorage.getItem(storageKey)) || [];

    const updatedSessions = [...existingSessions, session];

    localStorage.setItem(
      storageKey,
      JSON.stringify(updatedSessions)
    );

    setSelectedExercises([]);

    alert('Workout saved!');
  };

  return (
    <div className="session-page">
      <div className="session-header">
        <h1>Workout Session</h1>

        <div className="timer-card">
          <Timer />
        </div>
      </div>

      <WorkoutList onSelectExercise={handleSelectExercise} />

      {selectedExercises.length > 0 && (
        <div className="current-workout">
          <h2>Current Workout</h2>

          {selectedExercises.map((exercise) => (
            <div
              key={exercise.id}
              className="selected-exercise-card"
            >
              <h3>{exercise.name}</h3>

              <div className="selected-exercise-inputs">
                <input
                  type="number"
                  min="0"
                  placeholder="Weight"
                  value={exercise.weight}
                  onChange={(event) =>
                    handleWorkoutChange(
                      exercise.id,
                      'weight',
                      event.target.value
                    )
                  }
                />

                <input
                  type="number"
                  min="1"
                  placeholder="Reps"
                  value={exercise.reps}
                  onChange={(event) =>
                    handleWorkoutChange(
                      exercise.id,
                      'reps',
                      event.target.value
                    )
                  }
                />

                <button
                  className="remove-exercise-button"
                  onClick={() => handleRemoveExercise(exercise.id)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}

          <button
            className="complete-session-button"
            onClick={handleCompleteSession}
          >
            Complete Session
          </button>
        </div>
      )}
    </div>
  );
}

export default Session;