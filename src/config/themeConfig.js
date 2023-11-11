import { theme as proTheme } from "@chakra-ui/pro-theme";
import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme(
    {
        colors: {
            brand: {
                300: "#c3dd98",
                500: "#78ab4a",
                600: "#172c44",
            },
        },
        // fonts: {
        //     heading: `'Roboto', sans-serif`,
        //     body: `'Roboto', sans-serif`,
        // },
    },
    // {
    //     styles: {
    //         global: {
    //             body: {
    //                 color: "#172c44",
    //             },
    //             a: {
    //                 _hover: {
    //                     textDecoration: "underline",
    //                 },
    //             },
    //         },
    //     },
    // },
    proTheme
);
export default theme;
