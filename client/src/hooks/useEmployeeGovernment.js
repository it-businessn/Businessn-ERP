import { useEffect, useState } from "react";
import PayrollService from "services/PayrollService";

const useEmployeeGovernment = (company, empId) => {
	const [governmentInfo, setGovernmentInfo] = useState(null);
	useEffect(() => {
		const fetchEmployeeGovernmentInfo = async () => {
			try {
				const response = await PayrollService.getEmployeeGovernmentInfo(
					company,
					empId,
				);
				setGovernmentInfo(response.data);
			} catch (error) {
				console.error(error);
			}
		};
		fetchEmployeeGovernmentInfo();
	}, [company, empId]);
	return governmentInfo;
};

export default useEmployeeGovernment;
