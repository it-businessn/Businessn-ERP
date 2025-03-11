import { useEffect, useState } from "react";
import PayrollService from "services/PayrollService";

const useEmployeeGovernment = (company, empId, isOnboarding, refresh) => {
	const [governmentInfo, setGovernmentInfo] = useState(null);
	useEffect(() => {
		const fetchEmployeeGovernmentInfo = async () => {
			try {
				const { data } = await PayrollService.getEmployeeGovernmentInfo(company, empId);
				setGovernmentInfo(data);
			} catch (error) {
				console.error(error);
			}
		};
		// if (!isOnboarding) {
		fetchEmployeeGovernmentInfo();
		// }
	}, [company, empId, isOnboarding, refresh]);
	return governmentInfo;
};

export default useEmployeeGovernment;
