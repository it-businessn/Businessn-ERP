import { useEffect, useState } from "react";
import PayrollService from "services/PayrollService";

const useEmployeeEmploymentInfo = (company, empId) => {
	const [employmentInfo, setEmploymentInfo] = useState(null);
	useEffect(() => {
		const fetchEmployeeEmploymentInfo = async () => {
			try {
				const response = await PayrollService.getEmployeeEmploymentInfo(
					company,
					empId,
				);
				setEmploymentInfo(response.data);
			} catch (error) {
				console.error(error);
			}
		};
		fetchEmployeeEmploymentInfo();
	}, [company, empId]);
	return employmentInfo;
};

export default useEmployeeEmploymentInfo;
