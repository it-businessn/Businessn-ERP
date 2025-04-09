import { redirectLogin } from "api";
import "App.css";
import { useEffect, useState } from "react";
import { RouterProvider } from "react-router-dom";
import { router } from "routes";
import SessionExpiredBanner from "SessionExpiredBanner";
import { checkVersionPeriodically } from "versionCheck";
import { DataProvider } from "./context/DataContext";

const App = ({ theme }) => {
	const [sessionExpired, setSessionExpired] = useState(false);

	const handleClose = () => {
		setSessionExpired(false);
		redirectLogin();
	};

	useEffect(() => {
		setupAxiosInterceptors(setSessionExpired);
		checkVersionPeriodically();
	}, []);

	return (
		<DataProvider>
			{sessionExpired && <SessionExpiredBanner onClose={handleClose} />}
			<RouterProvider router={router} />
		</DataProvider>
	);
};

export default App;
