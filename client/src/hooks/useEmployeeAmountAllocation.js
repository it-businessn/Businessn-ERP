import { useEffect, useState } from "react";
import PayrollService from "services/PayrollService";

const useEmployeeAmountAllocation = (company, refresh, payPeriod, groupId) => {
	const [amountInfo, setAmountInfo] = useState(null);

	useEffect(() => {
		const extraRun = payPeriod?.isExtraRun ?? false;
		const fetchEmployeeAmountInfo = async () => {
			try {
				const response = await PayrollService.getAllEmployeeAmountInfo(
					company,
					payPeriod.payPeriodPayDate,
					extraRun,
					groupId,
				);
				setAmountInfo(response.data);
			} catch (error) {
				console.error(error);
			}
		};
		fetchEmployeeAmountInfo();
	}, [company, refresh, payPeriod]);
	return amountInfo;
};

export default useEmployeeAmountAllocation;
