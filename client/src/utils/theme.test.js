import { applyTheme, colorModeFor, getStoredTheme, THEME_STORAGE_KEY } from "./theme";

afterEach(() => {
	window.localStorage.clear();
	document.documentElement.removeAttribute("data-app-theme");
});

test("TH-01 light by default; a saved theme is restored; unknown values fall back to light", () => {
	expect(getStoredTheme()).toBe("light");
	window.localStorage.setItem(THEME_STORAGE_KEY, "warm");
	expect(getStoredTheme()).toBe("warm");
	window.localStorage.setItem(THEME_STORAGE_KEY, "neon");
	expect(getStoredTheme()).toBe("light");
});

test("TH-02 applying a theme sets the page attribute and remembers it (Chakra dark only for Dark)", () => {
	expect(applyTheme("dark")).toBe("dark");
	expect(document.documentElement.getAttribute("data-app-theme")).toBe("dark");
	expect(window.localStorage.getItem(THEME_STORAGE_KEY)).toBe("dark");
	expect(window.localStorage.getItem("chakra-ui-color-mode")).toBe("dark");
	applyTheme("warm");
	expect(window.localStorage.getItem("chakra-ui-color-mode")).toBe("light");
	expect(colorModeFor("light")).toBe("light");
	expect(applyTheme("bogus")).toBe("light");
});
