import { useEffect, useState } from "react";
import PayrollService from "services/PayrollService";

const useEmployeeEEContribution = (
	company,
	payPeriod,
	groupId,
	payrunOption,
	deptName,
	selectedPayGroupOption,
) => {
	const [hours, setHours] = useState(null);

	useEffect(() => {
		const extraRun = payPeriod?.isExtraRun || false;
		const fetchEEContribution = async () => {
			try {
				const { data } = await PayrollService.getEEContribution({
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
			fetchEEContribution();
		}
	}, [company, payPeriod, payrunOption, selectedPayGroupOption]);
	return hours;
};

export default useEmployeeEEContribution;
