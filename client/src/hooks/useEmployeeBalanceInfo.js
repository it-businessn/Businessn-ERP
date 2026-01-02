import { useEffect, useState } from "react";
import PayrollService from "services/PayrollService";

const useEmployeeBalanceInfo = (company, empId, payPeriodPayDate) => {
	const [balanceInfo, setBalanceInfo] = useState(null);
	useEffect(() => {
		const fetchEmployeeBalanceInfo = async () => {
			try {
				const { data } = await PayrollService.getEmployeeBalanceInfo(
					company,
					empId,
					payPeriodPayDate,
				);
				setBalanceInfo(data);
			} catch (error) {
				console.error(error);
			}
		};
		fetchEmployeeBalanceInfo();
	}, [company, empId]);
	return balanceInfo;
};

export default useEmployeeBalanceInfo;
