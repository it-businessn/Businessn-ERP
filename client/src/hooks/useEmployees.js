import { useEffect, useState } from "react";
import UserService from "services/UserService";

const useEmployees = (isRefresh, company, isOnboarding) => {
	const [employees, setEmployees] = useState(null);
	const [filteredEmployees, setFilteredEmployees] = useState(null);

	useEffect(() => {
		const fetchAllEmployees = async () => {
			try {
				const response = await UserService.getAllCompanyUsers(company);
				setEmployees(response.data);
				setFilteredEmployees(response.data);
			} catch (error) {
				console.error(error);
			}
		};
		if (!isOnboarding) {
			fetchAllEmployees();
		}
	}, [isRefresh, company, isOnboarding]);

	return { employees, filteredEmployees, setFilteredEmployees };
};

export default useEmployees;
