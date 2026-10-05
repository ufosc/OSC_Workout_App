// current session the user will be working on during their workout, where they will log what exersises and weight they are perorming
import Timer from "./Timer";
import { useState } from 'react';
import WorkoutList from './WorkoutList';
import Exercise from '../Constructors/sessionExercise';

function Session() {
    const [routine, setRoutine] = useState([]);
    function addExercise(definition) {
        const exercise = new Exercise(definition.id, definition.name);
        exercise.bodyPart = definition.bodyPart;
        exercise.target = definition.target;
        exercise.equipment = definition.equipment;
        exercise.type = definition.type || 'WeightBased';
        exercise.notes = definition.notes || '';
        setRoutine(current => [...current, exercise]);
    }
    return(
        <div style={{textAlign: "center", padding:"2rem" }}>
            <h1>Workout Session</h1>
            <Timer/>
            <section aria-labelledby="routine-heading">
                <h2 id="routine-heading">Current Routine</h2>
                <p>Selections are for this workout. Your saved exercise library remains available for future workouts.</p>
                {routine.length === 0 ? <p>Select an exercise to begin your routine.</p> : (
                    <ol>
                        {routine.map((exercise, index) => (
                            <li key={`${exercise.exerciseID}-${index}`}>
                                {exercise.exerciseName} — {exercise.equipment}
                                <button aria-label={`Remove ${exercise.exerciseName} from routine`}
                                    onClick={() => setRoutine(current => current.filter((_, i) => i !== index))}>
                                    Remove
                                </button>
                            </li>
                        ))}
                    </ol>
                )}
            </section>
            <WorkoutList onSelectExercise={addExercise}/>
        </div>
    );
}

export default Session;
