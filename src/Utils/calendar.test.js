import { getMonthCells, shiftMonth, getWorkoutDays, addWorkoutDay } from './calendar';

beforeEach(() => {
    localStorage.clear();
});

test('October 2026 starts on a Thursday, so the grid has 4 blank cells then 31 days', () => {
    const cells = getMonthCells(2026, 9);
    expect(cells.slice(0, 4)).toEqual([null, null, null, null]);
    expect(cells[4].getDate()).toBe(1);
    expect(cells.filter(Boolean)).toHaveLength(31);
});

test('February has 29 days in a leap year and 28 otherwise', () => {
    expect(getMonthCells(2028, 1).filter(Boolean)).toHaveLength(29);
    expect(getMonthCells(2026, 1).filter(Boolean)).toHaveLength(28);
});

test('a month starting on Sunday has no blank cells', () => {
    expect(getMonthCells(2026, 10)[0].getDate()).toBe(1);
});

test('moving months rolls over into the next and previous year', () => {
    const december = new Date(2026, 11, 1);
    expect(shiftMonth(december, 1)).toEqual(new Date(2027, 0, 1));
    expect(shiftMonth(new Date(2026, 0, 1), -1)).toEqual(new Date(2025, 11, 1));
});

test('workout days are stored once per local calendar day', () => {
    expect(getWorkoutDays()).toEqual([]);
    addWorkoutDay(new Date(2026, 9, 1, 8, 0));
    addWorkoutDay(new Date(2026, 9, 1, 23, 30));
    addWorkoutDay(new Date(2026, 9, 3));
    expect(getWorkoutDays()).toEqual(['2026-10-01', '2026-10-03']);
});

test('bad saved data falls back to no workout days', () => {
    localStorage.setItem('osc-workout-days', 'not json');
    expect(getWorkoutDays()).toEqual([]);
});
