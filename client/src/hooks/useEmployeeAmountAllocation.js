import { useEffect, useState } from "react";
import PayrollService from "services/PayrollService";

const useEmployeeAmountAllocation = (
	company,
	refresh,
	payPeriod,
	groupId,
	payrunOption,
	deptName,
	selectedPayGroupOption,
) => {
	const [amountInfo, setAmountInfo] = useState(null);

	useEffect(() => {
		const extraRun = payPeriod?.isExtraRun ?? false;
		const fetchEmployeeAmountInfo = async () => {
			try {
				const { data } = await PayrollService.getAllEmployeeAmountInfo({
					companyName: company,
					payDate: payPeriod.payPeriodPayDate,
					isExtraRun: extraRun,
					groupId,
					payrunType: payrunOption,
					deptName,
					selectedPayGroupOption,
				});
				setAmountInfo(data);
			} catch (error) {
				console.error(error);
			}
		};
		fetchEmployeeAmountInfo();
	}, [company, refresh, payPeriod, payrunOption, selectedPayGroupOption]);
	return amountInfo;
};

export default useEmployeeAmountAllocation;
