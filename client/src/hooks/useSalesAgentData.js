import { useEffect, useState } from "react";
import UserService from "services/UserService";

const useSalesAgentData = (company, refresh, isDashboard) => {
	const [employees, setEmployees] = useState(null);

	useEffect(() => {
		const fetchAllSalesAgents = async () => {
			try {
				const { data } = isDashboard
					? await UserService.getAllSalesAgentsDashboard(company)
					: await UserService.getAllSalesAgents(company);
				setEmployees(data);
			} catch (error) {
				console.error(error);
			}
		};
		fetchAllSalesAgents();
	}, [company, refresh]);

	return employees;
};

export default useSalesAgentData;
