import { useEffect, useState } from "react";
import PayrollService from "services/PayrollService";

const useEmployeeAmountAllocation = (company, refresh, payPeriod, groupId, payrunOption) => {
	const [amountInfo, setAmountInfo] = useState(null);

	useEffect(() => {
		const extraRun = payPeriod?.isExtraRun ?? false;
		const fetchEmployeeAmountInfo = async () => {
			try {
				const { data } = await PayrollService.getAllEmployeeAmountInfo(
					company,
					payPeriod.payPeriodPayDate,
					extraRun,
					groupId,
					payrunOption,
				);
				setAmountInfo(data);
			} catch (error) {
				console.error(error);
			}
		};
		fetchEmployeeAmountInfo();
	}, [company, refresh, payPeriod, payrunOption]);
	return amountInfo;
};

export default useEmployeeAmountAllocation;
