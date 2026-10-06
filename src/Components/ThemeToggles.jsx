function ToggleTheme({ theme, onThemeChange }){
    return (
        <div className = "theme-toggle">
            <label htmlFor="theme-select">Theme:</label>

            <select
                id="theme-select"
                value={theme}
                onChange={(e) => onThemeChange(e.target.value)}
            >
                <option value="default">Default</option>
                <option value="dark">Dark Mode</option>
                <option value="light">Light Mode</option>
                <option value="colorblind">Colorblind Mode</option>
            </select>
        </div>
    );
}


export default ToggleTheme;