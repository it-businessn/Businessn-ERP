import { ChakraProvider } from "@chakra-ui/react";
import App from "App";
import proTheme from "config/themeConfig";
import { AuthContextProvider } from "context/AuthContext";
import ReactDOM from "react-dom/client";
import registerServiceWorker from "registerServiceWorker";
import "./App.css";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <ChakraProvider theme={proTheme}>
    <AuthContextProvider>
      <App />
    </AuthContextProvider>
  </ChakraProvider>
);
registerServiceWorker();
