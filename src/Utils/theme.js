export const DEFAULT_THEME = 'dark';
export const THEME_STORAGE_KEY = 'osc-workout-theme';

export const THEMES = [
  {
    id: 'light',
    label: 'Light',
    metaColor: '#f7fbff',
  },
  {
    id: 'dark',
    label: 'Dark',
    metaColor: '#020617',
  },
  {
    id: 'colorblind',
    label: 'Colorblind',
    metaColor: '#f8f7f1',
  },
];

const THEME_IDS = THEMES.map((theme) => theme.id);

function getDefaultStorage() {
  if (typeof window === 'undefined') {
    return null;
  }

  return window.localStorage;
}

export function normalizeTheme(theme) {
  return THEME_IDS.includes(theme) ? theme : DEFAULT_THEME;
}

export function getStoredTheme(storage = getDefaultStorage()) {
  if (!storage) {
    return DEFAULT_THEME;
  }

  try {
    return normalizeTheme(storage.getItem(THEME_STORAGE_KEY));
  } catch {
    return DEFAULT_THEME;
  }
}

export function saveTheme(theme, storage = getDefaultStorage()) {
  const normalizedTheme = normalizeTheme(theme);

  if (!storage) {
    return normalizedTheme;
  }

  try {
    storage.setItem(THEME_STORAGE_KEY, normalizedTheme);
  } catch {
    return normalizedTheme;
  }

  return normalizedTheme;
}

export function getThemeMetaColor(theme) {
  return THEMES.find((themeOption) => themeOption.id === normalizeTheme(theme)).metaColor;
}
