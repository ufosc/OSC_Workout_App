import { recordLogin, getStreak, getLoginEntries } from './streak';

beforeEach(() => {
    localStorage.clear();
});

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

test('missing a day restarts the streak at 1', () => {
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
