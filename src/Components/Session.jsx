import { useState } from "react";
import Timer from "./Timer";
import WorkoutList from "./WorkoutList";

function Session() {
  const [selectedExercises, setSelectedExercises] = useState([]);

  const handleSelectExercise = (exercise) => {
    setSelectedExercises((prev) => [...prev, exercise]);
  };

  return (
    <div style={{ textAlign: "center", padding: "2rem" }}>
      <h1>Workout Session</h1>

      <Timer />

      <WorkoutList onSelectExercise={handleSelectExercise} />

      {selectedExercises.length > 0 && (
        <div>
          <h2>Current Routine</h2>

          {selectedExercises.map((exercise, index) => (
            <p key={`${exercise.id}-${index}`}>
              {exercise.name}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}

export default Session;