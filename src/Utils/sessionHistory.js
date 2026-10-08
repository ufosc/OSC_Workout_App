const HISTORY_KEY = 'osc-session-history';

export function toDayKey(date) {
    const d = new Date(date);
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${d.getFullYear()}-${month}-${day}`;
}

function toNumber(value) {
    const n = Number(value);
    return Number.isFinite(n) ? n : 0;
}

function normalizeSet(set) {
    if (!set || typeof set !== 'object') return null;
    return {
        weight: toNumber(set.weight),
        reps: toNumber(set.reps),
        time: toNumber(set.time),
        type: set.type || 'WeightBased'
    };
}

function normalizeExercise(exercise) {
    if (!exercise || typeof exercise !== 'object') return null;
    const name = exercise.exerciseName || exercise.name || 'Unnamed exercise';
    const rawSets = Array.isArray(exercise.setList) ? exercise.setList
        : Array.isArray(exercise.sets) ? exercise.sets : [];
    return {
        name,
        sets: rawSets.map(normalizeSet).filter(Boolean)
    };
}

function getDurationMinutes(startTime, endTime) {
    if (!startTime || !endTime) return 0;
    const ms = new Date(endTime) - new Date(startTime);
    return ms > 0 ? Math.round(ms / 60000) : 0;
}

function makeId(date) {
    return `${new Date(date).getTime()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function toHistoryEntry(session) {
    const data = session && typeof session.toJSON === 'function' ? session.toJSON() : session;
    if (!data) return null;

    const date = new Date(data.endTime || data.date || Date.now());
    if (Number.isNaN(date.getTime())) return null;

    const exerciseList = Array.isArray(data.exerciseList) ? data.exerciseList
        : Array.isArray(data.exercises) ? data.exercises : [];

    return {
        id: data.id || makeId(date),
        name: data.sessionName || data.name || null,
        date: date.toISOString(),
        startTime: data.startTime ? new Date(data.startTime).toISOString() : null,
        endTime: data.endTime ? new Date(data.endTime).toISOString() : null,
        durationMinutes: getDurationMinutes(data.startTime, data.endTime),
        exercises: exerciseList.map(normalizeExercise).filter(Boolean)
    };
}

export function getSessionHistory() {
    try {
        const saved = JSON.parse(localStorage.getItem(HISTORY_KEY));
        if (!Array.isArray(saved)) return [];
        return saved
            .filter((entry) => entry && entry.id && entry.date)
            .sort((a, b) => new Date(b.date) - new Date(a.date));
    } catch (error) {
        return [];
    }
}

function writeHistory(entries) {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(entries));
}

export function saveSessionToHistory(session) {
    const entry = toHistoryEntry(session);
    if (!entry) return null;
    const others = getSessionHistory().filter((saved) => saved.id !== entry.id);
    writeHistory([entry, ...others]);
    return entry;
}

export function deleteSessionFromHistory(id) {
    const remaining = getSessionHistory().filter((entry) => entry.id !== id);
    writeHistory(remaining);
    return remaining;
}

export function clearSessionHistory() {
    localStorage.removeItem(HISTORY_KEY);
}

export function groupSessionsByDay(entries) {
    return entries.reduce((groups, entry) => {
        const key = toDayKey(entry.date);
        if (!groups[key]) groups[key] = [];
        groups[key].push(entry);
        return groups;
    }, {});
}

export function getSessionDisplayName(entry) {
    if (entry.name) return entry.name;
    return `Workout Session - ${new Date(entry.date).toLocaleDateString()}`;
}

export function getSessionStats(entry) {
    const sets = entry.exercises.flatMap((exercise) => exercise.sets);
    const volume = sets.reduce((total, set) => total + set.weight * set.reps, 0);
    return {
        exerciseCount: entry.exercises.length,
        setCount: sets.length,
        totalVolume: volume
    };
}

export function getMonthGrid(year, month) {
    const first = new Date(year, month, 1);
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const cells = [];
    for (let i = 0; i < first.getDay(); i++) cells.push(null);
    for (let day = 1; day <= daysInMonth; day++) cells.push(new Date(year, month, day));
    while (cells.length % 7 !== 0) cells.push(null);
    return cells;
}
