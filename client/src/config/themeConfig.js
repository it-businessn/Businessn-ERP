import { theme as proTheme } from "@chakra-ui/pro-theme";
import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme(
	{
		initialColorMode: "light",
		useSystemColorMode: false,
		// UI-02: consistent controls. Explicit props on a screen still win.
		components: {
			Button: { baseStyle: { borderRadius: "var(--radius)" } },
			// THEMES-01: overlays and tables use the app's themed colours (identical to
			// Chakra's own in Light; in Dark they match the app instead of Chakra's greys)
			Modal: { baseStyle: { dialog: { bg: "var(--surface)" } } },
			Drawer: { baseStyle: { dialog: { bg: "var(--surface)" } } },
			Popover: {
				baseStyle: {
					content: { "--popper-bg": "var(--surface)", bg: "var(--surface)" },
				},
			},
			Menu: {
				baseStyle: {
					list: { "--menu-bg": "var(--surface)", bg: "var(--surface)" },
					item: {
						bg: "var(--surface)",
						_hover: { bg: "gray.100" },
						_focus: { bg: "gray.100" },
					},
				},
			},
			Table: {
				variants: {
					simple: {
						th: { borderColor: "var(--table_border)" },
						td: { borderColor: "var(--table_border)" },
					},
				},
			},
			Select: {
				variants: {
					outline: {
						field: { bg: "var(--input_bg)", borderColor: "var(--filter_border_color)" },
					},
				},
			},
		},
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
