import { theme as proTheme } from "@chakra-ui/pro-theme";
import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme(
	{
		initialColorMode: "light",
		useSystemColorMode: false,
		colors: {
			// Chakra's standard "facebook" palette. The pro theme does not include it,
			// but 59 components use colorScheme="facebook" (mostly checkboxes); without
			// it a checked box had no background and its white tick was invisible.
			facebook: {
				50: "#E8F4F9",
				100: "#D9DEE9",
				200: "#B7C2DA",
				300: "#6482C0",
				400: "#4267B2",
				500: "#385898",
				600: "#314E89",
				700: "#29487D",
				800: "#223B67",
				900: "#1E355B",
			},
			brand: {
				// priority_medium: "#e9a923",
				// task_status_color: "#76c094",
			},
		},
	},
	proTheme,
);
export default theme;
