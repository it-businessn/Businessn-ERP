import { useEffect, useState } from "react";
import PayrollService from "services/PayrollService";

const useEmployeeGovernment = (company, empId, isOnboarding) => {
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
		if (!isOnboarding) {
			fetchEmployeeGovernmentInfo();
		}
	}, [company, empId, isOnboarding]);
	return governmentInfo;
};

export default useEmployeeGovernment;
