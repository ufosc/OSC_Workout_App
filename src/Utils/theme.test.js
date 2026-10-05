import { THEME_CHOICES, getSavedTheme, applyTheme, setTheme, watchOtherTabs } from './theme';

function currentTheme() {
    return document.documentElement.getAttribute('data-theme');
}

beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
    document.head.innerHTML = '<meta name="theme-color" content="#000000">';
});

afterEach(() => {
    jest.restoreAllMocks();
});

test('nothing saved gives the default, dark', () => {
    expect(getSavedTheme()).toBe('dark');
});

test('a saved value that is not a real choice is ignored', () => {
    localStorage.setItem('osc-theme', 'banana');
    expect(getSavedTheme()).toBe('dark');
});

test('system is not a choice anymore, so a leftover saved system falls back to dark', () => {
    localStorage.setItem('osc-theme', 'system');
    expect(getSavedTheme()).toBe('dark');
});

test('every real choice can be saved and read back', () => {
    THEME_CHOICES.forEach((choice) => {
        setTheme(choice);
        expect(getSavedTheme()).toBe(choice);
    });
});

test('setTheme puts the theme on the html tag and saves it', () => {
    setTheme('colorblind');
    expect(currentTheme()).toBe('colorblind');
    expect(localStorage.getItem('osc-theme')).toBe('colorblind');
});

test('setTheme ignores a choice that does not exist', () => {
    setTheme('light');
    setTheme('neon');
    expect(currentTheme()).toBe('light');
    expect(getSavedTheme()).toBe('light');
});

test('getSavedTheme still works when localStorage is blocked', () => {
    jest.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
        throw new Error('blocked');
    });
    expect(getSavedTheme()).toBe('dark');
});

test('setTheme still applies the theme when localStorage is blocked', () => {
    jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new Error('blocked');
    });
    setTheme('light');
    expect(currentTheme()).toBe('light');
});

test('the phone browser bar color follows the page color of the theme', () => {
    jest.spyOn(window, 'getComputedStyle').mockReturnValue({ getPropertyValue: () => ' #dce8fa ' });
    applyTheme('light');
    expect(document.querySelector('meta[name="theme-color"]').getAttribute('content')).toBe('#dce8fa');
});

test('the browser bar color is left alone when the css variable is missing', () => {
    jest.spyOn(window, 'getComputedStyle').mockReturnValue({ getPropertyValue: () => '' });
    applyTheme('light');
    expect(document.querySelector('meta[name="theme-color"]').getAttribute('content')).toBe('#000000');
});

test('applyTheme does not break when the page has no theme-color tag', () => {
    document.head.innerHTML = '';
    expect(() => applyTheme('dark')).not.toThrow();
    expect(currentTheme()).toBe('dark');
});

test('a theme saved in another tab is applied here and reported to the dropdown', () => {
    const seen = jest.fn();
    const stop = watchOtherTabs(seen);

    localStorage.setItem('osc-theme', 'light'); // what the other tab did
    window.dispatchEvent(new StorageEvent('storage', { key: 'osc-theme' }));

    expect(currentTheme()).toBe('light');
    expect(seen).toHaveBeenCalledWith('light');
    stop();
});

test('other things saved in localStorage do not change the theme', () => {
    const seen = jest.fn();
    const stop = watchOtherTabs(seen);

    window.dispatchEvent(new StorageEvent('storage', { key: 'osc-current-user' }));

    expect(currentTheme()).toBeNull();
    expect(seen).not.toHaveBeenCalled();
    stop();
});

test('clearing localStorage in another tab goes back to dark', () => {
    setTheme('colorblind');
    const seen = jest.fn();
    const stop = watchOtherTabs(seen);

    localStorage.clear(); // the other tab cleared everything
    window.dispatchEvent(new StorageEvent('storage', { key: null }));

    expect(seen).toHaveBeenCalledWith('dark');
    expect(currentTheme()).toBe('dark');
    stop();
});

test('after stop is called other tabs no longer change this one', () => {
    const seen = jest.fn();
    const stop = watchOtherTabs(seen);
    stop();

    localStorage.setItem('osc-theme', 'light');
    window.dispatchEvent(new StorageEvent('storage', { key: 'osc-theme' }));

    expect(seen).not.toHaveBeenCalled();
    expect(currentTheme()).toBeNull();
});
