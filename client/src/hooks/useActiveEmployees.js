import { useEffect, useState } from "react";
import UserService from "services/UserService";

const useActiveEmployees = (company) => {
	const [activeUsers, setActiveUsers] = useState(null);

	useEffect(() => {
		const fetchAllActiveEmployees = async () => {
			try {
				const response = await UserService.getPayrollActiveCompanyUsers(
					company,
				);
				setActiveUsers(response.data);
			} catch (error) {
				console.error(error);
			}
		};
		fetchAllActiveEmployees();
	}, []);

	return activeUsers;
};

export default useActiveEmployees;
