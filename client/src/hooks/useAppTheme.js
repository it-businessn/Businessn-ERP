import { useColorMode } from "@chakra-ui/react";
import { useCallback, useState } from "react";
import { applyTheme, colorModeFor, getStoredTheme, THEMES } from "utils/theme";

/** THEMES-01: the current theme and a function to switch it. */
const useAppTheme = () => {
	const { setColorMode } = useColorMode();
	const [theme, setThemeState] = useState(getStoredTheme);

	const setTheme = useCallback(
		(id) => {
			const applied = applyTheme(id);
			setColorMode(colorModeFor(applied));
			setThemeState(applied);
		},
		[setColorMode],
	);

	return { theme, setTheme, themes: THEMES };
};

export default useAppTheme;
