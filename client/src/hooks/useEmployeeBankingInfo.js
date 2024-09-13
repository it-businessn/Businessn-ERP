import { useEffect, useState } from "react";
import PayrollService from "services/PayrollService";

const useEmployeeBankingInfo = (company, empId, isOnboarding) => {
	const [bankingInfo, setBankingInfo] = useState(null);
	useEffect(() => {
		const fetchEmployeeBankingInfo = async () => {
			try {
				const response = await PayrollService.getEmployeeBankingInfo(
					company,
					empId,
				);
				setBankingInfo(response.data);
			} catch (error) {
				console.error(error);
			}
		};
		if (!isOnboarding) {
			fetchEmployeeBankingInfo();
		}
	}, [company, empId, isOnboarding]);
	return bankingInfo;
};

export default useEmployeeBankingInfo;
