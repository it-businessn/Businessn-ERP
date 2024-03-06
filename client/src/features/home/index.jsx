import CRMDashboard from "features/sales/dashboard";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LocalStorageService from "services/LocalStorageService";

const Home = () => {
	const [user, setUser] = useState(LocalStorageService.getItem("user"));
	const navigate = useNavigate();

	useEffect(() => {
		if (!user) {
			navigate("/login");
		}
	}, [user]);
	return <CRMDashboard />;
};

export default Home;
