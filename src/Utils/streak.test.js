import { recordLogin, getStreak, getBestStreak, getFreezes, getMilestone, getLoginEntries } from './streak';

beforeEach(() => {
    localStorage.clear();
});

// logs in once a day for `count` days starting on Oct `startDay`, 2026
function loginDays(username, startDay, count) {
    let result;
    for (let i = 0; i < count; i++) {
        result = recordLogin(username, new Date(2026, 9, startDay + i));
    }
    return result;
}

test('first login starts the streak at 1 and records an entry', () => {
    const result = recordLogin('adit', new Date(2026, 9, 1, 9, 0));
    expect(result.streak).toBe(1);
    expect(getLoginEntries('adit')).toEqual(['2026-10-01']);
});

test('logging in on consecutive days adds 1 each day', () => {
    recordLogin('adit', new Date(2026, 9, 1, 23, 59));
    recordLogin('adit', new Date(2026, 9, 2, 0, 1));
    const result = recordLogin('adit', new Date(2026, 9, 3, 12, 0));
    expect(result.streak).toBe(3);
    expect(getLoginEntries('adit')).toEqual(['2026-10-01', '2026-10-02', '2026-10-03']);
});

test('logging in twice on the same day only counts once', () => {
    recordLogin('adit', new Date(2026, 9, 1, 9, 0));
    const result = recordLogin('adit', new Date(2026, 9, 1, 18, 0));
    expect(result.streak).toBe(1);
    expect(getLoginEntries('adit')).toEqual(['2026-10-01']);
});

test('missing a day with no freeze restarts the streak at 1', () => {
    recordLogin('adit', new Date(2026, 9, 1));
    recordLogin('adit', new Date(2026, 9, 2));
    const result = recordLogin('adit', new Date(2026, 9, 4));
    expect(result.streak).toBe(1);
});

test('streak carries across a month boundary', () => {
    recordLogin('adit', new Date(2026, 9, 31));
    const result = recordLogin('adit', new Date(2026, 10, 1));
    expect(result.streak).toBe(2);
});

test('getStreak shows 0 after a missed day and for unknown users', () => {
    recordLogin('adit', new Date(2026, 9, 1));
    expect(getStreak('adit', new Date(2026, 9, 2))).toBe(1);
    expect(getStreak('adit', new Date(2026, 9, 3))).toBe(0);
    expect(getStreak('nobody', new Date(2026, 9, 1))).toBe(0);
});

test('each user has their own streak, ignoring username case', () => {
    recordLogin('adit', new Date(2026, 9, 1));
    recordLogin('Adit', new Date(2026, 9, 2));
    recordLogin('ryder', new Date(2026, 9, 2));
    expect(getStreak('adit', new Date(2026, 9, 2))).toBe(2);
    expect(getStreak('ryder', new Date(2026, 9, 2))).toBe(1);
});

test('best streak is kept after the streak resets', () => {
    loginDays('adit', 1, 5);
    recordLogin('adit', new Date(2026, 9, 10));
    expect(getStreak('adit', new Date(2026, 9, 10))).toBe(1);
    expect(getBestStreak('adit')).toBe(5);
});

test('a freeze is earned every 7 days', () => {
    loginDays('adit', 1, 6);
    expect(getFreezes('adit')).toBe(0);
    loginDays('adit', 7, 1);
    expect(getFreezes('adit')).toBe(1);
});

test('a freeze covers one missed day and is used up', () => {
    loginDays('adit', 1, 7);
    // skip Oct 8; streak still shows on the 9th before logging in
    expect(getStreak('adit', new Date(2026, 9, 9))).toBe(7);
    const result = recordLogin('adit', new Date(2026, 9, 9));
    expect(result.usedFreeze).toBe(true);
    expect(result.streak).toBe(8);
    expect(getFreezes('adit')).toBe(0);
});

test('a freeze does not cover two missed days', () => {
    loginDays('adit', 1, 7);
    expect(getStreak('adit', new Date(2026, 9, 10))).toBe(0);
    expect(recordLogin('adit', new Date(2026, 9, 10)).streak).toBe(1);
    expect(getFreezes('adit')).toBe(1);
});

test('freezes are capped at 2', () => {
    loginDays('adit', 1, 21);
    expect(getFreezes('adit')).toBe(2);
});

test('milestones return the highest one reached', () => {
    expect(getMilestone(2)).toBeNull();
    expect(getMilestone(3)).toBe('3 days in a row, keep it going.');
    expect(getMilestone(10)).toBe('One week locked in.');
    expect(getMilestone(45)).toBe('30 day streak. Aura maxed.');
});
