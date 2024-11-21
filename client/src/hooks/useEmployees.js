import { useEffect, useState } from "react";
import UserService from "services/UserService";

const useEmployees = (isRefresh, company, isOnboarding, isPayrollState, userId) => {
	const [employees, setEmployees] = useState(null);
	const [filteredEmployees, setFilteredEmployees] = useState(null);

	const isPayrollActiveState =
		isPayrollState === true
			? isPayrollState
			: isPayrollState?.isPayrollActive && !isPayrollState?.isPayrollInactive;

	const isPayrollInActiveState =
		!isPayrollState?.isPayrollActive && isPayrollState?.isPayrollInactive;

	useEffect(() => {
		const fetchAllEmployees = async () => {
			try {
				const response = isPayrollActiveState
					? await UserService.getPayrollActiveCompanyUsers(company)
					: await UserService.getPayrollInActiveCompanyUsers(company);

				setEmployees(response.data);
				setFilteredEmployees(response.data);
			} catch (error) {
				console.error(error);
			}
		};
		if (!isOnboarding) {
			fetchAllEmployees();
		}
	}, [isRefresh, company, isOnboarding, isPayrollState]);

	useEffect(() => {
		setEmployees(filteredEmployees?.filter((item) => item?._id === userId));
	}, [userId]);

	return { employees, filteredEmployees, setFilteredEmployees };
};

export default useEmployees;
