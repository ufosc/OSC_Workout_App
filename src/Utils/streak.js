// workout streak for each user, saved in localStorage until the app has a backend

const CURRENT_USER_KEY = 'osc-current-user';
const STREAK_KEY_PREFIX = 'osc-streak:';
const MS_PER_DAY = 1000 * 60 * 60 * 24;

// a freeze is earned every FREEZE_EVERY days of streak, up to MAX_FREEZES saved
const FREEZE_EVERY = 7;
const MAX_FREEZES = 2;

// highest first so find() returns the biggest milestone reached
const MILESTONES = [
    { days: 100, message: '100 days. Actual legend.' },
    { days: 30, message: '30 day streak. Aura maxed.' },
    { days: 7, message: 'One week locked in.' },
    { days: 3, message: '3 days in a row, keep it going.' }
];

// calendar day in the user's local time, e.g. "2026-10-01"
function toDayKey(date) {
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${date.getFullYear()}-${month}-${day}`;
}

function daysBetween(fromDayKey, toDayKey) {
    const [fromYear, fromMonth, fromDay] = fromDayKey.split('-').map(Number);
    const [toYear, toMonth, toDay] = toDayKey.split('-').map(Number);
    const from = new Date(fromYear, fromMonth - 1, fromDay);
    const to = new Date(toYear, toMonth - 1, toDay);
    // rounded so a 23 or 25 hour daylight savings day still counts as one day
    return Math.round((to - from) / MS_PER_DAY);
}

function streakKey(username) {
    return STREAK_KEY_PREFIX + username.trim().toLowerCase();
}

function loadStreakData(username) {
    const empty = { streak: 0, best: 0, freezes: 0, lastEntryDate: null, entries: [] };
    try {
        const saved = JSON.parse(localStorage.getItem(streakKey(username)));
        return saved ? { ...empty, ...saved } : empty;
    } catch (error) {
        return empty;
    }
}

// Records a login entry for today and updates the streak:
// first login of the day after logging in yesterday -> streak + 1
// missed exactly one day but has a freeze -> uses the freeze, streak + 1
// missed more than that (or first login ever) -> streak restarts at 1
// logging in again on the same day -> no change
export function recordWorkout(username, now = new Date()) {
    const data = loadStreakData(username);
    const today = toDayKey(now);
    const gap = data.lastEntryDate ? daysBetween(data.lastEntryDate, today) : null;

    if (gap !== null && gap <= 0) {
        return { ...data, alreadyCounted: true };
    }

    const usedFreeze = gap === 2 && data.freezes > 0;
    const continues = gap === 1 || usedFreeze;
    const newStreak = continues ? data.streak + 1 : 1;

    let freezes = usedFreeze ? data.freezes - 1 : data.freezes;
    if (newStreak % FREEZE_EVERY === 0) {
        freezes = Math.min(freezes + 1, MAX_FREEZES);
    }

    const updated = {
        streak: newStreak,
        best: Math.max(data.best, newStreak),
        freezes,
        lastEntryDate: today,
        entries: [...data.entries, today]
    };
    localStorage.setItem(streakKey(username), JSON.stringify(updated));
    return { ...updated, usedFreeze };
}

// current streak, which is 0 once the user has missed more days than a freeze can cover
export function getStreak(username, now = new Date()) {
    const data = loadStreakData(username);
    if (!data.lastEntryDate) {
        return 0;
    }
    const gap = daysBetween(data.lastEntryDate, toDayKey(now));
    const allowedGap = data.freezes > 0 ? 2 : 1;
    return gap > allowedGap ? 0 : data.streak;
}

export function getBestStreak(username) {
    return loadStreakData(username).best;
}

export function getFreezes(username) {
    return loadStreakData(username).freezes;
}

// highest milestone message reached, or null
export function getMilestone(streak) {
    const hit = MILESTONES.find((milestone) => streak >= milestone.days);
    return hit ? hit.message : null;
}

export function getWorkoutEntries(username) {
    return loadStreakData(username).entries;
}

export function getCurrentUser() {
    return localStorage.getItem(CURRENT_USER_KEY);
}

export function setCurrentUser(username) {
    localStorage.setItem(CURRENT_USER_KEY, username.trim());
}

export function clearCurrentUser() {
    localStorage.removeItem(CURRENT_USER_KEY);
}
