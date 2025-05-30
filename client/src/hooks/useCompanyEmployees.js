import { useEffect, useState } from "react";
import UserService from "services/UserService";

const useCompanyEmployees = (company, deptName, selectedPayGroupName) => {
	const [employees, setEmployees] = useState(null);

	useEffect(() => {
		const fetchAllEmployees = async () => {
			try {
				const { data } = await UserService.getAllCompanyUsers(
					company,
					deptName,
					selectedPayGroupName,
				);
				data.map((emp) => {
					emp.fullName = emp?.empId?.fullName;
					emp._id = emp?.empId?._id;
					return emp;
				});
				setEmployees(data);
			} catch (error) {
				console.error(error);
			}
		};
		if (selectedPayGroupName) fetchAllEmployees();
	}, [company, selectedPayGroupName]);

	return employees;
};

export default useCompanyEmployees;
