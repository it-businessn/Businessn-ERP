import { theme as proTheme } from "@chakra-ui/pro-theme";
import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme(
  {
    colors: {
      brand: {
        100: "#fff",
        200: "#858181",
        300: "#d5f8b6",
        400: "#959595",
        500: "##78d624",
        600: "#000000",
      },
    },
  },
  proTheme
);
export default theme;
