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
		navigate("sales-dashboard");
	}, [user]);
	return <></>;
};

export default Home;
