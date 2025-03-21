import { useEffect, useState } from "react";
import UserService from "services/UserService";

const useCompanyEmployees = (company, deptName) => {
	const [employees, setEmployees] = useState(null);

	useEffect(() => {
		const fetchAllEmployees = async () => {
			try {
				const { data } = await UserService.getAllCompanyUsers(company, deptName);
				setEmployees(data);
			} catch (error) {
				console.error(error);
			}
		};
		fetchAllEmployees();
	}, [company]);

	return employees;
};

export default useCompanyEmployees;
