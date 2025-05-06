import { useEffect, useState } from "react";
import UserService from "services/UserService";

const useEmployees = (isRefresh, company, isOnboarding, isPayrollState, userId, deptName) => {
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
				const { data } = isPayrollActiveState
					? await UserService.getPayrollActiveCompanyUsers(company, deptName)
					: isPayrollInActiveState
					? await UserService.getPayrollInActiveCompanyUsers(company, deptName)
					: await UserService.getAllCompanyUsers(company, deptName);

				setEmployees(data);
				setFilteredEmployees(data);
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
