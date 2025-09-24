import { useEffect, useState } from "react";
import UserService from "services/UserService";

const useEmployees = (
	isRefresh,
	company,
	isPayrollState,
	userId,
	deptName,
	selectedPayGroupOption,
) => {
	const [employees, setEmployees] = useState(null);
	const [filteredEmployees, setFilteredEmployees] = useState(null);

	const isPayrollActiveState =
		isPayrollState === "Active" || isPayrollState === true || isPayrollState?.isPayrollActive;
	const isPayrollInActiveState = isPayrollState === "Inactive" || isPayrollState?.isPayrollInactive;
	const isPayrollTerminatedState =
		isPayrollState === "Terminated" || isPayrollState?.isPayrollTerminated;

	useEffect(() => {
		const fetchAllEmployees = async () => {
			try {
				const { data } = isPayrollActiveState
					? await UserService.getPayrollActiveCompanyUsers(
							company,
							deptName,
							selectedPayGroupOption,
					  )
					: isPayrollInActiveState
					? await UserService.getPayrollInActiveCompanyUsers(
							company,
							deptName,
							selectedPayGroupOption,
					  )
					: isPayrollTerminatedState
					? await UserService.getPayrollTerminatedCompanyUsers(
							company,
							deptName,
							selectedPayGroupOption,
					  )
					: await UserService.getCompanyUsers(company);
				setEmployees(data);
				setFilteredEmployees(data);
			} catch (error) {
				console.error(error);
			}
		};
		if (selectedPayGroupOption) fetchAllEmployees();
	}, [isRefresh, company, isPayrollState, selectedPayGroupOption]);

	useEffect(() => {
		if (userId) setEmployees(filteredEmployees?.filter((item) => item?._id === userId));
	}, [userId]);

	return { employees, filteredEmployees, setFilteredEmployees };
};

export default useEmployees;
