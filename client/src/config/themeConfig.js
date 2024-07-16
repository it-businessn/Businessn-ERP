import { theme as proTheme } from "@chakra-ui/pro-theme";
import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme(
	{
		initialColorMode: "light",
		useSystemColorMode: false,
		colors: {
			brand: {
				// priority_medium: "#e9a923",
				// task_status_color: "#76c094",
			},
		},
	},
	proTheme,
);
export default theme;
