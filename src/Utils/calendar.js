// helpers for the calendar page, kept separate from the component so testing is easier
import { toDayKey } from './streak';

const WORKOUT_DAYS_KEY = 'osc-workout-days';

// Returns the cells for a month grid, Sunday first.
export function getMonthCells(year, month) {
    const leadingBlanks = new Date(year, month, 1).getDay();
    // day 0 of next month is the last day of this month
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const cells = [];
    for (let i = 0; i < leadingBlanks; i++) {
        cells.push(null);
    }
    for (let day = 1; day <= daysInMonth; day++) {
        cells.push(new Date(year, month, day));
    }
    return cells;
}

export function shiftMonth(monthStart, offset) {
    return new Date(monthStart.getFullYear(), monthStart.getMonth() + offset, 1);
}

// Days the user worked out, as local day keys like "2026-10-01". In localStorage in the meantime since there is no backend yet...
export function getWorkoutDays() {
    try {
        const saved = JSON.parse(localStorage.getItem(WORKOUT_DAYS_KEY));
        return Array.isArray(saved) ? saved : [];
    } catch (error) {
        return [];
    }
}

// marks a day as a workout day; meant to be called when a workout session is finished
export function addWorkoutDay(date = new Date()) {
    const days = getWorkoutDays();
    const key = toDayKey(date);
    if (!days.includes(key)) {
        days.push(key);
        localStorage.setItem(WORKOUT_DAYS_KEY, JSON.stringify(days));
    }
    return days;
}
