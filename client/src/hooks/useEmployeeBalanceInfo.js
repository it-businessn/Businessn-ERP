import { useEffect, useState } from "react";
import PayrollService from "services/PayrollService";

const useEmployeeBalanceInfo = (company, empId) => {
	const [balanceInfo, setBalanceInfo] = useState(null);
	useEffect(() => {
		const fetchEmployeeBalanceInfo = async () => {
			try {
				const response = await PayrollService.getEmployeeBalanceInfo(
					company,
					empId,
				);
				setBalanceInfo(response.data);
			} catch (error) {
				console.error(error);
			}
		};
		fetchEmployeeBalanceInfo();
	}, [company, empId]);
	return balanceInfo;
};

export default useEmployeeBalanceInfo;
