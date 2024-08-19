import { useEffect, useState } from "react";
import PayrollService from "services/PayrollService";

const useEmployeeHoursWorked = (company, payPeriod, groupId) => {
	const [hours, setHours] = useState(null);

	useEffect(() => {
		const extraRun = payPeriod?.isExtraRun ?? false;
		const fetchHoursWorkedInfo = async () => {
			try {
				const response = await PayrollService.getHoursWorkedAllocation(
					company,
					payPeriod.payPeriodStartDate,
					payPeriod.payPeriodEndDate,
					payPeriod?.payPeriodPayDate,
					extraRun,
					groupId,
				);
				setHours(response.data);
			} catch (error) {
				console.error(error);
			}
		};
		if (payPeriod) {
			fetchHoursWorkedInfo();
		}
	}, [company, payPeriod]);
	return hours;
};

export default useEmployeeHoursWorked;
