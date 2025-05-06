import { useEffect, useState } from "react";
import UserService from "services/UserService";

const useActiveEmployees = (company) => {
	const [activeUsers, setActiveUsers] = useState(null);

	useEffect(() => {
		const fetchAllActiveEmployees = async () => {
			try {
				const { data } = await UserService.getPayrollActiveCompanyUserCount(company);
				setActiveUsers(data);
			} catch (error) {
				console.error(error);
			}
		};
		fetchAllActiveEmployees();
	}, []);

	return activeUsers;
};

export default useActiveEmployees;
