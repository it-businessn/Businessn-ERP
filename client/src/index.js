import { ChakraProvider, ColorModeScript } from "@chakra-ui/react";
import App from "App";
import proTheme from "config/themeConfig";
import { AuthContextProvider } from "context/AuthContext";
import ReactDOM from "react-dom/client";
import { applyTheme, colorModeFor, getStoredTheme } from "utils/theme";
// import registerServiceWorker from "registerServiceWorker";
import "./App.css";

// THEMES-01: apply the saved theme before the first paint (no flash of light)
const startTheme = applyTheme(getStoredTheme());

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
	<ChakraProvider theme={proTheme}>
		<AuthContextProvider>
			<ColorModeScript initialColorMode={colorModeFor(startTheme)} />
			<App />
		</AuthContextProvider>
	</ChakraProvider>,
);
// registerServiceWorker();
