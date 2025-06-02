import { useEffect, useState } from "react";
import PayrollService from "services/PayrollService";

const useEmployeeERContribution = (
	company,
	payPeriod,
	groupId,
	payrunOption,
	deptName,
	selectedPayGroupOption,
) => {
	const [hours, setHours] = useState(null);

	useEffect(() => {
		const extraRun = payPeriod?.isExtraRun ?? false;
		const fetchERContribution = async () => {
			try {
				const { data } = await PayrollService.getERContribution({
					companyName: company,
					startDate: payPeriod.payPeriodStartDate,
					endDate: payPeriod.payPeriodEndDate,
					payDate: payPeriod?.payPeriodPayDate,
					isExtraRun: extraRun,
					groupId,
					payrunType: payrunOption,
					deptName,
					selectedPayGroupOption,
				});
				setHours(data);
			} catch (error) {
				console.error(error);
			}
		};
		if (payPeriod && selectedPayGroupOption) {
			fetchERContribution();
		}
	}, [company, payPeriod, payrunOption, selectedPayGroupOption]);
	return hours;
};

export default useEmployeeERContribution;
