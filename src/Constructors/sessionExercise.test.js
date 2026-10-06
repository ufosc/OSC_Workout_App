import Exercise from "./sessionExercise";
import SetObject from "./sessionSet";

const validSet = () => ({ weight: 20, reps: 10, time: 0, type: "WeightBased" });

describe("Exercise set validation", () => {
    test("accepts a complete plain set without copying it", () => {
        const exercise = new Exercise();
        const set = validSet();
        expect(exercise.addSet(set)).toBe(true);
        expect(exercise.getCurrentSet()).toBe(set);
    });

    test("accepts a SetObject instance", () => {
        const exercise = new Exercise();
        const set = new SetObject();
        expect(exercise.addSet(set)).toBe(true);
        expect(exercise.getCurrentSet()).toBe(set);
    });

    test("allows empty values when the required keys exist", () => {
        const exercise = new Exercise();
        expect(exercise.addSet({ weight: "", reps: null, time: 0, type: "" })).toBe(true);
        expect(exercise.getTotalSets()).toBe(1);
    });

    test.each(["weight", "reps", "time", "type"])("rejects a set missing %s without changing existing sets", (field) => {
        const exercise = new Exercise();
        const existing = validSet();
        exercise.addSet(existing);
        const incomplete = validSet();
        delete incomplete[field];
        expect(exercise.addSet(incomplete)).toBe(false);
        expect(exercise.setList).toEqual([existing]);
    });

    test.each([null, undefined, false, 42, "set", [], {}])("rejects non-set input %p", (input) => {
        const exercise = new Exercise();
        expect(exercise.addSet(input)).toBe(false);
        expect(exercise.getTotalSets()).toBe(0);
    });

    test("rejects inherited fields", () => {
        const exercise = new Exercise();
        expect(exercise.addSet(Object.create(validSet()))).toBe(false);
        expect(exercise.getTotalSets()).toBe(0);
    });

    test("keeps addNewSet defaults and completion state", () => {
        const exercise = new Exercise();
        const set = exercise.addNewSet();
        expect(set).toEqual({ weight: 0, reps: 0, time: 0, type: "WeightBased", completed: false });
        expect(exercise.getCurrentSet()).toBe(set);
        expect(exercise.getTotalSets()).toBe(1);
    });

    test("keeps addNewSet custom values", () => {
        const exercise = new Exercise();
        const set = exercise.addNewSet(25, 8, 60, "TimeBased");
        expect(set).toMatchObject({ weight: 25, reps: 8, time: 60, type: "TimeBased" });
        expect(exercise.getCurrentSet()).toBe(set);
    });
});
