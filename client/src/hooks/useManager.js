import { useEffect, useState } from "react";
import UserService from "services/UserService";

const useManager = (company) => {
	const [managers, setManagers] = useState(null);

	useEffect(() => {
		const fetchAllManagers = async () => {
			try {
				const { data } = await UserService.getAllCompManagers(company);
				setManagers(data);
			} catch (error) {
				console.error(error);
			}
		};
		fetchAllManagers();
	}, [company]);

	return managers;
};

export default useManager;
