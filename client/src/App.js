import { setupAxiosInterceptors } from "api";
import "App.css";
import { useEffect, useState } from "react";
import { RouterProvider } from "react-router-dom";
import { router } from "routes";
import SessionExpiredBanner from "SessionExpiredBanner";
import { DataProvider } from "./context/DataContext";

const App = ({ theme }) => {
	const [sessionExpired, setSessionExpired] = useState(false);

	const handleClose = () => {
		setSessionExpired(false);
		window.location.href = "/login";
	};

	useEffect(() => {
		setupAxiosInterceptors(setSessionExpired);
	}, []);

	return (
		<DataProvider>
			{sessionExpired && <SessionExpiredBanner onClose={handleClose} />}
			<RouterProvider router={router} />
		</DataProvider>
	);
};

export default App;
