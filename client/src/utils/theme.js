/**
 * THEMES-01: Light (the original look), Dark and Warm.
 * The theme is a `data-app-theme` attribute on <html> (Chakra owns `data-theme`,
 * which it sets to light / dark); App.css redefines the
 * colour variables for it. Dark also switches Chakra to its dark colour mode so
 * dialogs, menus and inputs follow. The choice is remembered per browser.
 */
export const THEMES = [
	{ id: "light", label: "Light" },
	{ id: "dark", label: "Dark" },
	{ id: "warm", label: "Warm" },
];
export const DEFAULT_THEME = "light";
export const THEME_STORAGE_KEY = "app-theme";
// Chakra keeps its colour mode under this key (ColorModeScript reads it)
const CHAKRA_COLOR_MODE_KEY = "chakra-ui-color-mode";

const isTheme = (id) => THEMES.some((theme) => theme.id === id);

export const colorModeFor = (id) => (id === "dark" ? "dark" : "light");

export const getStoredTheme = () => {
	try {
		const id = window.localStorage.getItem(THEME_STORAGE_KEY);
		return isTheme(id) ? id : DEFAULT_THEME;
	} catch {
		return DEFAULT_THEME; // storage blocked (private mode): fall back to light
	}
};

/** Sets the theme on the page and remembers it. Returns the theme applied. */
export const applyTheme = (id) => {
	const theme = isTheme(id) ? id : DEFAULT_THEME;
	document.documentElement.setAttribute("data-app-theme", theme);
	try {
		window.localStorage.setItem(THEME_STORAGE_KEY, theme);
		window.localStorage.setItem(CHAKRA_COLOR_MODE_KEY, colorModeFor(theme));
	} catch {
		/* not remembered, still applied */
	}
	return theme;
};
