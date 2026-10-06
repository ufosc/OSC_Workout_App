import {
  DEFAULT_THEME,
  THEME_STORAGE_KEY,
  getStoredTheme,
  normalizeTheme,
  saveTheme,
} from './theme';

function createStorage(initialValues = {}) {
  const values = { ...initialValues };

  return {
    getItem: (key) => (Object.prototype.hasOwnProperty.call(values, key) ? values[key] : null),
    setItem: (key, value) => {
      values[key] = value;
    },
  };
}

test('normalizes unsupported themes to the default theme', () => {
  expect(normalizeTheme('not-a-theme')).toBe(DEFAULT_THEME);
  expect(normalizeTheme(null)).toBe(DEFAULT_THEME);
});

test('reads a stored theme when it is supported', () => {
  const storage = createStorage({ [THEME_STORAGE_KEY]: 'light' });

  expect(getStoredTheme(storage)).toBe('light');
});

test('falls back to the default theme when storage is empty or invalid', () => {
  expect(getStoredTheme(createStorage())).toBe(DEFAULT_THEME);
  expect(getStoredTheme(createStorage({ [THEME_STORAGE_KEY]: 'sepia' }))).toBe(DEFAULT_THEME);
});

test('saves only supported theme values', () => {
  const storage = createStorage();

  expect(saveTheme('colorblind', storage)).toBe('colorblind');
  expect(getStoredTheme(storage)).toBe('colorblind');

  expect(saveTheme('rainbow', storage)).toBe(DEFAULT_THEME);
  expect(getStoredTheme(storage)).toBe(DEFAULT_THEME);
});
