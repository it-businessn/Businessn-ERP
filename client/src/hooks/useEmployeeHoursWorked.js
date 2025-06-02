import { useEffect, useState } from "react";
import PayrollService from "services/PayrollService";

const useEmployeeHoursWorked = (
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
		const fetchHoursWorkedInfo = async () => {
			try {
				const { data } = await PayrollService.getHoursWorkedAllocationByType({
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
			fetchHoursWorkedInfo();
		}
	}, [company, payPeriod, payrunOption, selectedPayGroupOption]);
	return hours;
};

export default useEmployeeHoursWorked;
