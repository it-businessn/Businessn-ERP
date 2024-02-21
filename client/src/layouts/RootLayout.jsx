import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import LocalStorageService from "services/LocalStorageService";
import DashboardLayout from "./DashboardLayout";

const RootLayout = () => {
	const [user, setUser] = useState(LocalStorageService.getItem("user"));

	const navigate = useNavigate();

	useEffect(() => {
		if (!user) {
			navigate("/login");
		}
	}, [user]);

	const handleLogout = () => {
		setUser(LocalStorageService.removeItem("user"));
	};

	return (
		<>
			{user && (
				<DashboardLayout handleLogout={handleLogout} user={user}>
					<main className="main_content">
						<Outlet />
					</main>
				</DashboardLayout>
			)}
		</>
	);
};

export default RootLayout;
