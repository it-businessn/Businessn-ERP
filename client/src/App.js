import { ColorModeScript } from "@chakra-ui/react";
import "App.css";
import { RouterProvider } from "react-router-dom";
import { router } from "routes";
import { DataProvider } from "./context/DataContext";

const App = ({ theme }) => (
	<>
		<DataProvider>
			<RouterProvider router={router} />
		</DataProvider>
		;
	</>
);

export default App;
