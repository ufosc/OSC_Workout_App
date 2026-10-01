// login streak for each user, saved in localStorage until the app has a backend

const CURRENT_USER_KEY = 'osc-current-user';
const STREAK_KEY_PREFIX = 'osc-streak:';
const MS_PER_DAY = 1000 * 60 * 60 * 24;

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
    const empty = { streak: 0, lastEntryDate: null, entries: [] };
    try {
        const saved = JSON.parse(localStorage.getItem(streakKey(username)));
        return saved ? { ...empty, ...saved } : empty;
    } catch (error) {
        return empty;
    }
}

// Records a login entry for today and updates the streak:
// first login of the day after logging in yesterday -> streak + 1
// first login after missing a day (or first login ever) -> streak restarts at 1
// logging in again on the same day -> no change
export function recordLogin(username, now = new Date()) {
    const data = loadStreakData(username);
    const today = toDayKey(now);

    if (data.lastEntryDate && daysBetween(data.lastEntryDate, today) <= 0) {
        return data;
    }

    const loggedInYesterday = data.lastEntryDate && daysBetween(data.lastEntryDate, today) === 1;
    const updated = {
        streak: loggedInYesterday ? data.streak + 1 : 1,
        lastEntryDate: today,
        entries: [...data.entries, today]
    };
    localStorage.setItem(streakKey(username), JSON.stringify(updated));
    return updated;
}

// current streak, which is 0 once a full day has been missed
export function getStreak(username, now = new Date()) {
    const data = loadStreakData(username);
    if (!data.lastEntryDate || daysBetween(data.lastEntryDate, toDayKey(now)) > 1) {
        return 0;
    }
    return data.streak;
}

export function getLoginEntries(username) {
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
