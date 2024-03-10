import { theme as proTheme } from "@chakra-ui/pro-theme";
import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme(
	{
		colors: {
			brand: {
				100: "var(--main_color)",
				200: "var(--menu_item_color)",
				400: "var(--gray2_color)",
				500: "##78d624",
				600: "var(--main_color_black)",
				700: "#E2E8F0",
				primary_bg: "#f7f7ff",
				nav_color: "#485763",
				icon_hover: "#f2f2f2",
				logo_bg: "#01193d",
				primary_button_bg: "var(--primary_button_bg)",
				nav_gradient: "var(--nav_gradient)",
				priority_medium: "#e9a923",
				task_status_color: "#76c094",
			},
		},
	},
	proTheme,
);
export default theme;
