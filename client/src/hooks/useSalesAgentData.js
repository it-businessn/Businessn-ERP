import { useEffect, useState } from "react";
import UserService from "services/UserService";

const useSalesAgentData = (company, refresh) => {
	const [employees, setEmployees] = useState(null);

	useEffect(() => {
		const fetchAllSalesAgents = async () => {
			try {
				const response = await UserService.getAllSalesAgents(company);
				setEmployees(response.data);
			} catch (error) {
				console.error(error);
			}
		};
		fetchAllSalesAgents();
	}, [company, refresh]);

	return employees;
};

export default useSalesAgentData;
