import "App.css";
import { RouterProvider } from "react-router-dom";
import { router } from "routes";
import { DataProvider } from "./context/DataContext";
import "bootstrap/dist/css/bootstrap.min.css";
import "daterangepicker/daterangepicker.css";

import "jquery";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "daterangepicker/daterangepicker";

const App = ({ theme }) => (
	<>
		<DataProvider>
			<RouterProvider router={router} />
		</DataProvider>
		;
	</>
);

export default App;
