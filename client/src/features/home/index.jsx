import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LocalStorageService from "services/LocalStorageService";

const SalesHome = () => {
	const [user, setUser] = useState(LocalStorageService.getItem("user"));
	const navigate = useNavigate();

	useEffect(() => {
		if (!user) {
			navigate("/login");
		}
	}, [user]);
	return <></>;
};

export default SalesHome;
