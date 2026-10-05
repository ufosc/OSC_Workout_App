import { useEffect, useState } from 'react';
import { THEME_CHOICES, getSavedTheme, setTheme, watchOtherTabs } from '../Utils/theme';

// the dropdown in the nav bar, picks the color theme for the whole app
function ThemeToggle() {
    const [selectedTheme, setSelectedTheme] = useState(getSavedTheme); // starts on whatever was saved last time

    useEffect(() => {
        return watchOtherTabs(setSelectedTheme); // another tab changed the theme, so show it here too
    }, []);

    function handleChange(event) {
        setSelectedTheme(event.target.value);
        setTheme(event.target.value); // applies it and saves it
    }

    return (
        <label className="theme-picker">
            Theme{' '}
            <select value={selectedTheme} onChange={handleChange}>
                {THEME_CHOICES.map((themeChoice) => (
                    <option key={themeChoice} value={themeChoice}>
                        {themeChoice.charAt(0).toUpperCase() + themeChoice.slice(1)}
                    </option>
                ))}
            </select>
        </label>
    );
}

export default ThemeToggle;
