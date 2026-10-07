// current session the user will be working on during their workout,
// where they will log what exercises and weight they are performing

import Timer from "./Timer";
import WorkoutList from "./WorkoutList";

function Session() {
    const handleExerciseSelect = (exercise) => {
        console.log("Selected exercise:", exercise);
    };

    return (
        <div style={{ textAlign: "center", padding: "2rem" }}>
            <h1>Workout Session</h1>

            <Timer />

            <WorkoutList
                onSelectExercise={handleExerciseSelect}
            />
        </div>
    );
}

export default Session;