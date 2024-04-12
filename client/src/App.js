import "App.css";
import { RouterProvider } from "react-router-dom";
import { router } from "routes";
import { DataProvider } from "./context/DataContext";

const App = () => {
	return (
		<DataProvider>
			<RouterProvider router={router} />
		</DataProvider>
	);
};

export default App;
