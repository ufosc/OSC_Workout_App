// current session the user will be working on during their workout, where they will log what exersises and weight they are perorming
import Timer from "./Timer";
import { useRef, useState } from "react";

function Session() {
    const [exercises, setExercises] = useState([]);
    const [exerciseName, setExerciseName] = useState("");
    const nextId = useRef(0);

    const addExercise = (event) => {
        event.preventDefault();
        const name = exerciseName.trim();
        if (!name) return;

        setExercises((current) => [
            ...current,
            {
                id: nextId.current++,
                name,
                sets: [{ id: nextId.current++, weight: "", reps: "", completed: false }],
            },
        ]);
        setExerciseName("");
    };

    const updateSet = (exerciseId, setId, changes) => {
        setExercises((current) => current.map((exercise) =>
            exercise.id !== exerciseId
                ? exercise
                : {
                    ...exercise,
                    sets: exercise.sets.map((set) =>
                        set.id === setId ? { ...set, ...changes } : set
                    ),
                }
        ));
    };

    const addSet = (exerciseId) => {
        const newSet = { id: nextId.current++, weight: "", reps: "", completed: false };
        setExercises((current) => current.map((exercise) =>
            exercise.id === exerciseId
                ? { ...exercise, sets: [...exercise.sets, newSet] }
                : exercise
        ));
    };

    const removeSet = (exerciseId, setId) => {
        setExercises((current) => current.map((exercise) =>
            exercise.id === exerciseId
                ? { ...exercise, sets: exercise.sets.filter((set) => set.id !== setId) }
                : exercise
        ));
    };

    const completedSets = exercises.reduce(
        (total, exercise) => total + exercise.sets.filter((set) => set.completed).length,
        0
    );

    const buttonStyle = {
        border: "1px solid #111827",
        borderRadius: "4px",
        background: "#111827",
        color: "#fff",
        padding: "0.6rem 0.85rem",
        fontWeight: 700,
        cursor: "pointer",
    };
    const inputStyle = {
        border: "2px solid #374151",
        borderRadius: "4px",
        background: "#fff",
        color: "#111827",
        padding: "0.6rem",
        minWidth: 0,
        fontSize: "1rem",
    };

    return (
        <div style={{ textAlign: "center", padding: "2rem", maxWidth: "900px", margin: "0 auto", color: "#111827" }}>
            <h1>Workout Session</h1>
            <section aria-label="Session summary" style={{ display: "flex", justifyContent: "center", gap: "2rem", flexWrap: "wrap", margin: "1.5rem 0", padding: "1rem", background: "#e5e7eb", borderLeft: "4px solid #0f766e" }}>
                <strong>Exercises logged: {exercises.length}</strong>
                <strong>Completed sets: {completedSets}</strong>
            </section>

            <form onSubmit={addExercise} style={{ display: "flex", gap: "0.5rem", maxWidth: "560px", margin: "0 auto 1.5rem" }}>
                <label htmlFor="exercise-name" style={{ position: "absolute", width: "1px", height: "1px", padding: 0, margin: "-1px", overflow: "hidden", clip: "rect(0, 0, 0, 0)", whiteSpace: "nowrap", border: 0 }}>
                    Exercise name
                </label>
                <input
                    id="exercise-name"
                    type="text"
                    value={exerciseName}
                    onChange={(event) => setExerciseName(event.target.value)}
                    placeholder="Add an exercise"
                    style={{ ...inputStyle, flex: 1 }}
                />
                <button type="submit" style={buttonStyle}>Add Exercise</button>
            </form>

            <div style={{ display: "grid", gap: "1rem", textAlign: "left" }}>
                {exercises.map((exercise) => (
                    <section key={exercise.id} aria-label={exercise.name} style={{ border: "1px solid #9ca3af", borderRadius: "4px", padding: "1rem", background: "#f9fafb" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem", flexWrap: "wrap", marginBottom: "0.75rem" }}>
                            <h2 style={{ margin: 0, fontSize: "1.25rem" }}>{exercise.name}</h2>
                            <button
                                type="button"
                                onClick={() => setExercises((current) => current.filter((item) => item.id !== exercise.id))}
                                style={{ ...buttonStyle, background: "#b91c1c", borderColor: "#b91c1c" }}
                            >
                                Delete Exercise
                            </button>
                        </div>

                        <div style={{ display: "grid", gap: "0.5rem" }}>
                            {exercise.sets.map((set, index) => (
                                <div key={set.id} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(110px, 1fr))", alignItems: "center", gap: "0.6rem", padding: "0.65rem", background: "#fff", border: "1px solid #d1d5db", borderRadius: "4px" }}>
                                    <strong>Set {index + 1}</strong>
                                    <label style={{ display: "grid", gap: "0.25rem", fontSize: "0.85rem", fontWeight: 700 }}>
                                        Weight (lbs)
                                        <input
                                            type="number"
                                            min="0"
                                            step="0.5"
                                            value={set.weight}
                                            onChange={(event) => updateSet(exercise.id, set.id, { weight: event.target.value })}
                                            aria-label={`${exercise.name} set ${index + 1} weight in pounds`}
                                            style={inputStyle}
                                        />
                                    </label>
                                    <label style={{ display: "grid", gap: "0.25rem", fontSize: "0.85rem", fontWeight: 700 }}>
                                        Reps
                                        <input
                                            type="number"
                                            min="1"
                                            step="1"
                                            value={set.reps}
                                            onChange={(event) => updateSet(exercise.id, set.id, { reps: event.target.value })}
                                            aria-label={`${exercise.name} set ${index + 1} reps`}
                                            style={inputStyle}
                                        />
                                    </label>
                                    <label style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontWeight: 700 }}>
                                        <input
                                            type="checkbox"
                                            checked={set.completed}
                                            onChange={(event) => updateSet(exercise.id, set.id, { completed: event.target.checked })}
                                            aria-label={`Mark ${exercise.name} set ${index + 1} complete`}
                                            style={{ width: "1.2rem", height: "1.2rem", accentColor: "#0f766e" }}
                                        />
                                        Done
                                    </label>
                                    <button
                                        type="button"
                                        onClick={() => removeSet(exercise.id, set.id)}
                                        aria-label={`Delete ${exercise.name} set ${index + 1}`}
                                        style={{ ...buttonStyle, background: "#4b5563", borderColor: "#4b5563", padding: "0.5rem" }}
                                    >
                                        Delete Set
                                    </button>
                                </div>
                            ))}
                        </div>
                        <button type="button" onClick={() => addSet(exercise.id)} style={{ ...buttonStyle, marginTop: "0.75rem", background: "#0f766e", borderColor: "#0f766e" }}>
                            Add Set
                        </button>
                    </section>
                ))}
            </div>

            <Timer />
        </div>
    );
}

export default Session;