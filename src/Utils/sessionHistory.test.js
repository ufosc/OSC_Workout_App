import Session from '../Constructors/session';
import Exercise from '../Constructors/sessionExercise';
import SetObject from '../Constructors/sessionSet';
import {
    toDayKey,
    toHistoryEntry,
    getSessionHistory,
    saveSessionToHistory,
    deleteSessionFromHistory,
    clearSessionHistory,
    groupSessionsByDay,
    getSessionDisplayName,
    getSessionStats,
    getMonthGrid
} from './sessionHistory';

function buildSession(dateString) {
    const bench = new Exercise('bench', 'Bench Press');
    bench.addSet(new SetObject(135, 10));
    bench.addSet(new SetObject(155, 8));
    const squat = new Exercise('squat', 'Squat');
    squat.addNewSet(225, 5);

    const session = new Session([bench, squat], 'Push Day');
    session.setDate(dateString);
    session.startTime = new Date(dateString);
    session.endTime = new Date(new Date(dateString).getTime() + 45 * 60000);
    return session;
}

describe('sessionHistory', () => {
    beforeEach(() => {
        localStorage.clear();
    });

    test('returns an empty list when nothing is saved', () => {
        expect(getSessionHistory()).toEqual([]);
    });

    test('returns an empty list when saved data is corrupted', () => {
        localStorage.setItem('osc-session-history', '{not json');
        expect(getSessionHistory()).toEqual([]);
    });

    test('converts a Session instance into a history entry', () => {
        const entry = toHistoryEntry(buildSession('2026-10-01T10:00:00'));
        expect(entry.name).toBe('Push Day');
        expect(entry.durationMinutes).toBe(45);
        expect(entry.exercises).toHaveLength(2);
        expect(entry.exercises[0]).toEqual({
            name: 'Bench Press',
            sets: [
                { weight: 135, reps: 10, time: 0, type: 'WeightBased' },
                { weight: 155, reps: 8, time: 0, type: 'WeightBased' }
            ]
        });
    });

    test('saves sessions newest first', () => {
        saveSessionToHistory(buildSession('2026-10-01T10:00:00'));
        saveSessionToHistory(buildSession('2026-10-03T10:00:00'));
        const history = getSessionHistory();
        expect(history).toHaveLength(2);
        expect(toDayKey(history[0].date)).toBe('2026-10-03');
        expect(toDayKey(history[1].date)).toBe('2026-10-01');
    });

    test('saving an entry with the same id replaces it', () => {
        const saved = saveSessionToHistory(buildSession('2026-10-01T10:00:00'));
        saveSessionToHistory({ ...saved, name: 'Leg Day' });
        const history = getSessionHistory();
        expect(history).toHaveLength(1);
        expect(history[0].name).toBe('Leg Day');
    });

    test('deletes a single session', () => {
        const first = saveSessionToHistory(buildSession('2026-10-01T10:00:00'));
        saveSessionToHistory(buildSession('2026-10-02T10:00:00'));
        const remaining = deleteSessionFromHistory(first.id);
        expect(remaining).toHaveLength(1);
        expect(getSessionHistory()[0].id).not.toBe(first.id);
    });

    test('clears all history', () => {
        saveSessionToHistory(buildSession('2026-10-01T10:00:00'));
        clearSessionHistory();
        expect(getSessionHistory()).toEqual([]);
    });

    test('ignores invalid sessions', () => {
        expect(saveSessionToHistory(null)).toBeNull();
        expect(saveSessionToHistory({ date: 'not a date' })).toBeNull();
        expect(getSessionHistory()).toEqual([]);
    });

    test('groups sessions by calendar day', () => {
        saveSessionToHistory(buildSession('2026-10-01T08:00:00'));
        saveSessionToHistory(buildSession('2026-10-01T18:00:00'));
        saveSessionToHistory(buildSession('2026-10-02T10:00:00'));
        const groups = groupSessionsByDay(getSessionHistory());
        expect(groups['2026-10-01']).toHaveLength(2);
        expect(groups['2026-10-02']).toHaveLength(1);
    });

    test('computes sets and total volume', () => {
        const entry = toHistoryEntry(buildSession('2026-10-01T10:00:00'));
        expect(getSessionStats(entry)).toEqual({
            exerciseCount: 2,
            setCount: 3,
            totalVolume: 135 * 10 + 155 * 8 + 225 * 5
        });
    });

    test('falls back to a dated name when the session is unnamed', () => {
        const entry = toHistoryEntry({ date: '2026-10-01T10:00:00', exerciseList: [] });
        expect(getSessionDisplayName(entry)).toContain('Workout Session - ');
    });

    test('builds a month grid padded to full weeks', () => {
        const grid = getMonthGrid(2026, 9);
        expect(grid.length % 7).toBe(0);
        expect(grid.filter(Boolean)).toHaveLength(31);
        expect(grid[new Date(2026, 9, 1).getDay()].getDate()).toBe(1);
    });
});
