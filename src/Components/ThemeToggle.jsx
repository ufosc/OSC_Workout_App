const OPTIONS = [
    {value: 'light', label: 'Light'}, {value: 'dark', label: 'Dark'}, {value: 'colorblind', label: 'Colorblind'}
];

function ThemeToggle({theme, setTheme}) {
    return (
        <div className= "theme-toggle" role="group" aria-label="Color theme">{OPTIONS.map(({value, label}) => (
            <button 
            key = {value} 
            type = "button"
            className={`theme-option${theme === value ? ' active' : ''}`}
            aria-pressed={theme === value}
            onClick={()=>setTheme(value)}
            > {label} </button>
        ))}</div>
    );
}

export default ThemeToggle;