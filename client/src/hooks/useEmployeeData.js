import { useEffect, useState } from "react";
import UserService from "services/UserService";

const useEmployeeData = (company) => {
	const [employees, setEmployees] = useState(null);

	useEffect(() => {
		const fetchAllEmployees = async () => {
			try {
				const response = await UserService.getAllSalesAgents(company);
				setEmployees(response.data);
			} catch (error) {
				console.error(error);
			}
		};
		fetchAllEmployees();
	}, [company]);

	return employees;
};

export default useEmployeeData;
