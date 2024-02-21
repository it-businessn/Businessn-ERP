import { theme as proTheme } from "@chakra-ui/pro-theme";
import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme(
	{
		colors: {
			brand: {
				100: "#ffffff",
				200: "#858181",
				300: "#d5f8b6",
				400: "#959595",
				500: "##78d624",
				600: "#000000",
				primary_bg: "#f7f7ff",
				nav_color: "#485763",
				icon_hover: "#f2f2f2",
				logo_bg: "#01193d",
				primary_button_bg: "#537eee",
				nav_gradient:
					"linear-gradient(103deg, rgba(244,240,255,1) 0%, rgba(238,239,241,1) 100%)",
			},
		},
	},
	proTheme,
);
export default theme;
