// theme for the whole app, saved in localStorage so it stays after a reload

const THEME_KEY = 'osc-theme'; // the name the saved theme is stored under
const DEFAULT_THEME = 'dark'; // the original neon look, used when nothing is saved yet
export const THEME_CHOICES = ['dark', 'light', 'colorblind']; // the 3 options in the dropdown

// the theme saved last time, or the default if nothing valid is saved
export function getSavedTheme() {
    try {
        const savedTheme = localStorage.getItem(THEME_KEY); // null the first time
        return THEME_CHOICES.includes(savedTheme) ? savedTheme : DEFAULT_THEME; // ignores anything that is not a real choice
    } catch (error) {
        return DEFAULT_THEME; // localStorage can be blocked in private browsing
    }
}

// the app is a PWA, so the phone browser bar should match the page and not stay black
function updateBrowserBarColor() {
    const browserBarTag = document.querySelector('meta[name="theme-color"]'); // the tag in public/index.html
    if (!browserBarTag) {
        return; // no tag, nothing to update
    }
    const pageColor = getComputedStyle(document.documentElement).getPropertyValue('--home-bottom').trim(); // the bottom color of the current theme
    if (pageColor) {
        browserBarTag.setAttribute('content', pageColor);
    }
}

// puts the theme on the html tag, the css variables change from there
export function applyTheme(themeChoice) {
    document.documentElement.setAttribute('data-theme', themeChoice); // index.css looks for this
    updateBrowserBarColor(); // has to come after the line above so the new colors are read
}

// used by the dropdown, applies the choice and saves it
export function setTheme(themeChoice) {
    if (!THEME_CHOICES.includes(themeChoice)) {
        return; // not a real choice, do nothing
    }
    applyTheme(themeChoice);
    try {
        localStorage.setItem(THEME_KEY, themeChoice);
    } catch (error) {
        // localStorage is blocked, the theme still works until the page reloads
    }
}

// keeps other open tabs of the app in step, the browser only fires this in the tabs that did not make the change
// onThemeChange lets the dropdown show the new choice, returns a function that stops listening
export function watchOtherTabs(onThemeChange) {
    function handleStorage(event) {
        if (event.key === THEME_KEY || event.key === null) { // null means localStorage was cleared
            const savedTheme = getSavedTheme();
            applyTheme(savedTheme);
            onThemeChange(savedTheme);
        }
    }
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
}
