import React from 'react';
import { THEMES, normalizeTheme } from '../Utils/theme';

function ThemeToggle({ selectedTheme, onThemeChange }) {
  const activeTheme = normalizeTheme(selectedTheme);
  const handleThemeChange = typeof onThemeChange === 'function' ? onThemeChange : () => {};

  return (
    <section className="theme-toggle" aria-label="Theme selector">
      <span className="theme-toggle__label">Theme</span>
      <div className="theme-toggle__options" role="group" aria-label="Theme options">
        {THEMES.map((theme) => (
          <button
            key={theme.id}
            type="button"
            className={`theme-toggle__option${activeTheme === theme.id ? ' active' : ''}`}
            aria-pressed={activeTheme === theme.id}
            onClick={() => handleThemeChange(theme.id)}
          >
            {theme.label}
          </button>
        ))}
      </div>
    </section>
  );
}

export default ThemeToggle;
